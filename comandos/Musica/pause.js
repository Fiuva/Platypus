const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO, CANAL_VOZ, ROL } = require("../../config/constantes");

module.exports = {
    name: "pause",
    aliases: ["pausar"],
    descripcion: "Pausa una canción ⏸️",
    canales: [CANAL_TEXTO.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");
        if (client.distube.getQueue(message).paused) return message.reply("La canción ya está pausada");

        client.distube.pause(message)

        const resume = new ButtonBuilder()
            .setEmoji('⏸️')
            .setStyle('Primary')
            .setCustomId('musica_resume')

        message.channel.send({ components: [new ActionRowBuilder().addComponents(resume)] })
    }
}