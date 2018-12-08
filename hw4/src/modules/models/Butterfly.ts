import { Ellipsoid, HalfWing } from './Basis';
import { Translatable } from '../interface/Translatable';
import Drawable from '../interface/Drawable'
import { flatten } from '../MV'
import GL from '../GL';
import { Util } from '../Util';

export class ButterFly extends Translatable implements Drawable {
    buffers: any;

    public body: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public LeftWing: HalfWing;
    public RightWing: HalfWing;
    public lines;
    constructor() {
        super();
        this.body = new Ellipsoid(0.07, 0.3, [0, 0, 0], [1, 0.8559, 0.73843, 1.0]);

        this.eyes = [
            new Ellipsoid(0.023, 0.02, [0.045, 0.2, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [-0.045, 0.2, 0], '0x000000'),
            new Ellipsoid(0.02, 0.02, [0.15, 0.6, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.15, 0.6, 0], '0x000000f0')

        ];
        this.LeftWing = new HalfWing(0.95);
        this.RightWing = new HalfWing(0.95, false);

        this.lines = [
            -0.008, 0.3, 0, -0.15, 0.6, 0,
            0.008, 0.3, 0, 0.15, 0.6, 0
        ];
        // let LinesOnWings = [1, 2];
        // for (let j of LinesOnWings) {
        //     let centerPoint = [
        //         ...this.flatWings[j].slice(0, 2),
        //         this.flatWings[j][2] * 1.5
        //     ];
        //     for (let i = 0; i < this.flatWings[j].length; i += 3) {
        //         this.lines.push(...centerPoint);
        //         this.lines.push(...this.flatWings[j].slice(i, i + 2), centerPoint[2]);
        //     }
        // }
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        this.buffers = {
            positions: {},
            colors: {}
        }
        //body
        this.buffers.positions.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.vertices), _gl.STATIC_DRAW);

        this.buffers.colors.body = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.body);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body.colors), _gl.STATIC_DRAW);
        //eyes
        this.buffers.positions.eyes = [];
        this.buffers.colors.eyes = [];
        for (let i in this.eyes) {
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            this.buffers.colors.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);

        }
        this.LeftWing.initBuffer(gl);
        this.RightWing.initBuffer(gl);

        //lines
        let lineBuf = _gl.createBuffer();
        this.buffers.positions.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
    }

    public draw(gl: GL): void {
        let _gl = gl.gl;
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));

        //body
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.body);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.LINES, 0, this.body.vertices.length / 3)
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body.vertices.length / 3)

        //eyes
        for (let i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.colors.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3)
        }

        _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexColor);
        //lines

        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3)

        //wings
        this.RightWing.draw(gl);
        this.LeftWing.draw(gl);
    }
    public rotate(delta: number, related = true, axisType = 0): boolean {
        this.LeftWing.rotate(delta, related, axisType);
        this.RightWing.rotate(delta, related, axisType);
        return super.rotate(delta, related, axisType);
    }
    public translate(distance: number, direction: number, related=true) {
        this.LeftWing.translate(distance, direction, related);
        this.RightWing.translate(distance, direction, related);
        return super.translate(distance, direction, related);
    }
    public flap(degree:number):void{
        this.LeftWing.rotate(degree,true,5,false)
        this.RightWing.rotate(-degree,true,5,false)
    }
    public fall(lastTime:number,speedX:number):number{
        let decrease=-9.8*lastTime;
        let x=Math.sqrt(this.direction[0]**2+this.direction[2]**2);
        let y=this.direction[1];
        let a=speedX
        let b=speedX*y/x;

        let alpha=Math.atan(y/x),beta=Math.atan((b+decrease)/a);
        let deflection=Util.degree(alpha-beta);
        console.log(alpha,beta,alpha-beta);
        this.rotate(deflection,true,4);
        return decrease;
    }
    public moveForward(distance:number):void{
        this.translate(distance,0);
    }
    public fly(speedX:number):number{
        let decrease=5;
        let x=Math.sqrt(this.direction[0]**2+this.direction[2]**2);
        let y=this.direction[1];
        let a=speedX
        let b=speedX*y/x;

        let alpha=Math.atan(y/x),beta=Math.atan((b+decrease)/a);
        let deflection=Util.degree(alpha-beta);
        console.log(alpha,beta,alpha-beta);
        this.rotate(deflection,true,4);
        return decrease;
    }
}