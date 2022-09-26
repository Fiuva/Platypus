const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO, NOMBRE_MONEDAS, PRECIO } = require("../../config/constantes");
const { calcularPrecioVenta } = require("../../handlers/funciones");

module.exports = {
    name: "vender",
    aliases: ["sell"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Vende cosas de la tienda",
    run: async (client, message, args) => {
        const mensajeTienda = new EmbedBuilder()
            .setColor('#AB0101')
            .setTitle('Vender')
            .setAuthor({ name: 'Server de Fiuva', iconURL: message.guild.iconURL() })
            .setDescription(`Aquí puedes vender maravillas \n y recuperar ${NOMBRE_MONEDAS}`)
            .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
            .addFields(
                { name: 'Vender: Anillo 💍', value: `${calcularPrecioVenta(PRECIO.ANILLO)} ${NOMBRE_MONEDAS}` },
                { name: 'Vender: Musica⟬*ventajas*⟭ 🎶', value: `${calcularPrecioVenta(PRECIO.MUSICA_PRO)} ${NOMBRE_MONEDAS}` },
                { name: 'Vender: Millonario 💰', value: `${calcularPrecioVenta(PRECIO.MILLONARIO)} ${NOMBRE_MONEDAS}` }
            )
        const botonAnillo = new ButtonBuilder()
            .setEmoji('💍')
            .setCustomId(`vender_anillo_${message.author.id}`)
            .setStyle('Danger')
        const botonMusica = new ButtonBuilder()
            .setEmoji('🎶')
            .setCustomId(`vender_musica-pro_${message.author.id}`)
            .setStyle('Danger')
        const botonMillonario = new ButtonBuilder()
            .setEmoji('💰')
            .setCustomId(`vender_millonario_${message.author.id}`)
            .setStyle('Danger')
        const row = new ActionRowBuilder()
            .addComponents(botonAnillo, botonMusica, botonMillonario)
        message.channel.send({ embeds: [mensajeTienda], components: [row] });
    }
}