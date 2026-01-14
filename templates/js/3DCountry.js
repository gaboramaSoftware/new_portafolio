import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Usamos la ruta del importmap

class Sun3D extends HTMLElement {
    constructor() {
        super();
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.sunPivot = null;
        this.animationId = null; 
    }

    // Se ejecuta cuando <sun-3d> aparece en el HTML
    connectedCallback() {
        this.init();
        this.animate();
        
        // Bind del resize para poder removerlo luego si es necesario
        this.resizeHandler = () => this.onWindowResize();
        window.addEventListener('resize', this.resizeHandler);
    }

    // Si el componente desaparece, paramos el loop y los eventos
    disconnectedCallback() {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.resizeHandler);
        
        // Opcional: Dispose de geometrías y materiales para liberar GPU
        if (this.renderer) this.renderer.dispose();
    }

    init() {
        // --- 1. CONFIGURACIÓN ---
        this.scene = new THREE.Scene();

        // CÁMARA
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        
        // RENDERIZADOR
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // ESTILOS DEL CONTENEDOR (Para que ocupe todo el espacio del componente)
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1'; 

        // CAMBIO CLAVE: No buscamos "scene-container", nos agregamos a nosotros mismos
        this.appendChild(this.renderer.domElement);

        // --- 2. LUCES (Tu código intacto) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(100, 100, 100);
        this.scene.add(dirLight);

        // --- 3. CARGAR MODELO (Tu código con 'this') ---
        const modelPath = '../../assets/sol_portafolio.glb'; 
        this.sunPivot = new THREE.Group();
        this.scene.add(this.sunPivot);

        const loader = new GLTFLoader();

        loader.load(
            modelPath,
            (gltf) => {
                const rawModel = gltf.scene;
                // Tu lógica de centrado (EXCELENTE, por cierto)
                const box = new THREE.Box3().setFromObject(rawModel);
                const center = box.getCenter(new THREE.Vector3());

                rawModel.position.x = -center.x;
                rawModel.position.y = -center.y;
                rawModel.position.z = -center.z;

                this.sunPivot.add(rawModel);
                this.sunPivot.scale.set(80, 80, 80);
            },
            undefined,
            (error) => { console.error('Error cargando sol:', error); }
        );

        // Posición de cámara inicial
        this.cameraDist = 30; 
        this.cameraOffset = new THREE.Vector3(0, 0, this.cameraDist);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.sunPivot) {
            this.sunPivot.rotation.y += 0.002;
            this.sunPivot.rotation.z += 0.002;
            
            const targetPos = this.sunPivot.position.clone().add(this.cameraOffset);
            this.camera.position.lerp(targetPos, 0.05);
            this.camera.lookAt(this.sunPivot.position);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Registramos el componente
customElements.define('sun-3d', Sun3D);