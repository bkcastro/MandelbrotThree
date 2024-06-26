### README for MandelbrotThreeJS App

# MandelbrotThreeJS

MandelbrotThreeJS is a simple ThreeJS application that visualizes a Mandelbrot set in 3D space using custom shaders. This project demonstrates the use of ThreeJS, GLSL shaders, and interactive web technologies to create a visually appealing and dynamic 3D fractal experience.

## Features

- **3D Visualization**: Generates a 3D Mandelbrot set using ThreeJS.
- **Custom Shaders**: Implements GLSL shaders to color the Mandelbrot set dynamically.
- **Interactive Controls**: Includes OrbitControls for user interaction with the 3D scene.
- **Dynamic Effects**: Uses time-based animations to create pulsating and color-changing effects.

## Demo

Uploading colors-c.mov…

<img width="780" alt="Screenshot 2024-06-26 at 21 22 37" src="https://github.com/Immersive-Collective/MandelbrotThree/assets/27820237/78778f08-92a7-4374-9798-d495dd1367ec">

## Installation

To run this application locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/MandelbrotThree.git
   cd MandelbrotThree
   ```

2. **Install dependencies**:

   Ensure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Run the application**:

   ```bash
   npm start
   ```

   Open your browser and navigate to `http://localhost:8080` to see the application in action.

## Usage

- **OrbitControls**: Use your mouse to rotate, zoom, and pan around the Mandelbrot set.
- **Dynamic Colors**: Watch the Mandelbrot set pulsate and change colors over time.

## Code Overview

### Vertex Shader

The vertex shader calculates the position of each point in the 3D space:

```glsl
varying vec3 vPosition;

void main() {
    vPosition = position;
    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Fragment Shader

The fragment shader colors the points based on their distance from the center, using a dynamic hue that changes over time:

```glsl
precision mediump float;
varying vec3 vPosition;
uniform float uTime;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 coord = gl_PointCoord * 2.0 - 1.0;
    float distance = length(coord);

    if (distance > 1.0) {
        discard;
    }

    float distanceFromCenter = length(vPosition - vec3(0.0));
    float scale = 0.5 + 0.5 * sin(uTime * 0.5);
    float hue = mod(distanceFromCenter * 0.1 * scale + sin(uTime) * 0.5, 1.0);
    vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
```

### Main Application

The main application initializes the ThreeJS scene, camera, renderer, and controls. It also creates the `MandelbrotCube` object and handles the animation loop.

```javascript
import './style.css';
import * as THREE from 'three';
import { XRButton, OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { MandelbrotCube } from './Mandelbrot';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.0001, 100);
camera.position.set(0, 1, 2);

scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

scene.add(new THREE.AxesHelper(1));

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.xr.enabled = true;
renderer.xr.setFoveation(0.0);
document.body.appendChild(renderer.domElement);

document.body.appendChild(XRButton.createButton(renderer));

const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 1.5, -1);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

const mandelbrot = new MandelbrotCube();
mandelbrot.scale.multiplyScalar(1 / 400);
mandelbrot.position.set(0, 1.25, -0.2);
scene.add(mandelbrot);

const clock = new THREE.Clock();

function animate() {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();
  mandelbrot.update(elapsedTime);
  controls.update();
  renderer.render(scene, camera);

  stats.end();
}

animate();
```

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [Three.js](https://threejs.org/)
- [GLSL Shaders](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)

---

This README provides a comprehensive overview of the MandelbrotThreeJS project, detailing how to set it up, its features, and how to contribute to it. Adjust the demo link and GitHub repository URL placeholders with actual links once available.
