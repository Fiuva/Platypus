const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO, PRECIO, MONEDAS } = require("../../config/constantes");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "divorciar",
    canales: [CANAL_TEXTO.GENERAL],
    aliases: ["divorcio", "divorciarse"],
    description: "Sirve para divorciarse :<",
    run: async (client, message, args) => {
        try {
            var user = await Usuario.find({ idDiscord: message.author.id }).exec();
            if (user[0].parejaId === '0') {
                message.channel.send(`${message.author} no estás casad@`);
            } else {
                if (user[0].monedas < PRECIO.DIVORCIO) {
                    message.channel.send(`${message.author} necesitas ${PRECIO.DIVORCIO} ${MONEDAS.PC.NOMBRE} para divorciarte`);
                } else {
                    const botonSi = new ButtonBuilder()
                        .setLabel('Si')
                        .setCustomId(`pareja_divorciar-si_${message.author.id}`)
                        .setStyle('Success')
                    const botonNo = new ButtonBuilder()
                        .setLabel('No')
                        .setCustomId(`pareja_divorciar-no_${message.author.id}`)
                        .setStyle('Danger')
                    const botonesRow = new ActionRowBuilder()
                        .addComponents(botonSi, botonNo)
                    message.channel.send({
                        content: `${message.author} seguro que te quieres divorciar de ${await message.guild.members.fetch(user[0].parejaId)} y dejar a los 7 niños abandonados? \n (${PRECIO.DIVORCIO} ${MONEDAS.PC.NOMBRE})`,
                        components: [botonesRow]
                    });
                }
            }
        } catch {
            message.reply("Error :<")
        }
    }
}