const express = require('express');
const axios = require('axios'); // Para hacer la solicitud HTTP periódica

const app = express();
const PORT = process.env.PORT || 3000;

const keepAlive = () => {
    axios.get(`http://localhost:${PORT}`) // Hacer una solicitud GET a tu servidor
        .then(response => {
            console.log('Manteniendo el servidor activo', response.status);
        })
        .catch(error => {
            console.error('Error al mantener el servidor activo:', error);
        });
};

keepAlive();

setInterval(keepAlive, 5 * 60 * 1000);

app.get('/', (req, res) => {
    res.send('El bot está activo.');
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
