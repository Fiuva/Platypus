const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, NOMBRE_MONEDAS } = require("../../config/constantes");
const config = require('../../config/config.json')

module.exports = {
    name: "ayuda",
    aliases: ["help", "comandos", "commands"],
    canales: [CANAL_TEXTO.COMANDOS, CANAL_TEXTO.MUSICA],
    descripcion: "Sirve para ver los comandos disponibles",
    run: async (client, message, args) => {
        if (message.channel.id == CANAL_TEXTO.COMANDOS) {
            mostrarHelpComandos(client.commands, message);
        } else if (message.channel.id == CANAL_TEXTO.MUSICA) {
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
            { name: `${p}${comandos.get('rank').name}`, value: comandos.get('rank').descripcion, inline: true },
            { name: `${p}${comandos.get('color').name}`, value: comandos.get('color').descripcion, inline: true },
            { name: `${p}${comandos.get('top').name}`, value: comandos.get('top').descripcion },
            { name: `${p}${comandos.get('tienda').name}`, value: comandos.get('tienda').descripcion },
            { name: `${p}${comandos.get('vender').name}`, value: comandos.get('vender').descripcion },
            { name: `${p}${comandos.get('inventario').name}`, value: comandos.get('inventario').descripcion, inline: true },
            { name: `${p}${comandos.get('rank2048').name}`, value: comandos.get('rank2048').descripcion },
            { name: '#〔💬〕general', value: `- - - - - - - - - - - -` },
            { name: `${p}${comandos.get('casar').name}`, value: comandos.get('casar').descripcion, inline: true },
            { name: `${p}${comandos.get('divorciar').name}`, value: comandos.get('divorciar').descripcion, inline: true },
            { name: `${p}${comandos.get('3').name}`, value: comandos.get('3').descripcion },
            { name: `${p}${comandos.get('2048').name}`, value: comandos.get('2048').descripcion, inline: true },
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
            { name: `${p}${comandos.get('play').name}`, value: comandos.get('play').descripcion, inline: true },
            { name: `${p}${comandos.get('skip').name}`, value: comandos.get('skip').descripcion, inline: true },
            { name: `${p}${comandos.get('stop').name}`, value: comandos.get('stop').descripcion },
            { name: `${p}${comandos.get('letra').name}`, value: comandos.get('letra').descripcion },
            { name: `${p}${comandos.get('stats').name}`, value: comandos.get('stats').descripcion },
            { name: '🎶Música avanzado ⟬*Comprar en la tienda*⟭🎶', value: `- - - - - - - - - - - - - - - - - - - - - - - - - - -` },
            { name: `${p}${comandos.get('pause').name}`, value: comandos.get('pause').descripcion, inline: true },
            { name: `${p}prev`, value: comandos.get('anterior').descripcion, inline: true },
            { name: `${p}${comandos.get('bucle').name}`, value: comandos.get('bucle').descripcion },
            { name: `${p}save`, value: comandos.get('guardar').descripcion, inline: true },
            { name: `${p}av`, value: comandos.get('adelantar').descripcion },
            { name: `${p}${comandos.get('mezclar').name}`, value: comandos.get('mezclar').descripcion },
            { name: `${p}${comandos.get('filtro').name}`, value: comandos.get('filtro').descripcion },
        );
    message.channel.send({ embeds: [mensajeAyuda] });
}