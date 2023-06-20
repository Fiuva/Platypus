const diainternacionalde = require("../../models/diainternacionalde");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const command_data = {
    name: "dia",
    description: `📆 Sirve para ver que se celebra un día`
}

module.exports = {
    ...command_data,
    data: {
        ...command_data,
        options: [
            {
                name: `día`,
                description: `Ejemplo: 1`,
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: `mes`,
                description: `Ejemplo: mayo`,
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        let mes = interaction.options.getString('mes').toLowerCase();
        let dia = interaction.options.getString('día');

        const did = await diainternacionalde.getCategorizedResultsWithDate(mes, dia);
        if (did) {
            interaction.reply(diainternacionalde.getMessageDataCustom(did, mes, dia));
        } else {
            interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`El \`${dia}\` de \`${mes}\` no es un día válido`) ]  });
        }   
    }
}