import * as THREE from 'three';

const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_PointSize = 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
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
    float scale = 0.5 + 0.5 * sin(uTime * 0.5); // Add time-based scale change
    float hue = mod(distanceFromCenter * 0.1 * scale + sin(uTime) * 0.5, 1.0); // Smoother hue change
    vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
}

`;

function generateMandelbrot3D(width, height, depth, maxIterations) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let x = -width / 2; x < width / 2; x++) {
        for (let y = -height / 2; y < height / 2; y++) {
            for (let z = -depth / 2; z < depth / 2; z++) {
                let cx = x / width * 4 - 2;
                let cy = y / height * 4 - 2;
                let cz = z / depth * 4 - 2;

                let iteration = 0;
                let zx = 0, zy = 0, zz = 0;
                while (Math.abs(zx) < .01 && Math.abs(zy) < .01 && Math.abs(zz) < .01 && iteration < maxIterations) {
                    let xtemp = zx * zx - zy * zy - zz * zz + cx;
                    let ytemp = 2 * zx * zy + cy;
                    let ztemp = 2 * zx * zz + cz;
                    if (zx === xtemp && zy === ytemp && zz === ztemp) {
                        iteration = maxIterations;
                        break;
                    }
                    zx = xtemp;
                    zy = ytemp;
                    zz = ztemp;
                    iteration++;
                }

                if (iteration < maxIterations) {
                    vertices.push(x, y, z);
                }
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
}

export class MandelbrotCube extends THREE.Object3D {
    constructor() {
        super();

        const mandelbrotGeometry = generateMandelbrot3D(100, 100, 100, 300);
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
        this.points = new THREE.Points(mandelbrotGeometry, particleMaterial);
        this.add(this.points);
    }

    update(time) {
        this.rotation.x = Math.sin(time / 20);
        this.rotation.y = Math.sin(time / 20);
        this.rotation.z = Math.sin(time / 20);

        this.points.material.uniforms.uTime.value = time * 1; // Update the time uniform
    }
}

