const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");
const { buscarCancion } = require("../../handlers/funciones");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "lyrics",
    description: `🎼 Para ver la letra de la canción actual o cualquier otra`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    data: {
        ...command_data,
        options: [
            {
                name: `nombre`,
                description: 'El nombre de la canción',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    run: async (client, interaction) => {
        const nombre = interaction.options.getString('nombre');
        if (nombre) { //Titulo escrito
            buscarCancion(nombre, interaction);
        } else { //Canción que suena
            client.player.lyrics(interaction);
        }
    }
}