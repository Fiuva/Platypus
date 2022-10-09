const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "adelantar",
    aliases: ["seek", "avanzar", "av"],
    description: "Sirve para adelantar o avanzar una cancion x tiempo ⏩",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");

        if (args.length == 0) {
            client.distube.seek(message, 5);
        } else {
            try {
                client.distube.seek(message, Number(args[0]));
            } catch {
                client.distube.seek(message, 5);
            }
        }
        
    }
}