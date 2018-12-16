import Drawable from "../interface/Drawable";
import GL from '../GL'
import { mat4, flatten } from "../MV";
import { Material } from "../interface/Material";
import { NoneMaterial } from "../materials/NoneMaterial";
import {Util} from "../Util";
import {CustomizedMaterial} from "../materials/CustomizedMaterial";
import { Cube, Tri_prism, Rect_pyramid, HalfCircle3D } from "./Basis/Basis";
export class Church implements Drawable{
    material: Material;
    setMaterial(m: Material) {
        throw new Error("Method not implemented.");
    }
    buffers: any;
    public building:Array<Cube>;
    public roof:Array<any>;
    public door:Array<any>;
    public window:Array<any>;
    constructor(position:Array<number>){//size = 6*6
        let [x,y,z] = position;
        this.material = new NoneMaterial;
        this.building = [
            new Cube(4,5,4,[x,y,z]),
            new Cube(1.5,6,1.5,[x-1,y,z+1]),
            new Cube(1.5,6,1.5,[x+3.5,y,z+1]),
            new Cube(1.5,6,1.5,[x-1,y,z-3.5]),
            new Cube(1.5,6,1.5,[x+3.5,y,z-3.5])
        ];
        this.roof = [
            new Tri_prism(4,0.8,4,[x,y+4.9999,z]),
            new Rect_pyramid(1.5,1.2,[x-1,y+5.9999,z+1]),
            new Rect_pyramid(1.5,1.2,[x+3.5,y+5.9999,z+1]),
            new Rect_pyramid(1.5,1.2,[x-1,y+5.9999,z-3.5]),
            new Rect_pyramid(1.5,1.2,[x+3.5,y+5.9999,z-3.5])
        ];
        this.door = [
            new Cube(1.8,2,0.01,[x+1.1,0,0.005]),
            new HalfCircle3D(0.9,0.9,[x+1.1,y+2,z+0.00001]),
        ];
        this.window = [
            new Cube(0.6,0.8,0.01,[x-0.55,y,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x-0.55,y+0.8,z+1.000001]),
            new Cube(0.6,0.8,0.01,[x-0.55,y+2,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x-0.55,y+2.8,z+1.000001]),
            new Cube(0.6,0.8,0.01,[x-0.55,y+4,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x-0.55,y+4.8,z+1.000001]),
            new Cube(0.6,0.8,0.01,[x+3.95,y,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x+3.95,y+0.8,z+1.000001]),
            new Cube(0.6,0.8,0.01,[x+3.95,y+2,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x+3.95,y+2.8,z+1.000001]),
            new Cube(0.6,0.8,0.01,[x+3.95,y+4,z+1.0005]),
            new HalfCircle3D(0.3,0.3,[x+3.95,y+4.8,z+1.000001]),
        ]
    }
    initBuffer(gl: GL): void {
        let _gl = gl.gl;
        this.buffers={
            positions:{}
        }
        //building
        this.buffers.positions.building = [];
        for(let i in this.building){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.building.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.building[i].vertices), _gl.STATIC_DRAW);
        }
        //roof
        this.buffers.positions.roof = [];
        for(let i in this.roof){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.roof.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.roof[i].vertices), _gl.STATIC_DRAW);
        }
        //door
        this.buffers.positions.door = [];
        for(let i in this.door){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.door.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.door[i].vertices), _gl.STATIC_DRAW);
        }
        //window
        this.buffers.positions.window = [];
        for(let i in this.window){
            let tempPBuf = _gl.createBuffer();
            this.buffers.positions.window.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.window[i].vertices), _gl.STATIC_DRAW);
        }
        //wall
        // this.buffers.positions.wall = [];
        // for(let i in this.wall){
        //     let tempPBuf = _gl.createBuffer();
        //     this.buffers.positions.wall.push(tempPBuf);
        //     _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
        //     _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.wall[i].vertices), _gl.STATIC_DRAW);
        // }
   
    }
    draw(gl: GL, self: boolean = true): void {
        let _gl = gl.gl;
    //光照处理
    let lt = gl.currentLight;
    let ambientProduct = Util.Vec4Mult(lt.lightAmbient, this.material.materialAmbient);
    let diffuseProduct = Util.Vec4Mult(lt.lightDiffuse, this.material.materialDiffuse);
    let specularProduct = Util.Vec4Mult(lt.lightSpecular, this.material.materialSpecular);
    _gl.uniform4fv(gl.programInfo.uniformLocations.ambientVectorLoc, new Float32Array(ambientProduct));
    _gl.uniform4fv(gl.programInfo.uniformLocations.diffuseVectorLoc, new Float32Array(diffuseProduct));
    _gl.uniform4fv(gl.programInfo.uniformLocations.specularVectorLoc, new Float32Array(specularProduct));
    _gl.uniform1f(gl.programInfo.uniformLocations.shininessLoc, this.material.materialShininess);

    _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(mat4()));
        //building
        _gl.enableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);
        for (let i in this.building) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.building[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.building[i].vertices.length / 3)
        }
        //roof
        for (let i in this.roof) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.roof[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.roof[i].vertices.length / 3)
        }
        //door
        for (let i in this.door) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.door[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.door[i].vertices.length / 3)
        }
        //window
        for (let i in this.window) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.window[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.window[i].vertices.length / 3)
        }
         //wall
        //  for (let i in this.wall) {
        //      _gl.bindBuffer(_gl.ARRAY_BUFFER, this.buffers.positions.wall[i]);
        //      _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        //      _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.wall[i].vertices.length / 3)
        //  }

        //  _gl.disableVertexAttribArray(gl.programInfo.attribLocations.vertexPosition);

    }

}