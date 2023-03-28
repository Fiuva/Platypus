const Genius = require("genius-lyrics");
const { EmbedBuilder } = require("discord.js");
const Client = new Genius.Client();
const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

const command_data = {
    name: "save",
    description: `⭐ Te enviaré la canción que suena por MD`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    //roles: [ROL.MUSICA_PRO],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        const queue = client.player.queue;
        if (queue.length == 0) return interaction.reply({ content: "No hay canciones sonando para guardar :<", ephemeral: true });

        const qSong = queue[0];
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
            await interaction.user.send({ embeds: [embedGuardado] });
            interaction.reply({ content: "Te acabo de enviar la canción ⭐", ephemeral: true });
        } catch {
            interaction.reply({ content: "No tienes los MD activados :<", ephemeral: true });
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