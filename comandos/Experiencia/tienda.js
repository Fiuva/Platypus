const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { PRECIO, CANAL_TEXTO, MONEDAS } = require("../../config/constantes");
const { abrir } = require("../../handlers/botones/funcionesTienda");
const { HUEVOS } = require("../../handlers/juegos/funcionesMascotas");
const { Tipo_Huevo } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");
const { ComponentType } = require("../../node_modules/discord-api-types/v10");


module.exports = {
    name: "tienda",
    aliases: ["comprar", "shop"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: `Compra cosas en la tienda con ${MONEDAS.PC.NOMBRE}`,
    run: async (client, message, args) => {
        var userTienda = (await Usuario.find({ idDiscord: message.author.id }))[0];
        const mensajeTienda = new EmbedBuilder()
            .setColor('#74d600')
            .setTitle('Tienda')
            .setAuthor({ name: 'Server de Fiuva', iconURL: message.guild.iconURL() })
            .setDescription(`Aquí puedes comprar cosas lechosas \n con las ${MONEDAS.PC.NOMBRE} que has ganado`)
            .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
            .addFields(
                { name: '💍 Anillo', value: `${PRECIO.ANILLO} ${MONEDAS.PC.NOMBRE}` },
                { name: '🎶 Musica ⟬*más comandos*⟭', value: `${PRECIO.MUSICA_PRO} ${MONEDAS.PC.NOMBRE}` },
                { name: '💰 Rol Millonario', value: `${PRECIO.MILLONARIO} ${MONEDAS.PC.NOMBRE}` }
            )
            .addFields({ name: '\u200B', value: '\u200B' })
            .setFooter({ text: `${message.author.username} tienes ${userTienda.monedas} ${MONEDAS.PC.NOMBRE}`, iconURL: message.author.displayAvatarURL() });

        var bAnillo = new ButtonBuilder()
            .setEmoji('💍')
            .setCustomId(`tienda_anillo_${message.author.id}`)
            .setStyle('Secondary')
        var bMillonario = new ButtonBuilder()
            .setEmoji('💰')
            .setCustomId(`tienda_millonario_${message.author.id}`)
            .setStyle('Secondary')
        var bMusicaPro = new ButtonBuilder()
            .setEmoji('🎶')
            .setCustomId(`tienda_musica-pro_${message.author.id}`)
            .setStyle('Secondary')
        if (userTienda.monedas > PRECIO.ANILLO) {
            bAnillo.setStyle('Success');
            if (userTienda.monedas > PRECIO.MUSICA_PRO) {
                bMusicaPro.setStyle('Success');
                if (userTienda.monedas > PRECIO.MILLONARIO) {
                    bMillonario.setStyle('Success');
                }
            }
        }

        const tituloMenu = `Compra huevos✨`;
        var menu = new StringSelectMenuBuilder()
            .setPlaceholder(tituloMenu)
            .setCustomId(`id_menu_huevos`);

        Object.values(HUEVOS).forEach(huevo => {
            if (!huevo.TIENDA) return;
            var emoteMoneda = MONEDAS.PC.NOMBRE;
            if (huevo.TIPO == Tipo_Huevo.Navidad) emoteMoneda = MONEDAS.NAVIDAD.EMOTE;
            menu.addOptions(
                {
                    label: huevo.NOMBRE,
                    value: huevo.NOMBRE,
                    description: `Precio: *${huevo.PRECIO}* ${emoteMoneda}`,
                    emoji: `${huevo.EMOJI}`
                })
        })

        var rowTienda = new ActionRowBuilder()
            .addComponents(bAnillo, bMusicaPro, bMillonario)

        const components = [rowTienda, new ActionRowBuilder().addComponents(menu)];
        const m = await message.channel.send({ embeds: [mensajeTienda], components: components });

        const collector = m.createMessageComponentCollector({
            componentType: ComponentType.SelectMenu
        });

        collector.on('collect', async (collected) => {
            const value = collected.values[0];
            try {
                var userCollect = (await Usuario.find({ idDiscord: collected.user.id }))[0];
                try {
                    await abrir(Object.values(HUEVOS).find(huevo => huevo.NOMBRE == value), userCollect, message, collected, components);
                } catch (e) {
                    collected.reply({ ephemeral: true, content: e.message })
                }
            } catch (e) {
                console.log(e.message);
            }
        })

    }
}