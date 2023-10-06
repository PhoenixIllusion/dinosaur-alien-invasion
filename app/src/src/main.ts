import './style.css'

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xbfd1e5);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')!.appendChild( renderer.domElement );


const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 5);
scene.add(dirLight);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7 });
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
	requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();

window.addEventListener('resize', onWindowResize, false);