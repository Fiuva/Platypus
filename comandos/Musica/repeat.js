const { RepeatMode } = require("distube");
const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "bucle",
    aliases: ["repeat"],
    description: "Cambia el modo de repetición en las canciones (🔁, 🔂)",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");

        let mode;
        switch (client.distube.setRepeatMode(message)) {
            case RepeatMode.DISABLED:
                mode = "Off";
                break;
            case RepeatMode.SONG:
                mode = "Repetir canción";
                break;
            case RepeatMode.QUEUE:
                mode = "Repetir toda la lista";
                break;
        }
        message.channel.send("Modo de repetición cambiado a:`" + mode + "`");
    }
}