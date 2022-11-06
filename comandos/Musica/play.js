const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "play",
    aliases: ["reproducir"],
    description: "Añade una canción a la cola \n`Compatible con YT, Spotify y SoundCloud.` *Admite playlist*",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    run: async (client, message, args) => {
        if (!args.length) return message.reply("Pero pon el nombre de la canción... cara alfombra!");
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) {
            message.channel.send(`${message.author} tienes que meterte al canal de musica... cara alcachofa!`);
            message.delete();
            return;
        }

        try {
            console.log(message.member.voice?.channel);
            console.log(args.join(' '));
            console.log(message.member);

            await client.distube.play(message.member.voice?.channel, args.join(' '), {
                member: message.member,
                textChannel: message.channel,
                message: message,
                metadata: {
                    messageId: message.id
                }
            });
            console.log("Se ha añadido una canción");
        } catch {
            message.reply(`No he podido añadir eso, puede que sea una lista privada :'''>`);
        }
    }
}