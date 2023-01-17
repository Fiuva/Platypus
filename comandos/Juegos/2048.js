const { CANAL_TEXTO } = require("../../config/constantes");
const { iniciar2048 } = require("../../handlers/juegos/funciones2048");

const command_data = {
    name: "2048",
    description: `🎮 Juega al 2048 en el chat`
}

module.exports = {
    ...command_data,
    aliases: ["juego2048"],
    channels: [CANAL_TEXTO.GENERAL],
    data: {
        ...command_data,
    },
    run: async (client, interaction) => {
        iniciar2048(interaction);
    }
}