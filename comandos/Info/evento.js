const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS, EVENTOS } = require("../../config/constantes");

const command_data = {
    name: "evento",
    description: `🎟️ Eventos del servidor`
}

module.exports = {
    ...command_data,
    aliases: ["event", "eventhelp"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {

        if (EVENTOS.NAVIDAD) {
            const mensajeAyuda = new EmbedBuilder()
                .setColor('#A0E6FE')
                .setTitle('❄️ EVENTO DE NAVIDAD ❄️')
                .setDescription(`Evento activo hasta... que acaben mis exámenes xDDD`)
                .addFields(
                    { name: 'Nuevas monedas exclusivas', value: `Gana **${MONEDAS.NAVIDAD.NOMBRE} ${MONEDAS.NAVIDAD.EMOTE}** abriendo regalos que aparecen en el chat cuando está activo` },
                    { name: 'Mascotas navideñas exclusivas', value: `Compra nuevos huevos con **${MONEDAS.NAVIDAD.NOMBRE} ${MONEDAS.NAVIDAD.EMOTE}** y consigue las **10** nuevas mascotas` }
                )
                .setFooter({ text: `Pronto habrá más` })

            interaction.reply({ embeds: [mensajeAyuda] });
        } else {
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Actualmente no hay eventos activos`)] })
        }

        const mensajeAyuda = new EmbedBuilder()
            .setColor('#FEDCA0')
            .setTitle('DIA DE LA MARMOTA')
            .setDescription(`Evento activo hasta... pues un par de días xD`)
            .addFields(
                { name: 'Gana una marmota de mascota ⭐', value: `Haz y envía un dibujo tuyo relacionado con la marmota a <#840124539375583262> y gana una marmota gratis :>` }
            )
            .setFooter({ text: `Dia de la marmota: 2/2/2023` })

        interaction.reply({ embeds: [mensajeAyuda] });
    }
}
