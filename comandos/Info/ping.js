const { ROL } = require("../../config/constantes");
const { EmbedBuilder } = require("discord.js");
const { PermissionFlagsBits } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "ping",
    description: `👑 Sirve para ver mi latencia 🤤`
}

module.exports = {
    ...command_data,
    aliases: ["latencia", "ms"],
    roles: [ROL.ADMIN, ROL.MOD],
    data: {
        ...command_data,
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    },
    run: async (client, interaction) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Mi ping es de **${client.ws.ping}ms**`)
                    .setColor('#D34CF7')
            ]
        });
    }
}
