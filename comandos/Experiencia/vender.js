const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS, PRECIO } = require("../../config/constantes");
const { calcularPrecioVenta } = require("../../handlers/funciones");

const command_data = {
    name: "vender",
    description: `💷 Vende cosas de la tienda`
}

module.exports = {
    ...command_data,
    aliases: ["sell"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        const mensajeTienda = new EmbedBuilder()
            .setColor('#AB0101')
            .setTitle('Vender')
            .setAuthor({ name: 'Server de Fiuva', iconURL: interaction.guild.iconURL() })
            .setDescription(`Aquí puedes vender maravillas \n y recuperar ${MONEDAS.PC.NOMBRE}`)
            .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
            .addFields(
                { name: 'Vender: Anillo 💍', value: `${calcularPrecioVenta(PRECIO.ANILLO)} ${MONEDAS.PC.NOMBRE}` },
                { name: 'Vender: Musica⟬*ventajas*⟭ 🎶', value: `${calcularPrecioVenta(PRECIO.MUSICA_PRO)} ${MONEDAS.PC.NOMBRE}` },
                { name: 'Vender: Millonario 💰', value: `${calcularPrecioVenta(PRECIO.MILLONARIO)} ${MONEDAS.PC.NOMBRE}` }
            )
        const botonAnillo = new ButtonBuilder()
            .setEmoji('💍')
            .setCustomId(`vender_anillo_${interaction.user.id}`)
            .setStyle('Danger')
        const botonMusica = new ButtonBuilder()
            .setEmoji('🎶')
            .setCustomId(`vender_musica-pro_${interaction.user.id}`)
            .setStyle('Danger')
        const botonMillonario = new ButtonBuilder()
            .setEmoji('💰')
            .setCustomId(`vender_millonario_${interaction.user.id}`)
            .setStyle('Danger')
        const row = new ActionRowBuilder()
            .addComponents(botonAnillo, botonMusica, botonMillonario)
        interaction.reply({ embeds: [mensajeTienda], components: [row] });
    }
}