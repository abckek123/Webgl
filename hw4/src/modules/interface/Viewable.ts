import {vec3,lookAt,perspective} from '../MV';
import {Util} from '../Util';

export default class Viewable{
    public projectionMatrix: any;
    public cameraMatrix: any;
    
    public view(radius, theta, phi) {
        const far = 10, near = 0.1, aspect = 1, fovy = 45;

        const at = vec3(0.0, 0.0, 0.0);
        var up = vec3(0.0, 1.0, 0.0);
        if (phi > 90 || phi < -90)
            up = vec3(0.0, -1.0, 0.0);
        let eye = vec3(radius * Math.sin(Util.radians(theta)) * Math.cos(Util.radians(phi)),
            radius * Math.sin(Util.radians(phi)),
            radius * Math.cos(Util.radians(theta)) * Math.cos(Util.radians(phi)));

        this.cameraMatrix = lookAt(eye, at, up);
        this.projectionMatrix = perspective(fovy, aspect, near, far);

    }

}