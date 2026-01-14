const audio = document.getElementById('jukebox');
        const btn = document.getElementById('muteBtn');
        
        // Estado inicial
        let isPlaying = true;// Asumimos que el audio se reproducirá al inicio

        // Función para actualizar el texto/icono del botón
        function updateButton() {
            if (audio.muted || audio.paused) {
                btn.innerText = "🔇 Mute"; // O puedes poner "Unmute"
            } else {
                btn.innerText = "🔊 ON"; // O "Mute" 
            }
        }

        // Lógica del botón
        btn.addEventListener('click', (e) => {
            // Evitamos que este clic active el listener global de abajo duplicadamente
            e.stopPropagation(); 

            if (!isPlaying) {
                // Si no estaba sonando, le damos play y desmuteamos
                audio.play().then(() => {
                    isPlaying = true;
                    audio.muted = false;
                    updateButton();
                }).catch(err => console.error("Error al reproducir:", err));
            } else {
                // Si ya estaba sonando, alternamos el Mute
                audio.muted = !audio.muted;
                updateButton();
            }
        });

        // TRUCO PARA AUTO-PLAY:
        // 1. Intentamos reproducir el audio inmediatamente
        audio.play().then(() => {
            isPlaying = true;
            audio.muted = false;
            updateButton();
        }).catch(() => {
            // 2. Si falla, esperamos al primer clic del usuario en la ventana
            console.log("Esperando interacción para iniciar audio...");
            
            function startAudioOnInteraction() {
                audio.play();
                audio.muted = false;
                isPlaying = true;
                updateButton();
                // Removemos el listener para que no se ejecute en cada clic
                window.removeEventListener('click', startAudioOnInteraction);
            }

            window.addEventListener('click', startAudioOnInteraction);
        });