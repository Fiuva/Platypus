const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS } = require("../../config/constantes");
const { findOrCreateDocument, getMentionOrUser } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "inventario",
    aliases: ["inventory", "bag", "monedas"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Consulta tu inventario :>",
    run: async (client, message, args) => {
        var author = getMentionOrUser(message);
        var user = await findOrCreateDocument(author.id, Usuario);

        const mensajeInventario = new EmbedBuilder()
            .setColor(user.color)
            .setTitle('Inventario')
            .setAuthor({ name: author.username, iconURL: author.displayAvatarURL({ format: 'jpg' }) })
            .setDescription(`Contempla el hermoso inventario de ${author.username}`)
            .addFields(
                { name: `Banco: `, value: `${user.monedas} ${MONEDAS.PC.EMOTE} \n${user.pavos} ${MONEDAS.NAVIDAD.EMOTE} ` },
                { name: 'Anillos: ', value: `${user.anillo}` },
            )
        message.channel.send({ embeds: [mensajeInventario] });
    }
}