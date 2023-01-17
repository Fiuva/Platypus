const { ROL } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { getInteractionUser } = require("../../handlers/funciones");
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "ban",
    description: `⚔️ Sirve para enviar a la cárcel permanentemente :>`
}

module.exports = {
    ...command_data,
    aliases: ["banear", "carcel"],
    roles: [ROL.MOD, ROL.ADMIN],
    data: {
        ...command_data,
        options: [
            {
                ...OPTION.USER,
                required: true
            },
            {
                name: `razón`,
                description: `Se enviará la razón del baneo al usuario`,
                type: ApplicationCommandOptionType.String,
                required: false
            },
        ],
        defaultMemberPermissions: PermissionFlagsBits.BanMembers
    },
    run: async (client, interaction) => {
        try {
            var toMember = getInteractionUser(interaction, 'No me intentes banear :\'<', true, true);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        var razon = interaction.options.getString('razón');
        var respuesta;
        if (!toMember.roles.cache.has(ROL.MALTRATADOR)) {
            await toMember.roles.add(ROL.MALTRATADOR);
            respuesta = `${toMember} ha sido enviado a la cárcel permanentemente`;
            try {
                if (razon) await toMember.send(`${toMember} has sido **baneado** de el server de **Fiuva**. Razón: ${razon}`);
                await toMember.send(`${toMember} has sido **baneado** de el server de **Fiuva**, ahora solo tendrás disponible la cárcel y poco más, si te sientes arrepentido/a o crees que ha podido ser un error, puedes hablar con los **moderadores** sobre tu situación y se intentará **solucionar**, es importante hacer caso a las **normas** :>`);
            } catch {
                console.log("No se puede enviar el mensaje al usuario baneado");
            }
        } else {
            respuesta = `${toMember} ya está en la cárcel por timeout o ban`;
        }
        interaction.reply({ content: respuesta, ephemeral: true });
    }
}