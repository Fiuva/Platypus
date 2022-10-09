const Genius = require("genius-lyrics");
const { EmbedBuilder } = require("discord.js");
const Client = new Genius.Client();
const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "guardar",
    aliases: ["save"],
    description: "Te enviaré la canción que suena por MD",
    canales: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones sonando para guardar :<");

        const qSong = queue.songs[0];
        const song = await buscarCancion(arreglarTitulo(qSong.name));
        var embedGuardado;
        if (song != undefined) {
            embedGuardado = new EmbedBuilder()
                .setAuthor({ name: song.artist.name, iconURL: song.artist.thumbnail })
                .setColor("Gold")
                .setDescription(`${qSong.name}`)
                .setFooter({ text: `Duración: ${qSong.formattedDuration}` })
                .setTitle(song.title)
                .setURL(qSong.url)
                .setThumbnail(song.thumbnail || qSong.thumbnail)
        } else {
            embedGuardado = new EmbedBuilder()
                .setColor("Gold")
                .setFooter({ text: `Duración: ${qSong.formattedDuration}` })
                .setTitle(qSong.name)
                .setURL(qSong.url)
                .setThumbnail(qSong.thumbnail)
        }
        try {
            await message.author.send({ embeds: [embedGuardado] });
        } catch {
            message.reply("No tienes los MD activados :<")
        }


        function arreglarTitulo(titulo) {
            var tituloCompleto = titulo;
            var tituloFix = '';
            var parentesis = false;
            for (iletra = 0; iletra < tituloCompleto.length; iletra++) {
                if (tituloCompleto[iletra] == '(' || tituloCompleto[iletra] == '[') {
                    parentesis = true;
                    break;
                } else if (tituloCompleto[iletra] == ')' || tituloCompleto[iletra] == ']') {
                    parentesis = false;
                }
                if (!parentesis) {
                    tituloFix = tituloFix + tituloCompleto[iletra];
                }
            }
            tituloFix = tituloFix
                .replace(/videoclip/i, '')
                .replace(/|/g, '')
                .replace(/-/g, '')
                .replace(/"/g, '')
                .replace(/M\/V/gi, '')
                .replace(/Lyrics/gi, '')
                .replace(/letra/gi, '')
            return tituloFix.trim();
        }
        async function buscarCancion(titulo) {
            try {
                const searches = await Client.songs.search(titulo);
                const firstSong = await searches[0];
                if (firstSong) {
                    return firstSong;
                } else {
                    return undefined;
                }
            } catch {
                return undefined;
            }
        }
    }
}