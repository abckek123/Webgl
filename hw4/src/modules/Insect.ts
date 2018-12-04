import {Ellipsoid} from './basis';
import {Translatable} from './translatable';
import GL from './GL';
import {flatten} from './MV'
export class Insect extends Translatable {
    public body: Array<Ellipsoid>;
    public head: Ellipsoid;
    public eyes: Array<Ellipsoid>;
    public lines:Array<number>;
    constructor() {
        super();
        this.direction = [0, 1, 0, 1];
        this.baseDirection = [0, 1, 0, 1];
        this.axisMain = [0, 0, 1, 1];
        this.baseAxisMain = [0, 0, 1, 1];
        this.position = [0, 0, 0, 1];
        this.basePosition = [0, 0, 0, 1];
        this.body = [
            new Ellipsoid(0.1, 0.1, [-0.06, 0.3, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.10, 0.15, 0], [0, 1, 0, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.16, 0, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [-0.07, -0.15, 0], [0, 1, 0, 1.0]),
            new Ellipsoid(0.1, 0.1, [0, -0.3, 0], [0.196, 0.80392, 0.196, 1.0]),
            new Ellipsoid(0.1, 0.1, [0.06, -0.45, 0], [0, 1, 0, 1.0]),
        ];

        this.head = new Ellipsoid(0.13, 0.11, [0, 0.45, 0], [0, 1, 0, 1.0]);
        this.eyes = [
            new Ellipsoid(0.023, 0.02, [0.05, 0.55, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [-0.05, 0.55, 0], '0x000000'),
            new Ellipsoid(0.023, 0.02, [0, 0.55, 0.08], '0x000000'),
            new Ellipsoid(0.02, 0.02, [0.1, 0.75, -0.15], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.1, 0.75, -0.15], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.2, 0.4, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.1, 0.35, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.25, 0.2, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.07, 0.15, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.33, 0, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.02, 0, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.25, -0.15, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.17, -0.3, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.18, -0.25, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [-0.13, -0.41, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.23, -0.4, 0], '0x000000f0'),
            new Ellipsoid(0.02, 0.02, [0.1, -0.1, 0], '0x000000f0')
        ];

        this.lines = [
            0, 0.45, 0, -0.1, 0.75, -0.15,
            0, 0.45, 0, 0.1, 0.75, -0.15,
            -0.06, 0.3, 0, -0.2, 0.4, 0,
            -0.03, 0.3, 0, 0.1, 0.35, 0,
            0, 0.15, 0, -0.25, 0.2, 0,
            0.0, 0.15, 0, 0.07, 0.15, 0,
            -0.16, 0, 0, -0.33, 0, 0,
            -0.13, 0, 0, 0.02, 0, 0,
            -0.07, -0.15, 0, -0.25, -0.15, 0,
            0, -0.15, 0, 0.1, -0.1, 0,
            -0.06, -0.32, 0, -0.17, -0.3, 0,
            -0.03, -0.3, 0, 0.18, -0.25, 0,
            0.06, -0.45, 0, -0.13, -0.41, 0,
            0.06, -0.45, 0, 0.23, -0.4, 0
        ];
    }
    public initBuffer(gl: GL) {
        let _gl = gl.gl;
        //body
        gl.buffers1.positions.insect.body = [];
        gl.buffers1.colors.insect.body = [];
        for (let i in this.body) {
            let tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.body.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            gl.buffers1.colors.insect.body.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.body[i].colors), _gl.STATIC_DRAW);
        }
        //head
        gl.buffers1.positions.insect.head = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.head);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.head.vertices), _gl.STATIC_DRAW);

        gl.buffers1.colors.insect.head = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.head);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.head.colors), _gl.STATIC_DRAW);
        //eyes
        gl.buffers1.positions.insect.eyes = [];
        gl.buffers1.colors.insect.eyes = [];
        for (let i in this.eyes) {
            let tempPBuf = _gl.createBuffer();
            gl.buffers1.positions.insect.eyes.push(tempPBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempPBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].vertices), _gl.STATIC_DRAW);

            let tempCBuf = _gl.createBuffer();
            gl.buffers1.colors.insect.eyes.push(tempCBuf);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, tempCBuf);
            _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.eyes[i].colors), _gl.STATIC_DRAW);

        }

        //lines
        let lineBuf = _gl.createBuffer();
        gl.buffers1.positions.insect.lines = lineBuf;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, lineBuf);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(this.lines), _gl.STATIC_DRAW);
    }
    public draw(gl: GL, clear = true) {
        let _gl = gl.gl;
        if (clear) {
            _gl.clearColor(0.0, 0.0, 0.0, 1.0);
            _gl.clearDepth(1.0);
        }
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.modelViewMatrix, false, flatten(this.modelMatrix));
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.cameraMatrixLoc, false, flatten(gl.cameraMatrix));
        _gl.uniformMatrix4fv(gl.programInfo.uniformLocations.projectionMatrixLoc, false, flatten(gl.projectionMatrix));

        //body
        for (let i in this.body) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.body[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.body[i].vertices.length / 3)
        }
        //head
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.head);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, this.head.vertices.length / 3)
        //eyes
        for (let i in this.eyes) {
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
            _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.colors.insect.eyes[i]);
            _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexColor, 4, _gl.FLOAT, false, 0, 0);

            _gl.drawArrays(_gl.TRIANGLE_FAN, 0, this.eyes[i].vertices.length / 3)
        }

        //lines
        _gl.bindBuffer(_gl.ARRAY_BUFFER, gl.buffers1.positions.insect.lines);
        _gl.vertexAttribPointer(gl.programInfo.attribLocations.vertexPosition, 3, _gl.FLOAT, false, 0, 0);
        _gl.drawArrays(_gl.LINES, 0, this.lines.length / 3)

    }
}