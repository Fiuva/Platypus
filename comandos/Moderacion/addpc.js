const { ROL, MONEDAS } = require("../../config/constantes");
const { modificarMonedas, findOrCreateDocument, getInteractionUser } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");
const { OPTION } = require("../../handlers/commandOptions");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const command_data = {
    name: "addpc",
    description: `👑 Sirve para añadir platycoins a alguien`
}

module.exports = {
    ...command_data,
    aliases: ["addplatycoins"],
    roles: [ROL.ADMIN],
    data: {
        ...command_data,
        options: [
            {
                ...OPTION.USER,
                required: true
            },
            {
                name: `platycoins`,
                description: `Número de ${MONEDAS.PC.NOMBRE}`,
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: `razón`,
                description: `Razón por la que se modifican`,
                type: ApplicationCommandOptionType.String,
                required: false
            },
        ],
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    },
    run: async (client, interaction) => {
        try {
            var toUser = getInteractionUser(interaction, `No me puedes añadirme monedas a mí :c`);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        const numToAdd = interaction.options.getInteger('platycoins');
        const user = await findOrCreateDocument(toUser.id, Usuario);
        const monedasAntes = user.monedas;

        modificarMonedas(toUser.id, numToAdd, user)
            .then(() => {
                let embed = new EmbedBuilder()
                    .setDescription(`Se han ${numToAdd >= 0 ? 'añadido' : 'quitado'} **${Math.abs(numToAdd)} ${MONEDAS.PC.NOMBRE} a ${toUser}** (Antes: ${monedasAntes} -> __Ahora: ${monedasAntes + numToAdd}__)`)
                    .setColor(`${numToAdd > 0 ? '#3EE122' : '#E73636'}`)
                let descripcion = interaction.options.getString('razón')
                if (descripcion) embed.addFields({ name: `Razón`, value: descripcion })
                interaction.reply({
                    content: `${toUser}`,
                    embeds: [embed]
                })
            });
    }
}