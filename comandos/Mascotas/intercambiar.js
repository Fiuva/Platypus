const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { findOrCreateDocument, getInteractionUser } = require("../../handlers/funciones");
const { MascotasData } = require("../../models/mascotas");

const command_data = {
    name: "intercambiar",
    description: `🐹🔛🐹 Empieza a intercambiar mascotas con alguien`
}

module.exports = {
    ...command_data,
    aliases: ["intercambio"],
    channels: [CANAL_TEXTO.COMANDOS, CANAL_TEXTO.GENERAL],
    data: {
        ...command_data,
        options: [
            { ...OPTION.USER, required: true }
        ]
    },
    run: async (client, interaction) => {
        try {
            var to = getInteractionUser(interaction, 'Yo no tengo mascotas :\'<', true);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }

        const userMascotas = await findOrCreateDocument(interaction.user.id, MascotasData);
        if (userMascotas.mascotas.length == 0)
            return interaction.reply({ content: `No puedes intercambiar mascotas porque no tienes`, ephemeral: true });

        var embed = new EmbedBuilder()
            .setTitle(`${to.username} quieres intercambiar mascotas con ${interaction.user.username}??`)

        const buttonYes = new ButtonBuilder()
            .setCustomId(`intercambio_aceptar_${to.id}_${interaction.user.id}`)
            .setEmoji('✅')
            .setStyle('Success');

        const buttonNo = new ButtonBuilder()
            .setCustomId(`intercambio_rechazar_${to.id}_${interaction.user.id}`)
            .setEmoji('✖️')
            .setStyle('Danger')

        interaction.reply({ content: `${interaction.user} quiere intercambier mascotas con ${to}`, embeds: [embed], components: [new ActionRowBuilder().addComponents(buttonYes, buttonNo)] })
    }
}