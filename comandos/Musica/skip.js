const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "skip",
    aliases: ["saltar"],
    descripcion: "Salta a la siguiente canción ⏭️",
    canales: [CANAL_TEXTO.MUSICA],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones para saltar :>");

        client.distube.skip(message);
    }
}