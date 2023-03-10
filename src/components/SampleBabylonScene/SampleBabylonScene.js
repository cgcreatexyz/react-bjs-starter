import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders/glTF";
import boomBox from "./boomboxlowerpoly.glb";
import backgroundHdr from "./purplesky.hdr";

if (typeof document !== 'undefined') {
    require("@babylonjs/core/Debug/debugLayer");
    require("@babylonjs/inspector");
}

function onSceneReady (scene) {
    //uncomment this to view BJS inspector
    // scene.debugLayer.show();

    //this line must be here or canvas will throw not defined error when attaching camera control;
    const canvas = scene.getEngine().getRenderingCanvas();

    const darkBlue = new BABYLON.Color3(0.016, 0.086, 0.176);
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0,1.5, -10), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 100));
    camera.attachControl(canvas, true);
    //general scene lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    var hemLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 3, 0), scene);
    hemLight.diffuse = new BABYLON.Color3(0.96, 0.02, 0.84);
    hemLight.groundColor = new BABYLON.Color3(0, 1, 0.87);
    const hemLight2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(-1, 3, -10), scene);
    hemLight2.diffuse = new BABYLON.Color3(1, 1, 1);
    hemLight2.intensity = 2;
    
    //super basic scene without imports
    // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    // sphere.position.y = 1;
    // const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    //loads HDRI
    const environment = new BABYLON.HDRCubeTexture("/purplesky.hdr", scene, 256, false, true, false, true);
    scene.environmentTexture = environment;
    const skybox = scene.createDefaultSkybox(scene.environmentTexture);

    BABYLON.SceneLoader.ImportMesh("", "/", "boomboxlowerpoly.glb", scene, function (meshes) {  
        //along with scaleInPlace in line 153, keeps mesh from mirroring backward
        scene.createDefaultCamera(true, true, true);
        // scene.useRightHandedSystem = true;
        const cam = scene.activeCamera;

        //mesh and camera positioning
        const boomBox = meshes[0];
        boomBox.position.x -=0.4
        cam.setTarget = new BABYLON.Vector3.Zero();
        cam.alpha = 7*pi/4;
        cam.beta = pi;
        cam.radius = 6;

        //ground is invisible in scene, but used for shadow, below
        const ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene, false);
        ground.receiveShadows = true;
        ground.position = new BABYLON.Vector3(0,-0.8,0);
    
        //CREATING THE SHADOW
        //this light is used to direct shadow
        const light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, 5, -12), scene);
        light2.shadowMinZ = 0;
        light2.shadowMaxZ = 100;
        //shadowgenerator and parameters for blurring
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.addShadowCaster(boomBox, true);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.useKernelBlur = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.blurKernel = 1;
        shadowGenerator.depthScale = 10;
        //color for shadow, sets the rest of ground to invisible
        const backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
        backgroundMaterial.primaryColor = new BABYLON.Color3(1, 0, 0.78);
        backgroundMaterial.shadowOnly = true;
        ground.material = backgroundMaterial;
    })  

}

function onRender (scene) {

}


export {onSceneReady, onRender};