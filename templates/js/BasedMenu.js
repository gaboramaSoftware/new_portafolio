import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js";

// --- CONFIGURACIÓN DE LA ESCENA ---
const container = document.getElementById('scene-container');
const scene = new THREE.Scene();

// Helpers para ver qué está pasando (puedes borrarlos luego)
/*const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);*/

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Far aumentado a 2000

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- LUCES ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(100, 100, 100); // Luz desplazada para que ilumine desde fuera
scene.add(dirLight);

// --- CARGAR EL MODELO Y CENTRAR EL PIVOTE ---
const modelPath = '/assets/sol_portafolio.glb'; 

// Creamos un GRUPO que actuará como el verdadero "eje" del sol
const sunPivot = new THREE.Group();
scene.add(sunPivot);

const loader = new GLTFLoader();

loader.load(
    modelPath,
    (gltf) => {
        const rawModel = gltf.scene;
        
        // 1. Calculamos la "caja" que envuelve al modelo para hallar su centro real
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());

        // 2. Corregimos la posición del modelo:
        rawModel.position.x = -center.x;
        rawModel.position.y = -center.y;
        rawModel.position.z = -center.z;

        // 3. Añadimos el modelo corregido al grupo pivote
        sunPivot.add(rawModel);

        // 4. Escalamos EL GRUPO, no el modelo interno
        sunPivot.scale.set(100, 100, 100);
    },
    (xhr) => { console.log(`Cargando: ${(xhr.loaded / xhr.total * 100)}%`); },
    (error) => { console.error('Error:', error); }
);

// --- CONFIGURACIÓN DE LA CÁMARA ---
// Distancia fija desde la cual queremos ver el sol
const cameraDist = 30; 
const cameraOffset = new THREE.Vector3(0, 0, cameraDist);

// --- ANIMACIÓN ---
function animate() {
    requestAnimationFrame(animate);

    // Rotamos el GRUPO PIVOTE. Como centramos el modelo adentro,
    if (sunPivot) {
        sunPivot.rotation.y += 0.002; // Rotación sobre su eje vertical
        sunPivot.rotation.z += 0.002; // Si quieres inclinarlo un poco
        
        // --- CÁMARA SIGUE AL GRUPO ---
        const targetPos = sunPivot.position.clone().add(cameraOffset);
        
        // Lerp para suavidad (opcional, si el sol no se mueve de lugar puedes quitar el lerp)
        camera.position.lerp(targetPos, 0.05);
        
        // La cámara siempre mira al centro del grupo pivote (0,0,0 relativo al sol)
        camera.lookAt(sunPivot.position);
    }

    renderer.render(scene, camera);
}

// --- RESPONSIVE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar
animate();