const { CANAL_TEXTO, CANAL_VOZ, ROL } = require("../../config/constantes");

module.exports = {
    name: "anterior",
    aliases: ["previous", "ant", "prev"],
    description: "Vuelve a la canción anterior ⏮️",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");
        if (client.distube.getQueue(message).previousSongs.length == 0) return message.reply("No hay más canciones anteriores")

        client.distube.previous(message);
    }
}