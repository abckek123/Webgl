import Vue from 'vue/dist/vue.js'
import GL from './modules/GL';
import Camera from './modules/models/Camera';
import { ButterFly } from './modules/models/Butterfly';
import { Ground } from './modules/models/Ground';
import { House } from './modules/models/House';
import { Ellipsoid } from './modules/models/Basis/Ellipsoid';
import { rotateY, rotateX, rotateZ } from './modules/MV';
import { Util } from './modules/Util';

var _gl = new GL;
let but = new ButterFly;
 let ball = new Ellipsoid(20, 50, [0, 0, 0], '0xfffff');
// ball.translate(50,1);
//but.translate(10, 2);
but.rotate(90, true, 4);//,ball,
let camera1=new Camera;
let [radius,theta,phi]=[200, -63, 36]
_gl.addCameras(camera1);
_gl.switchCamera(camera1);
camera1.view(radius,theta,phi);
_gl.addObjects(but,new House([0, -2, 0]),new Ground([0, -10, 0], 500));
let stateButterFly = {
    butt: but,
    height: 10,
    speedX: 5,
    speedY: 0,
    get speed(): number {
        return Math.sqrt(this.speedX ** 2 + this.speedY ** 2)
    },
    turn: {
        state: 0,             //0为可变状态
        $degree: 0,
        set degree(val) {
            if (!this.state) {

            }
        }
    }
}
let camera = new Vue({
    el: '#camera',
    data() {
        return {
            camera: camera1,
            glOb: _gl,
            theta: theta,
            phi: phi,
            radius: radius,
            animeHandle: 0
        }
    },
    watch: {
        theta(val) {
            this.theta=parseInt(val);
            this.change();
        },
        phi(val) {
            this.phi=parseInt(val);
           this.change();
        },
        radius(val) {
            this.radius=parseFloat(val);
            this.change();
        }
    },
    methods: {
        change() {
            this.camera.view(this.radius, this.theta, this.phi);

                this.glOb.drawScene();

        },
        play() {
            let then = performance.now() * 0.001, start = then;
            let range = 45 * 2;
            let degree = 0, flap = 1;

            let c = this.camera;
            //c.bind(but);
            function _draw(now: number) {
                now *= 0.001;
                let lastTime = now - then;
                //翅膀扇动
                let relatedDegree = (lastTime * (flap + 2)) * flap * 50;
                if (Math.abs(degree + relatedDegree) > range / 2) {
                    relatedDegree *= -1;
                    flap *= -1;
                }
                but.flap(relatedDegree);

                //蝴蝶下坠并随时间加速
                let speedUp= (now - start) * 0.1;
                stateButterFly.speedY += but.fall(lastTime, stateButterFly.speedX);
                but.moveForward(stateButterFly.speed * lastTime)

                c.translateC();
                _gl.drawScene();
                then = now;
                degree += relatedDegree;
                camera.animeHandle = requestAnimationFrame(_draw);
            }
            function _draw2(now: number) {
                now *= 0.001;
                let lastTime = now - then;
                //ball.rotate(15*lastTime,true,2);
                //ball.rotate(15*lastTime,true,1);
                //翅膀扇动
                let relatedDegree = (lastTime * (flap + 2)) * flap * 50;
                if (Math.abs(degree + relatedDegree) > range / 2) {
                    relatedDegree *= -1;
                    flap *= -1;
                }
                but.flap(relatedDegree);

                _gl.currentLight.lightPosition=Util.Mat4Vec(rotateX(50*lastTime),_gl.currentLight.lightPosition)
                // _gl.currentLight.lightPosition=Util.Mat4Vec(rotateZ(50*lastTime),_gl.currentLight.lightPosition)
                _gl.drawScene();
                then = now;
                degree += relatedDegree;
                camera.animeHandle = requestAnimationFrame(_draw2);
            }
            this.animeHandle = requestAnimationFrame(_draw2);
        },
        stop() {
            cancelAnimationFrame(this.animeHandle);
            this.animeHandle = 0;
        }
    }
})
// but.rotate(-30, true, 4);
//camera.play();
let mousedown = false;
let ele = document.getElementById('gl-canvas');
if (ele) {
    ele.onmousedown = function (e) {
        mousedown = true;
    };
    ele.onmouseup = function (e) {
        mousedown = false;
    }
    ele.onmousemove = function (e) {
        if (mousedown) {
            camera.theta = ((camera.theta) + (e.movementX) * -0.8) % 360;
            camera.phi = ((camera.phi) + (e.movementY) * 0.8) % 360;
        }
    }
    window.onwheel = function (e) {
        let temp=0;
        if(camera.radius<50){
             temp= (camera.radius) + e.deltaY/50 ;
        }else{
            temp = (camera.radius) + e.deltaY/5 ;
        }
        if (temp <= 0 )
            return;
        camera.radius = temp;
    }
    window.onkeydown = function (e) {
        switch (e.keyCode) {
            case 32://空格
                stateButterFly.speedY += but.fly(stateButterFly.speedX);
                break;
            case 37://←
                but.rotate(-5, true, 5);
                break;
            case 38://↑
                but.translate(0.3, 0);
                break;
            case 39://→
                but.rotate(5, true, 5);
                break;
            case 40://↓
                but.translate(-0.3, 0);
                break;
        }
    };
}
_gl.drawScene();
