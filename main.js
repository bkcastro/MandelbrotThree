// By Brandon Castro 
import './style.css';
import * as THREE from 'three';
import { XRButton, OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { MandelbrotCube } from './Mandelbrot';

const stats = new Stats();
stats.showPanel(0);
// document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.0001, 100);
camera.position.set(0, 1, .1);

scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.xr.enabled = true;
renderer.xr.setFoveation(0.0);
document.body.appendChild(renderer.domElement);

document.body.appendChild(XRButton.createButton(renderer));

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

const mandelbrot = new MandelbrotCube();
mandelbrot.scale.multiplyScalar(1 / 300);
scene.add(mandelbrot);


// Handle the XR session start event
renderer.xr.addEventListener('sessionstart', () => {
  mandelbrot.position.set(0, 1.25, -0.5);
});

// Handle the XR session end event
renderer.xr.addEventListener('sessionend', () => {
  console.log('XR Session ended');
  mandelbrot.position.set(0, 0, 0);
});

const clock = new THREE.Clock();

function animate() {

  const elapsedTime = clock.getElapsedTime();
  mandelbrot.update(elapsedTime);
  controls.update();
  renderer.render(scene, camera);
}

animate();
