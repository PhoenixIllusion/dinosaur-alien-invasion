import './style.css'


import { 
  Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, BoxGeometry, Mesh, MeshPhongMaterial, Vector3,
  AnimationAction, AnimationMixer, Object3DEventMap, Group, AmbientLight } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { transformInputToCamera } from './input';
import { SkyBox } from './skybox';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setClearColor(0xbfd1e5);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.getElementById('app')!.appendChild(renderer.domElement);


const dirLight = new DirectionalLight(0xffffff, 1);
const ambLight = new AmbientLight(0xffffff, 0.1);
dirLight.position.set(10, 10, 5);
scene.add(dirLight);
scene.add(ambLight);

const ground = new Mesh(new BoxGeometry(4, 0.5, 30), new MeshPhongMaterial({ color: 0x664444 }));
ground.position.set(0, -0.3, 14);
scene.add(ground);



let mixer: AnimationMixer;
const animations: { [name: string]: AnimationAction } = {};
const gltfLoader = new GLTFLoader();

let character: Group<Object3DEventMap>;

gltfLoader.load(
  'assets/models/HVGirl.glb',
  (gltf) => {
    mixer = new AnimationMixer(gltf.scene)
    gltf.animations.forEach(clip => {
      animations[clip.name] = mixer.clipAction(clip);
    })
    character = gltf.scene;
    character.scale.set(0.1, 0.1, 0.1);
    scene.add(gltf.scene)
    scene.add(SkyBox);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)

camera.position.z = -4;
camera.position.y = 2;
camera.lookAt(0, 0.8, 0);

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const transformedInput = new Vector3();
const lookAtVec3 = new Vector3();
let prevTime = -1;

const box = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshPhongMaterial({ color: 0xFF00FF }));
scene.add(box);

const animate: FrameRequestCallback = (time: DOMHighResTimeStamp) => {
  if (prevTime < 0) {
    prevTime = time;
  }
  const deltaTime = (time - prevTime) / 1000;
  requestAnimationFrame(animate);
  transformInputToCamera(camera, transformedInput)

  if (character) {
    if (transformedInput.length() == 0) {
      if (!animations['Idle'].isRunning()) {
        animations['Idle'].play();
        animations['Walking'].stop();
      }
      camera.position.set(0, 2, -4);
      camera.position.applyQuaternion(character.quaternion);
      camera.position.add(character.position);
      camera.lookAt(character.position.x, 0.8, character.position.z);
    } else {
      if (!animations['Walking'].isRunning()) {
        animations['Walking'].play();
        animations['Idle'].stop();
      }
      transformedInput.multiplyScalar(deltaTime);
      lookAtVec3.copy(character.position).add(transformedInput);
      character.lookAt(lookAtVec3);
      camera.position.sub(character.position);
      character.position.copy(lookAtVec3);
      camera.position.add(character.position);
    }

    mixer.update(deltaTime);

  }

  renderer.render(scene, camera);
  prevTime = time;
}
requestAnimationFrame(animate);

window.addEventListener('resize', onWindowResize, false);
