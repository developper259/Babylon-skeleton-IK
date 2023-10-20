import * as BABYLON from "babylonjs";
import { Charactere } from "./Charactere";
import { XRInputSource, XRHandedness, XRSpace } from 'webxr-polyfill';
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene | null;
    charactere: Charactere;
    time = Date.now();
    xr: any;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = null;
        this.createScene(this.engine, this.canvas).then(
            (scene) => (this.scene = scene)
        );
        //init charactere controler
        this.charactere = Charactere.empty();
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene?.debugLayer.show({ overlay: true });
        } else {
            this.scene?.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            if (!this.charactere.isEmpty()) {
                if (this.xr) {

                }
            }
            this.scene?.render();
        });
    }

    async createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
        //scene init
        const scene = new BABYLON.Scene(engine);

        //camera init
        const camera = new BABYLON.FreeCamera(
            "camera1",
            new BABYLON.Vector3(0, 5, 10),
            scene
        );

        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, true);

        //light create
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.7;

        //ground ( sol ) import
        var ground = BABYLON.MeshBuilder.CreateGround(
            "ground1",
            { width: 6, height: 6 },
            scene
        );

        //skeleton import
        BABYLON.SceneLoader.ImportMesh(
            "",
            "./",
            "dummy3.babylon",
            scene,
            (meshes, particleSystems, skeletons) => {
                var skeleton = skeletons[0];

                this.charactere.setSkeleton(skeleton);

                if (skeleton) {
                    this.scene?.addSkeleton(skeleton);

                    //this.charactere.printBonesName();
                }
            }
        );

        // WebXR
        const env = scene.createDefaultEnvironment();

        if (env && env.ground) {
            this.xr = await scene.createDefaultXRExperienceAsync({
                floorMeshes: [env.ground],
            });
            this.xr.input.onControllerAddedObservable.add((inputSource: {
                inputSource: XRInputSource; onMotionControllerInitObservable: { add: (arg0: (motionController: any) => void) => void; }; 
}) => {
                inputSource.onMotionControllerInitObservable.add((motionController: any) => {
                    //inputsource
                    const is:XRInputSource = inputSource.inputSource;
                    const component = motionController.getMainComponent();
                    const handedness = is.handedness;
                    
                });
            });
        }

        return scene;
    }
}
