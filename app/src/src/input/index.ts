import { Camera, Quaternion, Vector3 } from 'three';
import { input } from './input-interface';
import './keyboard-listener';
import  './touch-listener';


const cameraRotation: Quaternion = new Quaternion();
export const transformInputToCamera = (camera: Camera, output: Vector3) => {
  const len = input.direction.length();
  camera.getWorldQuaternion(cameraRotation);
  output.copy(input.direction).applyQuaternion(cameraRotation);
  output.y = 0;
  output.normalize().multiplyScalar(len);
}

export { input };