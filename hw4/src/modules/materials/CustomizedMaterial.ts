import {Material} from "../interface/Material";
import {vec4} from "../MV";

export class CustomizedMaterial implements Material {
  materialAmbient: Array<number>;
  materialDiffuse: Array<number>;
  materialShininess: number;
  materialSpecular: Array<number>;

  constructor() {
    this.materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
    this.materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
    this.materialSpecular = vec4(1, 1, 1, 1.0);
    this.materialShininess = 200.0;

  }
}