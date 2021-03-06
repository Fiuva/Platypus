const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { MessageEmbed } = require('discord.js');
const { PRIVATE_CONFIG, CANAL_TEXTO } = require('../config/constantes');

module.exports = (client, Discord) => {
    console.log("Módulo de música cargado!");
    client.distube = new DisTube(client, {
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs: 0,
        nsfw: false,
        emptyCooldown: 25,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4
        },
        youtubeDL: false,
        plugins: [
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
                api: {
                    clientId: PRIVATE_CONFIG.SPOTIFY.clientId,
                    clientSecret: PRIVATE_CONFIG.SPOTIFY.clientSecret
                }
            }),
            new SoundCloudPlugin()
        ]
    });

    client.distube.on("playSong", (queue, song) => {
        client.distube.setVolume(queue, 100);
        var mensajeBucle;
        switch (queue.repeatMode) {
            case 1:
                mensajeBucle = '🔂';
                break;
            case 2:
                mensajeBucle = '🔁';
                break;
            default:
                mensajeBucle = '';
                break;
        }
        var escuchando = new MessageEmbed()
            .setTitle(song.name)
            .setColor('#00FF3C')
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setAuthor({ name: `Ahora escuchando: ` })
            .setFooter({ text: `Duración:  ${song.formattedDuration} ${mensajeBucle}` })
        if (song.user.bot) escuchando.setDescription('Recomendación del ornitorrinco :>');
        queue.textChannel.send({ embeds: [escuchando] });
    });


    client.distube.on("addSong", (queue, song) => {
        const canciones = queue.songs;
        var tiempoDeEspera = 0;
        var i = 0;
        for (i; i < canciones.length - 1; i++) {
            tiempoDeEspera = tiempoDeEspera + parseInt(canciones[i].duration);
        }

        const mensCancion = new MessageEmbed()
            .setTitle(song.name)
            .setColor('#006ABD')
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setAuthor({ name: `Se ha añadido a la cola:` })
            .addField('Tiempo estimado de espera:', `${Math.floor(tiempoDeEspera / 60)}:${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60 < 10 ? '0' : ''}${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60}`, true)
            .addField('Posición:', i.toString(), true)
            .setFooter({ text: `Duración:  ${song.formattedDuration}` })

        queue.textChannel.send({ embeds: [mensCancion] });
    });

    client.distube.on("initQueue", (queue) => {
        queue.autoplay = true;
    });

    client.distube.on("addList", (queue, playlist) => {
        const mensPlaylist = new MessageEmbed()
            .setTitle(playlist.name)
            .setColor('#E758A1')
            .setURL(playlist.url)
            .setThumbnail(playlist.thumbnail)
            .setAuthor({ name: `Se ha añadido la playlist:` })
            .addField('Canciones:', playlist.songs.length.toString(), true)
            .addField('Añadida por:', playlist.member.user.username, true)
            .setFooter({ text: `Duración:  ${playlist.formattedDuration}` })

        queue.textChannel.send({ embeds: [mensPlaylist] });
        client.channels.cache.get(CANAL_TEXTO.MUSICA)
            .messages.cache.get(playlist.metadata.messageId)
            .delete();
    });
};