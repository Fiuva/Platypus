const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, PRECIO, MONEDAS } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

const command_data = {
    name: "divorciar",
    description: `💍 Sirve para divorciarse :<`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.GENERAL],
    aliases: ["divorcio", "divorciarse"],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        var user = await findOrCreateDocument(interaction.user.id, Usuario);
        if (user.parejaId == '0')
            return interaction.reply({ content: `${interaction.user} no estás casad@`, ephemeral: true });

        if (user.monedas < PRECIO.DIVORCIO)
            return interaction.reply({ content: `${interaction.user} necesitas ${PRECIO.DIVORCIO} ${MONEDAS.PC.NOMBRE} para divorciarte` });

        const botonSi = new ButtonBuilder()
            .setLabel('Si')
            .setCustomId(`pareja_divorciar-si_${interaction.user.id}`)
            .setStyle('Success')
        const botonNo = new ButtonBuilder()
            .setLabel('No')
            .setCustomId(`pareja_divorciar-no_${interaction.user.id}`)
            .setStyle('Danger')
        const botonesRow = new ActionRowBuilder()
            .addComponents(botonSi, botonNo)

        try {
            var pareja = await interaction.guild.members.fetch(user.parejaId);
        } catch {
            var pareja = null;
        }
        let embed = new EmbedBuilder()
            .setDescription(`¿Vas dejar a los 7 niños abandonados?`)
            .addFields({ name: `Precio del divorcio`, value: `${PRECIO.DIVORCIO} ${MONEDAS.PC.EMOTE}` })
            .setColor(user.color)

        interaction.reply({
            content: `¿${interaction.user} seguro que te quieres **divorciar** de ${pareja?.user ?? '\`pareja perdida\`'}?`,
            embeds: [embed],
            components: [botonesRow]
        });
    }
}