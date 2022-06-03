const { CANAL_TEXTO } = require("../../config/constantes");
const { rank2048 } = require("../../handlers/juegos/funciones2048")

module.exports = {
    name: "rank2048",
    aliases: ["2048rank", "ranking2048", "2048ranking"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Mira el ranking del 2048",
    run: async (client, message, args) => {
        rank2048(message);
    }
}