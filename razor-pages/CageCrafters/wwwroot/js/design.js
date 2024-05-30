let selectedGridLength = 3;
let selectedPanelColor = '#00ff00';
let selectedPanelTransparency = false;
let panels = []; // Array for saving the panels
let addMode = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
performance.mark("start");
// White background color
renderer.setClearColor(0xefefef);

// Set camera position
camera.position.z = 10;

// Create controls for orbiting the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width / 1.2, height / 1.1);
    camera.aspect = (width / 1.2) / (height / 1.1);
    camera.updateProjectionMatrix();
}

// Resize at first start
resize();

// Window Resize Event
window.addEventListener('resize', resize);

// Append the renderer's canvas to the container element
const container = document.getElementById('container');
if (container !== null) {
    container.appendChild(renderer.domElement);
}


// Create grid
const gridSize = 25;
const gridStep = 2.5;
const gridColor = 0xCCCCCC;
const gridHelper = new THREE.GridHelper(gridSize, gridSize / gridStep, gridColor, gridColor);
gridHelper.position.x = 2.5 / 2;
gridHelper.position.y = -2.5 / 2;
gridHelper.position.z = 2.5;
scene.add(gridHelper);

performance.mark("end");
// creating performance measurement
const measure = performance.measure(
    "measurement",
    "start",
    "end"
);
console.log(`Total time for fetch and render: ${measure.duration}ms`);

createPanel(scene, 5, 0, 0, 0xCCCCCC, true, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
function addPanel() {
    addMode = true;
}

function deletePanel(panel) {
    const index = panels.indexOf(panel);
    if (index !== -1) {
        panels.splice(index, 1);
        if (panel.parent) {
            panel.parent.remove(panel);
        }
    }
}

function createPanel(scene, positionX, positionY, positionZ, color, transparent = false, opacity = 1) {
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color, transparent, opacity });
    const panel = new THREE.Mesh(geometry, material);
    panel.position.x = positionX;
    panel.position.y = positionY;
    panel.position.z = positionZ;
    const outlineGeometry = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({color: 0x555555});
    const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
    panel.add(outline);

    scene.add(panel);
    panels.push(panel);
}
