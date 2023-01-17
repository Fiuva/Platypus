const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { tres } = require("../../handlers/juegos/funciones3enRaya");

const command_data = {
    name: "3",
    description: `🎮 Juega al 3 en raya :> 🕹️`
}

module.exports = {
    ...command_data,
    aliases: ["tres", "3enraya", "tresenraya"],
    channels: [CANAL_TEXTO.GENERAL],
    data: {
        ...command_data,
        options: [
            { ...OPTION.USER, required: true }
        ]
    },
    run: async (client, interaction) => {
        tres(interaction);
    }
}