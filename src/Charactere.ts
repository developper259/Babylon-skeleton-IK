import * as BABYLON from "babylonjs";

export class Charactere {
    skeleton: BABYLON.Skeleton | null;

    constructor(skeleton: BABYLON.Skeleton | null) {
        this.skeleton = skeleton;
    }

    static empty = () => {
        var c = new Charactere(null);
        return c;
    };

    isEmpty = () => {
        if (this.skeleton == null) return true;
        return false;
    };

    setSkeleton = (skeleton: BABYLON.Skeleton) => {
        this.skeleton = skeleton;
    };
    // (direction: string, vector: BABYLON.Vector3)
    moveHand = (d: string, vec: BABYLON.Vector3, type: string) => {
        if (this.skeleton) {
            //result
            var r = this.fixNextBHpart(d, vec, type);

            if (r == null) return;

            //this.transform(Bpart, vec, type);

            return true;
        } else {
            return false;
        }
    };

    //(BodyPart: string)
    getBoneName(BP: string) {
        return "mixamorig:" + BP;
    }

    //get the next body part
    getNextBpart(Bpart: string) {
        var nextBpart: { [key: string]: string } = {
            LeftHand: "LeftForeArm",
            LeftForeArm: "LeftArm",
            LeftArm: "LeftShoulder",
            LeftShoulder: "Hips",

            RightHand: "RightForeArm",
            RightForeArm: "RightArm",
            RightArm: "RightShoulder",
            RightShoulder: "Hips",
        };

        return nextBpart[Bpart];
    }

    // (direction, BodyPartVector, type)
    fixNextBHpart(d: string,
        BpartVec: BABYLON.Vector3,
        type: string
    ) {
        console.log(BpartVec);
        if (BpartVec instanceof BABYLON.Vector3) {
            var type = type == "translate" ? "rotate" : "";

            var cX = BpartVec._x;
            var cY = BpartVec._y;
            var cZ = BpartVec._z;

            if (type === "rotate") {
                //BoneNextBodyPart
                if (cX != 0) {
                    //bone
                    var b = this.getBone(this.getBoneName("Hips"));
                    //vectorBone
                    var vB = new BABYLON.Vector3(cX, 0, 0);

                    this.transform(b, vB, "translate");
                    console.log(b?.position._x);
                }
                if (cZ != 0) {
                    //bone
                    var b = this.getBone(this.getBoneName(d + "Arm"));
                    if (b && b.rotation._y >= 1.5 || cY != 0) {
                        //bone
                        var b = this.getBone(this.getBoneName(d + "ForeArm"));

                        if (b && b.rotation._y >= 1.7) {
                            //bone
                            var b = this.getBone(this.getBoneName("Hips"));
                            //vectorBone
                            var vB = new BABYLON.Vector3(0, 0, cZ);

                            this.transform(b, vB, "translate");
                        } else {
                            //vectorBone
                            var vB = new BABYLON.Vector3(0, 1, 0);

                            this.transform(b, vB, "rotate", cZ);
                        }
                    } else if (b && b.rotation._y <= -0.5) {
                        //bone
                        var b = this.getBone(this.getBoneName("Hips"));
                        //vectorBone
                        var vB = new BABYLON.Vector3(0, 0, cZ);

                        this.transform(b, vB, "translate");
                    } else {
                        var vB = new BABYLON.Vector3(0, 1, 0);

                        this.transform(b, vB, "rotate", cZ);
                    }
                } 
                if (cY != 0) {
                    var b = this.getBone(this.getBoneName(d + "Arm"));

                    if (b && b.rotation._z >= 1.4) {
                        //bone
                        var b = this.getBone(this.getBoneName("Hips"));
                        //vectorBone
                        var vB = new BABYLON.Vector3(0, cY * -1, 0);

                        console.log(b?.rotation._z);
    
                        this.transform(b, vB, "translate");
                    }else if (b && b.rotation._z <= -1.4) {
                        //bone
                        var b = this.getBone(this.getBoneName("Hips"));
                        //vectorBone
                        var vB = new BABYLON.Vector3(0, cY * -1, 0);

                        console.log(b?.rotation._z);
    
                        this.transform(b, vB, "translate");
                    }else {
                        var vB = new BABYLON.Vector3(0, 0, 1);

                        console.log(b?.rotation._z);
    
                        this.transform(b, vB, "rotate", cY);
                    }
                    
                }
            }
            return;
        }
        return null;
    }

    //translate / rotate etc... a bone
    transform(
        Bpart: BABYLON.Bone | null,
        vec: BABYLON.Vector3,
        type: string,
        amount?: number
    ) {
        if (!Bpart) return;
        if (type == "translate") Bpart?.translate(vec);
        else if (type == "rotate") Bpart?.rotate(vec, amount ? amount : 0);
    }

    // get bone of a body part
    getBone(name: string) {
        if (this.skeleton) {
            var bones = this.skeleton.bones;
            for (let index = 0; index < bones.length; index++) {
                var bone = bones[index];
                if (bone.name == name) return bone;
            }
        }
        return null;
    }

    // print all bone name
    printBonesName() {
        if (this.skeleton) {
            const bones = this.skeleton.bones;

            for (let index = 0; index < bones.length; index++) {
                console.log(bones[index].name);
            }
        }
        return null;
    }
}
