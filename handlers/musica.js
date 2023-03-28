const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { CANAL_TEXTO } = require('../config/constantes');
const { EmbedBuilder } = require('discord.js');
const { buscarCancion } = require('./funciones');

module.exports = (client, Discord) => {
    console.log("Módulo de música cargado!");
    client.player = createAudioPlayer();
    ytdl_options = {
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 4
    };

    client.player.queue = [];
    this.primer_embed = 0;
    client.player.getStatus = function () {
        return this._state.status;
    };
    client.player.isIdle = function () {
        return this.getStatus() =="idle";
    };
    client.player.isPlaying = function () {
        return this.getStatus() == "playing";
    };
    client.player.addSong = async function (song, interaction) {
        this.queue.push(song);
        if (this.queue.length == 1) {
            if (this.primer_embed == 0) {
                this.primer_embed = {
                    embed: embed_cancion(song),
                    interaction: interaction
                }
            }
            const stream = ytdl(song.url, ytdl_options);
            const resource = createAudioResource(stream);
            await this.play(resource)
        } else {
            const canciones = this.queue;
            var tiempoDeEspera = 0;
            var i = 0;
            for (i; i < canciones.length - 1; i++) {
                tiempoDeEspera = tiempoDeEspera + parseInt(canciones[i].duration);
            }

            const mensCancion = new EmbedBuilder()
                .setTitle(song.name)
                .setColor('#006ABD')
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .setAuthor({ name: `Se ha añadido a la cola:` })
                .addFields(
                    { name: 'Tiempo estimado de espera:', value: `${Math.floor(tiempoDeEspera / 60)}:${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60 < 10 ? '0' : ''}${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60}`, inline: true },
                    { name: 'Posición:', value: i.toString(), inline: true })
                .setFooter({ text: `Duración:  ${song.formattedDuration}` })

            interaction.reply({ embeds: [mensCancion] });
        }
    };
    client.player.skip = async function (interaction) {
        client.player.queue.shift();
        if (client.player.queue.length > 0) {
            const song = client.player.queue[0];
            this.primer_embed = {
                embed: embed_cancion(song, 'skip'),
                interaction: interaction
            }
            const stream = ytdl(song.url, ytdl_options);
            const resource = createAudioResource(stream);
            await client.player.play(resource)
        } else {
            cerrar_conexion();
            interaction.reply({ embeds: [new EmbedBuilder().setTitle('No hay más canciones en la cola').setColor("#00FFCE")] });
        }
    }
    client.player.stop = async function (interaction) {
        this.queue = [];
        cerrar_conexion();
        interaction.reply({ embeds: [new EmbedBuilder().setTitle('Música detenida').setColor("#F73A0D")] });
    }
    client.player.lyrics = async function (interaction) {
        if (this.queue.length == 0) return interaction.reply({ content: "No hay canciones en la cola :'>", ephemeral: true });
        const song = this.queue[0]
        buscarCancion(arreglarTitulo(song.name), interaction);
    }
    client.player.connect = function (voiceChannel) {
        this.primer_embed = 0;
        this.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        this.textChannel = voiceChannel.guild.channels.cache.get(CANAL_TEXTO.MUSICA);
        this.connection.subscribe(this);
    }



    client.player.on(AudioPlayerStatus.Playing, async () => {
        try {
            const primer_embed = client.player.primer_embed;
            if (primer_embed != -1 && primer_embed != 0) {
                await primer_embed.interaction.reply({ embeds: [primer_embed.embed] });
                client.player.primer_embed = -1
            } else {
                const song = client.player.queue[0]
                let escuchando = embed_cancion(song);
                client.player.textChannel.send({ embeds: [escuchando] });
            }
        } catch { }
    });
    client.player.on(AudioPlayerStatus.Idle, async () => {
        client.player.queue.shift();
        if (client.player.queue.length > 0) {
            const song = client.player.queue[0];
            const stream = ytdl(song.url, ytdl_options);
            const resource = createAudioResource(stream);
            await client.player.play(resource)
        } else {
            cerrar_conexion();
        }
    });


    function cerrar_conexion() {
        client.player.connection.destroy()
        client.player.connection = null;
    }
};


function embed_cancion(song, data) {
    let mensajeBucle = "";
    var escuchando = new EmbedBuilder()
        .setTitle(song.name)
        .setColor(data == 'skip' ?'#00FFCE':'#00FF3C')
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setAuthor({ name: `Ahora escuchando: ` })
        .setFooter({ text: `Duración:  ${song.formattedDuration} ${mensajeBucle}` })

    return escuchando;
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