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
        } else if (EVENTOS.DIA_BESO) {
            const mensajeAyuda = new EmbedBuilder()
                .setColor('#FEA0FA')
                .setTitle('😘 Día internacional del beso')
                .setDescription(`Evento activo un par de días desde el 13/04/2023`)
                .addFields(
                    { name: 'Comando </beso:0>', value: `Gana **${MONEDAS.PC.NOMBRE} ${MONEDAS.PC.EMOTE}** si una persona random del servidor, __acepta tu beso__ 😳` }
                )
                .setFooter({ text: `Pronto habrá más` })

            interaction.reply({ embeds: [mensajeAyuda] });
        } else {
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Actualmente no hay eventos activos`)] })
        }
    }
}
