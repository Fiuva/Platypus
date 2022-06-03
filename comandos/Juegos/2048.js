const { CANAL_TEXTO } = require("../../config/constantes");
const { iniciar2048 } = require("../../handlers/juegos/funciones2048");

module.exports = {
    name: "2048",
    aliases: ["juego2048"],
    canales: [CANAL_TEXTO.GENERAL],
    descripcion: "Juega al 2048 🎮",
    run: async (client, message, args) => {
        iniciar2048(message);
    }
}