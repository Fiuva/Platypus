const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "mezclar",
    aliases: ["shuffle", "sh"],
    description: "Mezcla tus canciones para no escucharlas en el mismo orden siempre 🔀",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");

        client.distube.shuffle(message).then(() => {
            message.reply('Se han mezclado las canciones :>');
        });
    }
}