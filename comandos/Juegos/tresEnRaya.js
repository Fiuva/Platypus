const { CANAL_TEXTO } = require("../../config/constantes");
const { tres } = require("../../handlers/juegos/funciones3enRaya");

module.exports = {
    name: "3",
    aliases: ["tres", "3enraya", "tresenraya"],
    canales: [CANAL_TEXTO.GENERAL],
    descripcion: "Juega al 3 en raya :> 🕹️",
    run: async (client, message, args) => {
        tres(message);
    }
}