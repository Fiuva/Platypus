const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS, CANAL_VOZ } = require("../../config/constantes");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "help",
    description: `❓ Sirve para ver los comandos disponibles`
}

module.exports = {
    ...command_data,
    aliases: ["help", "comandos", "commands"],
    channels: [CANAL_TEXTO.COMANDOS, CANAL_TEXTO.MUSICA, CANAL_VOZ.MUSICA],
    data: {
        ...command_data,
        options: [
            {
                name: `general`,
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'mascotas',
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'música',
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },
    run: async (client, interaction) => {
        switch (interaction.options.getSubcommand()) {
            case 'general':
                mostrarHelpComandos(client.commands, interaction);
                break;
            case 'mascotas':
                mostrarHelpComandosMascotas(client.commands, interaction);
                break
            case 'música':
                mostrarHelpMusica(client.commands, interaction);
        }

    }
}

function mostrarHelpComandos(comandos, interaction) {
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#FEA0FA')
        .setTitle('COMANDOS')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png' })
        .setDescription(`Veo que necesitas ayuda`)
        .addFields(
            { name: `#〔🦦〕comandos-platypus`, value: `- - - - - - - - - - - - - - - - - - -` },
            { name: `</${comandos.get('rank').name}:0>`, value: comandos.get('rank').description, inline: true },
            { name: `</${comandos.get('color').name}:0>`, value: comandos.get('color').description, inline: true },
            { name: `</${comandos.get('top').name}:0>`, value: comandos.get('top').description },
            { name: `</${comandos.get('evento').name}:0>`, value: comandos.get('evento').description },
            { name: `</${comandos.get('tienda').name}:0>`, value: comandos.get('tienda').description },
            { name: `</${comandos.get('vender').name}:0>`, value: comandos.get('vender').description },
            { name: `</${comandos.get('inventario').name}:0>`, value: comandos.get('inventario').description, inline: true },
            { name: '#〔💬〕general', value: `- - - - - - - - - - - -` },
            { name: `</${comandos.get('casar').name}:0>`, value: comandos.get('casar').description, inline: true },
            { name: `</${comandos.get('divorciar').name}:0>`, value: comandos.get('divorciar').description, inline: true },
            { name: `</${comandos.get('3').name}:0>`, value: comandos.get('3').description },
            { name: `</${comandos.get('2048').name}:0>`, value: comandos.get('2048').description, inline: true },
            { name: 'Nivel', value: `Gana **experiencia** siendo activo en el chat para conseguir ${MONEDAS.PC.NOMBRE} \n y consigue **roles** en función de tu nivel` },
        );
    interaction.reply({ embeds: [mensajeAyuda] });
}

function mostrarHelpComandosMascotas(comandos, interaction) {
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#A0FEFE')
        .setTitle('COMANDOS DE MASCOTAS')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Adopt_Me%21_Wordmark.svg/1280px-Adopt_Me%21_Wordmark.svg.png' })
        .setDescription(`Veo que necesitas ayuda, compra **huevos** en la **</tienda:0>**`)
        .addFields(
            { name: `#〔🦦〕comandos-platypus`, value: `- - - - - - - - - - - - - - - - - -` },
            { name: `</${comandos.get('equipar').name}:0>`, value: comandos.get('equipar').description, inline: true },
            { name: `</${comandos.get('nombre').name}:0>`, value: comandos.get('nombre').description, inline: true },
            { name: `</${comandos.get('mascota').name}:0>`, value: comandos.get('mascota').description, inline: true },
            { name: `</${comandos.get('mascotas').name}:0>`, value: comandos.get('mascotas').description },
            { name: `</${comandos.get('intercambiar').name}:0>`, value: comandos.get('intercambiar').description },
            { name: `</${comandos.get('fusionar').name}:0>`, value: comandos.get('fusionar').description },
            { name: `</${comandos.get('huevos').name}:0>`, value: comandos.get('huevos').description },
            { name: 'Niveles de mascota', value: `Sube de **nivel** a tu mascota equipada (*y a la de tu pareja*) para ganar ${MONEDAS.PC.NOMBRE} *hablando con gente*` }
        );
    interaction.reply({ embeds: [mensajeAyuda] });
}

function mostrarHelpMusica(comandos, interaction) {
    const mensajeAyuda = new EmbedBuilder()
        .setColor('#FEA0FA')
        .setTitle('COMANDOS MÚSICA')
        .setAuthor({ name: 'PLATYPUS', iconURL: 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png' })
        .setDescription(`Veo que necesitas ayuda`)
        .addFields(
            { name: `</${comandos.get('play').name}:0>`, value: comandos.get('play').description, inline: true },
            { name: `</${comandos.get('skip').name}:0>`, value: comandos.get('skip').description, inline: true },
            { name: `</${comandos.get('stop').name}:0>`, value: comandos.get('stop').description },
            { name: `</${comandos.get('lyrics').name}:0>`, value: comandos.get('lyrics').description },
            { name: `</${comandos.get('stats').name}:0>`, value: comandos.get('stats').description },
            //{ name: '🎶Música avanzado ⟬*Comprar en la tienda*⟭🎶', value: `- - - - - - - - - - - - - - - - - - - - - - - - - - -` },
            //{ name: `${p}${comandos.get('pause').name}`, value: comandos.get('pause').description, inline: true },
            //{ name: `${p}prev`, value: comandos.get('anterior').description, inline: true },
            //{ name: `${p}${comandos.get('bucle').name}`, value: comandos.get('bucle').description },
            { name: `</${comandos.get('save').name}:0>`, value: comandos.get('save').description, inline: true },
            //{ name: `${p}av`, value: comandos.get('adelantar').description },
            //{ name: `${p}${comandos.get('mezclar').name}`, value: comandos.get('mezclar').description },
            //{ name: `${p}${comandos.get('filtro').name}`, value: comandos.get('filtro').description },
        );
    interaction.reply({ embeds: [mensajeAyuda] });
}