const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS } = require("../../config/constantes");

module.exports = {
    name: "evento",
    aliases: ["event", "eventhelp"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Sirve para ver los comandos disponibles",
    run: async (client, message, args) => {
        const mensajeAyuda = new EmbedBuilder()
            .setColor('#A0E6FE')
            .setTitle('❄️ EVENTO DE NAVIDAD ❄️')
            .setDescription(`Evento activo hasta... que acaben mis exámenes xDDD`)
            .addFields(
                { name: 'Nuevas monedas exclusivas', value: `Gana **${MONEDAS.NAVIDAD.NOMBRE} ${MONEDAS.NAVIDAD.EMOTE}** abriendo regalos que aparecen en el chat cuando está activo` },
                { name: 'Mascotas navideñas exclusivas', value: `Compra nuevos huevos con **${MONEDAS.NAVIDAD.NOMBRE} ${MONEDAS.NAVIDAD.EMOTE}** y consigue las **10** nuevas mascotas` }
            )
            .setFooter({ text: `Pronto habrá más` })

        message.channel.send({ embeds: [mensajeAyuda] });
    }
}
