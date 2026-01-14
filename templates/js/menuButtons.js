class DCHeader extends HTMLElement {
    constructor() {
        super();
        this.dateInterval = null;
        
        // --- 1. PRECARGA DE SONIDOS (Tu lógica) ---
        // Rutas absolutas para evitar problemas
        this.clickSound = new Audio('/assets/click_sound.mp3');
        this.hoverSound = new Audio('/assets/hover_sound.mp3');
        
        // Ajuste de volumen (Max es 1.0)
        this.clickSound.volume = 0.5;
        this.hoverSound.volume = 0.8; // Un poco más fuerte para el hover
    }

    connectedCallback() {
        this.render();      
        this.startClock();  
        this.setupSounds(); 
    }

    disconnectedCallback() {
        if (this.dateInterval) clearInterval(this.dateInterval);
    }

    // --- LÓGICA DE SONIDOS ---
    setupSounds() {
        // Buscamos todos los elementos con la clase .dc-link DENTRO de este componente
        const links = this.querySelectorAll('.dc-link');

        links.forEach(link => {
            // Evento Hover
            link.addEventListener('mouseenter', () => {
                this.hoverSound.currentTime = 0;
                this.hoverSound.play().catch(() => {}); // Ignorar errores de autoplay
            });

            // Evento Click
            link.addEventListener('click', () => {
                this.clickSound.currentTime = 0;
                this.clickSound.play().catch(() => {});
            });
        });
    }

    // --- LÓGICA DEL RELOJ ---
    startClock() {
        const updateTime = () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            const dateEl = this.querySelector('#dc-date');
            const timeEl = this.querySelector('#dc-time');
            
            if (dateEl) dateEl.textContent = dateStr;
            if (timeEl) timeEl.textContent = timeStr;
        };

        updateTime();
        this.dateInterval = setInterval(updateTime, 1000);
    }

    // --- RENDERIZADO (HTML + CSS) ---
    render() {
        this.innerHTML = `
            <style>
                .dc-container {
                    width: 100%;
                    padding: 40px 60px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 300;
                    color: #f4f4f4;
                    position: relative;
                    z-index: 10;
                    user-select: none;
                    background: rgba(255, 255, 255, 0.1); /* Un fondo sutil opcional */
                    backdrop-filter: blur(2px); /* Efecto vidrio sutil */
                }

                .dc-nav {
                    display: flex;
                    gap: 40px;
                    font-size: clamp(1.2rem, 1.5vw, 2rem);
                }

                .dc-link {
                    text-decoration: none;
                    color: inherit;
                    position: relative;
                    transition: color 0.3s ease;
                    cursor: pointer; /* Importante para que se sienta clickeable */
                }

                .dc-link:hover {
                    color: #ffff;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                }

                .dc-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background-color: #ff4d4d;
                    box-shadow: 0 0 10px rgba(255, 77, 77, 0.6);
                    border-radius: 2px;
                }

                .red-letter { color: #ff4d4d; }

                .dc-info {
                    font-size: clamp(1.5rem, 1.7vw, 2rem);;
                    display: flex;
                    gap: 40px;
                    color: #f4f4f4;
                }

                @media (max-width: 1200px) {
                    .dc-container {
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;
                        padding: 20px;
                    }
                    .dc-info { display: none; }
                }


            </style>

            <div class="dc-container">
                <nav class="dc-nav">
                    <a href="/online" class="dc-link active">Gabriel Ramirez</a>
                    <a href="/" class="dc-link">Sobre Mi</a> 
                    <a href="/library" class="dc-link">Proyectos</a>
                    <a href="/settings" class="dc-link">Experiencia</a>
                    <a herf="/curriculum" class="dc-link"> Curriculum </a>
                </nav>

                <div class="dc-info">
                    <span id="dc-date">Loading...</span>
                    <span id="dc-time">--:--</span>
                </div>
            </div>
        `;
    }
}

customElements.define('dc-header', DCHeader);