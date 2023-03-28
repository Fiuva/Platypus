const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

const command_data = {
    name: "skip",
    description: `⏭️ Salta a la siguiente canción`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        if (interaction.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return interaction.reply({ content: "Tienes que meterte al canal de musica!", ephemeral: true });
        client.player.skip(interaction);
    }
}