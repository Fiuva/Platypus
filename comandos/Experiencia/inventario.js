const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, NOMBRE_MONEDAS } = require("../../config/constantes");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "inventario",
    aliases: ["inventory", "bag", "monedas"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Consulta tu inventario :>",
    run: async (client, message, args) => {
        var username;
        var user;
        try {
            user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
            username = message.mentions.users.first();
        } catch {
            user = await Usuario.find({ idDiscord: message.author.id }).exec();
            username = message.author;
        }

        const mensajeInventario = new EmbedBuilder()
            .setColor(user[0].color)
            .setTitle('Inventario')
            .setAuthor({ name: username.username, iconURL: username.displayAvatarURL({ format: 'jpg' }) })
            .setDescription(`Contempla el hermoso inventario de ${username.username}`)
            .addFields(
                { name: `Banco: `, value: `${user[0].monedas} ${NOMBRE_MONEDAS}` },
                { name: 'Anillos: ', value: `${user[0].anillo}` },
            )
        message.channel.send({ embeds: [mensajeInventario] });
    }
}