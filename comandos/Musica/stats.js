const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

const command_data = {
    name: "stats",
    description: `🎶 Para ver las canciones en cola`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        var songs = client.player.queue
        if (songs.length == 0) {
            return interaction.reply({ content: `No hay canciones en la cola`, ephemeral: true });
        }
        var mensajeCanciones = '';
        var tiempo = 0;
        for (i = 0; i < songs.length; i++) {
            tiempo = tiempo + parseInt(songs[i].duration);
            if (i < 20) mensajeCanciones = mensajeCanciones + (i + 1) + '. ' + songs[i].name + '\n';
        }
        //console.log(tiempo)
        var horas = '';
        var minutos = '';
        if (tiempo >= 3600) {
            horas = tiempo / 3600 << 0;
            tiempo = tiempo - horas * 3600;
        }
        if (tiempo >= 60) {
            minutos = tiempo / 60 << 0;
            tiempo = tiempo - minutos * 60;
        }
        const stats = new EmbedBuilder()
            .setTitle('Stats de la musica')
            .setFooter({ text: `${songs.length} canciones en cola | ${horas != '' ? horas + 'h ' : ''}${minutos}min` })
            .setDescription(mensajeCanciones)
        interaction.reply({ embeds: [stats] });
    }
}