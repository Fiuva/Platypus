﻿const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, NOMBRE_MONEDAS } = require("../../config/constantes");
const config = require('../../config/config.json')

module.exports = {
    name: "ayudamascotas",
    aliases: ["helpmascotas", "comandosmascotas", "commandsmascotas", "helppets", "ayudapets", "help2", "ayuda2", "mascotashelp", "petshelp"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Sirve para ver los comandos disponibles",
    run: async (client, message, args) => {
        mostrarHelpComandos(client.commands, message);
    }
}

function mostrarHelpComandos(comandos, message) {
    const p = config.prefix;
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#A0FEFE')
        .setTitle('COMANDOS DE MASCOTAS')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Adopt_Me%21_Wordmark.svg/1280px-Adopt_Me%21_Wordmark.svg.png' })
        .setDescription(`Veo que necesitas ayuda, compra **huevos** en la **!tienda**`)
        .addFields(
            { name: `#〔🦦〕comandos-platypus`, value: `- - - - - - - - - - - - - - - - - -` },
            { name: `${p}${comandos.get('equipar').name}`, value: comandos.get('equipar').description, inline: true },
            { name: `${p}${comandos.get('nombre').name}`, value: comandos.get('nombre').description, inline: true },
            { name: `${p}${comandos.get('mascota').name}`, value: comandos.get('mascota').description, inline: true },
            { name: `${p}${comandos.get('mascotas').name}`, value: comandos.get('mascotas').description },
            { name: `${p}${comandos.get('intercambiar').name}`, value: comandos.get('intercambiar').description },
            { name: `${p}${comandos.get('fusionar').name}`, value: comandos.get('fusionar').description },
            { name: `${p}${comandos.get('huevos').name}`, value: comandos.get('huevos').description },
            { name: 'Niveles de mascota', value: `Sube de **nivel** a tu mascota equipada (*y a la de tu pareja*) para ganar ${NOMBRE_MONEDAS} *hablando con gente*` }
        );
    message.channel.send({ embeds: [mensajeAyuda] });
}