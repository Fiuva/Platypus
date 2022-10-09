const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, NOMBRE_MONEDAS, CANAL_VOZ } = require("../../config/constantes");
const config = require('../../config/config.json')

module.exports = {
    name: "ayuda",
    aliases: ["help", "comandos", "commands"],
    canales: [CANAL_TEXTO.COMANDOS, CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    description: "Sirve para ver los comandos disponibles",
    run: async (client, message, args) => {
        let channelId = message.channel.id;
        if (channelId == CANAL_TEXTO.COMANDOS) {
            mostrarHelpComandos(client.commands, message);
        } else if (channelId == CANAL_TEXTO.MUSICA || channelId == CANAL_VOZ.MUSICA) {
            mostrarHelpMusica(client.commands, message);
        }
    }
}

function mostrarHelpComandos(comandos, message) {
    const p = config.prefix;
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#FEA0FA')
        .setTitle('COMANDOS')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png' })
        .setDescription(`Veo que necesitas ayuda`)
        .addFields(
            { name: `#〔🦦〕comandos-platypus`, value: `- - - - - - - - - - - - - - - - - -` },
            { name: `${p}${comandos.get('rank').name}`, value: comandos.get('rank').description, inline: true },
            { name: `${p}${comandos.get('color').name}`, value: comandos.get('color').description, inline: true },
            { name: `${p}${comandos.get('top').name}`, value: comandos.get('top').description },
            { name: `${p}${comandos.get('tienda').name}`, value: comandos.get('tienda').description },
            { name: `${p}${comandos.get('vender').name}`, value: comandos.get('vender').description },
            { name: `${p}${comandos.get('inventario').name}`, value: comandos.get('inventario').description, inline: true },
            { name: `${p}${comandos.get('rank2048').name}`, value: comandos.get('rank2048').description },
            { name: '#〔💬〕general', value: `- - - - - - - - - - - -` },
            { name: `${p}${comandos.get('casar').name}`, value: comandos.get('casar').description, inline: true },
            { name: `${p}${comandos.get('divorciar').name}`, value: comandos.get('divorciar').description, inline: true },
            { name: `${p}${comandos.get('3').name}`, value: comandos.get('3').description },
            { name: `${p}${comandos.get('2048').name}`, value: comandos.get('2048').description, inline: true },
            { name: 'Nivel', value: `Gana **experiencia** siendo activo en el chat para conseguir ${NOMBRE_MONEDAS} \n y consigue **roles** en función de tu nivel` },
        );
    message.channel.send({ embeds: [mensajeAyuda] });
}

function mostrarHelpMusica(comandos, message) {
    const p = config.prefix;
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#FEA0FA')
        .setTitle('COMANDOS MÚSICA')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png' })
        .setDescription(`Veo que necesitas ayuda`)
        .addFields(
            { name: `${p}${comandos.get('play').name}`, value: comandos.get('play').description, inline: true },
            { name: `${p}${comandos.get('skip').name}`, value: comandos.get('skip').description, inline: true },
            { name: `${p}${comandos.get('stop').name}`, value: comandos.get('stop').description },
            { name: `${p}${comandos.get('letra').name}`, value: comandos.get('letra').description },
            { name: `${p}${comandos.get('stats').name}`, value: comandos.get('stats').description },
            { name: '🎶Música avanzado ⟬*Comprar en la tienda*⟭🎶', value: `- - - - - - - - - - - - - - - - - - - - - - - - - - -` },
            { name: `${p}${comandos.get('pause').name}`, value: comandos.get('pause').description, inline: true },
            { name: `${p}prev`, value: comandos.get('anterior').description, inline: true },
            { name: `${p}${comandos.get('bucle').name}`, value: comandos.get('bucle').description },
            { name: `${p}save`, value: comandos.get('guardar').description, inline: true },
            { name: `${p}av`, value: comandos.get('adelantar').description },
            { name: `${p}${comandos.get('mezclar').name}`, value: comandos.get('mezclar').description },
            { name: `${p}${comandos.get('filtro').name}`, value: comandos.get('filtro').description },
        );
    message.channel.send({ embeds: [mensajeAyuda] });
}