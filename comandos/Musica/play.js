const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "play",
    aliases: ["reproducir"],
    descripcion: "Añade una canción a la cola \n`Compatible con YT, Spotify y SoundCloud.` *Admite playlist*",
    canales: [CANAL_TEXTO.MUSICA],
    run: async (client, message, args) => {
        if (!args.length) return message.reply("Pero pon el nombre de la canción... cara alfombra!");
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");

        try {
            await client.distube.play(message.member.voice?.channel, args.join(' '), {
                member: message.member,
                textChannel: message.channel,
                message
            });
        } catch {
            message.reply(`No he podido añadir eso, puede que sea una lista privada :'''>`);
        }
    }
}