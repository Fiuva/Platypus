const { ROL } = require("../../config/constantes");
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: "test",
    roles: [ROL.ADMIN],
    description: "Cosas de pruebas",
    run: async (client, message, args) => {
        let vc = message.member.voice.channel;
        if (!vc) {
            return message.reply({ content: ":warning: **- Vous devez être dans un salon vocal pour pouvoir jouer de la musique !**", ephemeral: true });
        }

        const stream = ytdl("https://www.youtube.com/watch?v=2Vv-BfVoq4g", {
            filter: "audioonly",
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(stream);

        const connections = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator,
        })

        player.play(resource);
        connections.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connections.destroy();
        });
    }
}