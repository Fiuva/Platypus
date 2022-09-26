﻿const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { MascotasData } = require("../../models/mascotas");

module.exports = {
    name: "intercambiar",
    aliases: ["intercambio"],
    canales: [CANAL_TEXTO.COMANDOS, CANAL_TEXTO.GENERAL],
    descripcion: "Intercambaia mascotas con alguien",
    run: async (client, message, args) => {
        const to = message.mentions.members.first();
        if (!to) return message.reply(`Menciona a la persona con la que quieres intercambiar mascotas :>`);
        const userMascotas = await findOrCreateDocument(message.author.id, MascotasData);
        if (userMascotas.mascotas.length == 0) return message.reply(`No puedes intercambiar mascotas porque no tienes`);
        var embed = new EmbedBuilder()
            .setTitle(`${to.user.username} quieres intercambiar mascotas con ${message.author.username}??`)
        const buttonYes = new ButtonBuilder()
            .setCustomId(`intercambio_aceptar_${to.id}_${message.author.id}`)
            .setEmoji('✅')
            .setStyle('Success');
        const buttonNo = new ButtonBuilder()
            .setCustomId(`intercambio_rechazar_${to.id}_${message.author.id}`)
            .setEmoji('✖️')
            .setStyle('Danger')
        message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(buttonYes, buttonNo)] })
    }
}