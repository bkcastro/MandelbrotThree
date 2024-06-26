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
    uniform vec3 uCenterColor;
    uniform vec3 uOuterColor;

    void main() {
        vec2 coord = gl_PointCoord * 2.0 - 1.0;
        float distance = length(coord);

        if (distance > 1.0) {
            discard;
        }

        float distanceFromCenter = length(vPosition - vec3(0, 0, 0));
        float gradient = distanceFromCenter;
        vec3 color = mix(uCenterColor, uOuterColor, gradient);

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

        const mandelbrotGeometry = generateMandelbrot3D(100, 100, 100, 100);
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCenterColor: { value: new THREE.Color(0xff0000) },
                uOuterColor: { value: new THREE.Color(0x000000) },
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
    }
}