const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { NOMBRE_MONEDAS, PRECIO, CANAL_TEXTO } = require("../../config/constantes");
const Usuario = require("../../models/usuario");


module.exports = {
    name: "tienda",
    aliases: ["comprar", "shop"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: `Compra cosas en la tienda con ${NOMBRE_MONEDAS}`,
    run: async (client, message, args) => {
        var userTienda = await Usuario.find({ idDiscord: message.author.id }).exec();
        const mensajeTienda = new MessageEmbed()
            .setColor('#74d600')
            .setTitle('Tienda')
            .setAuthor({ name: 'Server de Fiuva', iconURL: message.guild.iconURL() })
            .setDescription(`Aquí puedes comprar cosas lechosas \n con las ${NOMBRE_MONEDAS} que has ganado`)
            .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
            .addFields(
                { name: '💍 Anillo', value: `${PRECIO.ANILLO} ${NOMBRE_MONEDAS}` },
                { name: '🎶 Musica ⟬*más comandos*⟭', value: `${PRECIO.MUSICA_PRO} ${NOMBRE_MONEDAS}` },
                { name: '💰 Rol Millonario', value: `${PRECIO.MILLONARIO} ${NOMBRE_MONEDAS}` }
            )
            .addField('\u200B', '\u200B')
            .setFooter({ text: `${message.author.username} tienes ${userTienda[0].monedas} ${NOMBRE_MONEDAS}`, iconURL: message.author.displayAvatarURL() });

        var bAnillo = new MessageButton()
            .setEmoji('💍')
            .setCustomId(`tienda_anillo_${message.author.id}`)
            .setStyle('SECONDARY')
        var bMillonario = new MessageButton()
            .setEmoji('💰')
            .setCustomId(`tienda_millonario_${message.author.id}`)
            .setStyle('SECONDARY')
        var bMusicaPro = new MessageButton()
            .setEmoji('🎶')
            .setCustomId(`tienda_musica-pro_${message.author.id}`)
            .setStyle('SECONDARY')
        if (userTienda[0].monedas > PRECIO.ANILLO) {
            bAnillo.setStyle('SUCCESS');
            if (userTienda[0].monedas > PRECIO.MUSICA_PRO) {
                bMusicaPro.setStyle('SUCCESS');
                if (userTienda[0].monedas > PRECIO.MILLONARIO) {
                    bMillonario.setStyle('SUCCESS');
                }
            }
        }

        var rowTienda = new MessageActionRow()
            .addComponents(bAnillo, bMusicaPro, bMillonario)

        message.channel.send({ embeds: [mensajeTienda], components: [rowTienda] });
    }
}