const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "play",
    description: `▶️ Añade una canción a la cola`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    data: {
        ...command_data,
        options: [
            {
                name: `nombre`,
                description: 'Nombre de la canción',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        const nombre = interaction.options.getString('nombre');

        if (interaction.member.voice?.channel?.id != CANAL_VOZ.MUSICA) {
            interaction.reply({ content: `Tienes que meterte al canal de música <#${CANAL_VOZ.MUSICA}>`, ephemeral: true });
            return;
        }

        try {
            let searched_songs = await client.distube.search(nombre, { limit: 1 });
            let voiceChannel = interaction.guild.channels.cache.get(CANAL_VOZ.MUSICA);
            const player = client.player;
            if (!player.connection) player.connect(voiceChannel);
            await player.addSong(searched_songs[0], interaction);
        } catch {
            message.reply(`No he podido añadir eso, puede que sea una lista privada :'''>`);
        }
    }
}