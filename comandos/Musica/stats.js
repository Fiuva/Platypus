const { MessageEmbed } = require("discord.js");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "stats",
    aliases: ["estadisticas"],
    descripcion: "Sirve para ver las canciones en cola",
    canales: [CANAL_TEXTO.MUSICA],
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message);
        var songs = queue.songs
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
        const stats = new MessageEmbed()
            .setTitle('Stats de la musica')
            .setFooter({ text: `${songs.length} canciones en cola | ${horas != '' ? horas + 'h ' : ''}${minutos}min` })
            .setDescription(mensajeCanciones)
        message.channel.send({ embeds: [stats] });
    }
}