const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS, EVENTOS } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { findOrCreateDocument, getInteractionUser } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

const command_data = {
    name: "inventario",
    description: "🔧 Consulta tú inventario y los logros del servidor :>"
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            OPTION.USER
        ]
    },
    run: async (client, interaction) => {
        try {
            var author = getInteractionUser(interaction)
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        var user = await findOrCreateDocument(author.id, Usuario);

        var text_banco = `${user.monedas} ${MONEDAS.PC.EMOTE}`
        if (EVENTOS.NAVIDAD) text_banco += `\n${user.pavos} ${MONEDAS.NAVIDAD.EMOTE} `
        let mensajeInventario = new EmbedBuilder()
            .setColor(user.color)
            .setTitle('Inventario')
            .setAuthor({ name: author.username, iconURL: author.displayAvatarURL({ format: 'jpg' }) })
            .setDescription(`Contempla el hermoso inventario de ${author.username}`)

        if (Object.keys(user.medallas).length > 0) {
            var texto_medallas = "";
            for (const [key, value] of Object.entries(user.medallas))
                texto_medallas = `**Temporada ${key}**: ${value} \n`

            mensajeInventario.addFields({ name: `🎖️Medallas: `, value: texto_medallas });
        }

        mensajeInventario.addFields(
            { name: `Banco: `, value: text_banco, inline: true },
            { name: 'Anillos: ', value: `${user.anillo} 💍`, inline: true },
        )

        interaction.reply({ embeds: [mensajeInventario] });
    }
}