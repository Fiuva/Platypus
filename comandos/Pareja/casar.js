const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "casar",
    canales: [CANAL_TEXTO.GENERAL],
    aliases: ["casarse"],
    descripcion: "Sirve para formar una bonita pareja :))",
    run: async (client, message, args) => {
        if (message.mentions.users.size == 0) return message.channel.send(`${message.author} menciona a quien quieres enviar tu solicitud para casarte`);
        if (message.mentions.users.first().id == message.author.id) return message.channel.send(`${message.author} perdone, no le permito casarse con una persona tan fea`);
        try {
            var user = await Usuario.find({ idDiscord: message.author.id }).exec();
            var toUser = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
            if (user[0].parejaId == '0' && toUser[0].parejaId == '0' && user[0].anillo >= 2) {
                const casar = new ButtonBuilder()
                    .setLabel('Casarse')
                    .setCustomId(`pareja_casar_${message.mentions.users.first().id}_${message.author.id}`)
                    .setStyle('Success')
                    .setEmoji('✅')
                const rechazar = new ButtonBuilder()
                    .setLabel('Rechazar')
                    .setCustomId(`pareja_rechazar_${message.mentions.users.first().id}_${message.author.id}`)
                    .setStyle('Danger')
                    .setEmoji('❌')
                const casarRow = new ActionRowBuilder()
                    .addComponents(casar, rechazar)
                message.channel.send({ content: `${message.author.username} se quiere casar con ${message.mentions.users.first().username}, aceptas ${message.mentions.users.first()}?`, components: [casarRow] });
            } else if (user[0].parejaId != '0') {
                message.channel.send(`${message.author} ya tienes a ${await message.guild.members.fetch(user[0].parejaId)} como pareja, para poder casarte con otra persona divórciate antes`);
            } else if (toUser[0].parejaId != '0') {
                message.reply(`${message.mentions.users.first().username} ya tiene pareja`);
            } else {
                message.channel.send(`${message.author} necesitas dos anillos para casarte, ve a la tienda`);
            }
        } catch {
            message.channel.send(`${message.author} no puedo acceder a los datos de esa persona, intentelo más tarde :'D`);
        }
    }
}