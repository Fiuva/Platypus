const { CANAL_TEXTO } = require("../../config/constantes");
const Genius = require("genius-lyrics");
const { MessageEmbed } = require("discord.js");
const Client = new Genius.Client();

module.exports = {
    name: "letra",
    aliases: ["lyrics"],
    descripcion: "Para ver la letra de la canción actual o cualquier otra",
    canales: [CANAL_TEXTO.MUSICA],
    run: async (client, message, args) => {
        if (args.length > 0) { //Titulo escrito
            buscarCancion(args.join());
        } else { //Canción que suena
            const queue = client.distube.getQueue(message);
            if (!queue) return message.reply("No hay canciones en la list :'>");

            buscarCancion(arreglarTitulo(queue.songs[0].name));
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
                    var lyrics = await firstSong.lyrics();
                    var embeds = [];
                    for (var i = 0; i < lyrics.length; i += 2048) {
                        if (i == 0) {
                            embeds.push(
                                new MessageEmbed()
                                    .setTitle(firstSong.title)
                                    .setAuthor({ name: firstSong.artist.name, iconURL: firstSong.artist.thumbnail })
                                    .setThumbnail(firstSong.thumbnail)
                                    .setDescription(lyrics.substr(-lyrics.length, 2048))
                                    .setURL(firstSong.url)
                            );
                        } else {
                            embeds.push(
                                new MessageEmbed()
                                    .setDescription(lyrics.substr(-lyrics.length + i, 2048))
                            );
                        }
                    }
                    embeds[embeds.length - 1].setTimestamp(new Date(`${firstSong._raw.release_date_for_display}`)).setFooter({ text: `Fecha de lanzamiento` })
                    message.channel.send({ embeds: embeds });
                } else {
                    message.channel.send('Canción no encontrada');
                }
            } catch {
                message.channel.send('Canción no encontrada');
            }
            
        }
    }
}