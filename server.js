const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 1. Servir Archivos Estáticos (CSS, JS, Assets, Imágenes)
// Esto permite que el HTML encuentre los scripts y estilos
app.use(express.static(__dirname)); 

// 2. Ruta Principal
app.get('*', (req, res) => {
    // AQUÍ ESTABA EL ERROR: Agregamos las carpetas intermedias
    res.sendFile(path.join(__dirname, 'templates', 'html', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});