const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");
const { ROL } = require("../../config/constantes");
const CONSTANTES = require("../../config/constantes");
const RecapData = require("../../models/recapData");
const Usuario = require("../../models/usuario");
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "eval",
    description: `👑 Sirve para evaluar código`
}

module.exports = {
    ...command_data,
    roles: [ROL.ADMIN],
    data: {
        ...command_data,
        options: [
            {
                name: `código`,
                description: `Escribe el código para evaluar`,
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'consola',
                description: 'Modo de respuesta de la consola',
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    {
                        name: '🔴 Mostrar',
                        value: 'mostrar'
                    },
                    {
                        name: '🟡 Ocultar',
                        value: 'ocultar'
                    },
                    {
                        name: '🟢 Omitir',
                        value: 'omitir'
                    }
                ]
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    },
    run: async (client, interaction) => {
        let codigo = interaction.options.getString('código');
        let modo_consola = interaction.options.getString('consola') ?? 'ocultar';
        try {
            const evaluado = await eval(codigo);
            enviarSinLimite(inspect(evaluado), interaction, modo_consola, '#26FF00');

        } catch (e) {
            enviarSinLimite(e.toString(), interaction, modo_consola, '#FF0000');
        }
    }
}

async function enviarSinLimite(s, interaction, modo_consola, color) {
    if (modo_consola == 'omitir')
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Hecho').setColor(color)], ephemeral: true });
    const embeds = [];
    var n = 1983;
    for (var i = 0; i < s.length; i += n) {
        var trimmedString = s.substring(i, i + 1983);
        n = Math.max(Math.min(trimmedString.length, trimmedString.lastIndexOf("\n")), 1000);
        const recortado = s.substring(i, i + n)

        embeds.push(new EmbedBuilder()
            .setDescription(`\`\`\`js\n${recortado.replace(/<ref \*1>/gi, '')}\`\`\``)
            .setColor(color));
    }
    embeds[0].setTitle('Debug');
    embeds[embeds.length - 1].setTimestamp(new Date());
    for (var i = 0; i < embeds.length; i += 3) {
        interaction.reply({ embeds: embeds.slice(i, i + 3), ephemeral: modo_consola == 'ocultar' });
    }
}