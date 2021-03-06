import { Material } from "../interface/Material";
import { vec4 } from "../MV";
import { Util } from "../Util";

export class NoneMaterial implements Material{
    materialAmbient: number[];
    materialDiffuse: number[];
    materialSpecular: number[];
    materialShininess: number;
    constructor(){
      this.materialAmbient = Util.Hex2Vec4('0xd8d8d8');
        this.materialDiffuse = Util.Hex2Vec4('0xd0d0d0');
        this.materialSpecular = Util.Hex2Vec4('0x040404');
        this.materialShininess = 5.0;
    }
}