const { ROL } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { getInteractionUser } = require("../../handlers/funciones");
const { PermissionFlagsBits } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "unban",
    description: `⚔️ Sirve para sacar a alguien de la cárcel`
}

module.exports = {
    ...command_data,
    aliases: ["unbanear", "desbanear", "untimeout", "unmute"],
    roles: [ROL.MOD, ROL.ADMIN],
    data: {
        ...command_data,
        options: [
            {
                ...OPTION.USER,
                required: true
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.BanMembers
    },
    run: async (client, interaction) => {
        try {
            var toMember = getInteractionUser(interaction, 'No estoy baneado :\'<', true, true);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        var respuesta;
        if (toMember.roles.cache.has(ROL.MALTRATADOR)) {
            toMember.roles.remove(ROL.MALTRATADOR);
            respuesta = `${toMember} ha sido liberad@`;
        } else {
            respuesta = `${toMember} no está en la carcel`;
        }
        interaction.reply({ content: respuesta, ephemeral: true });
    }
}