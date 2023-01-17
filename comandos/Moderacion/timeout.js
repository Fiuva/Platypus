const { ROL } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { getInteractionUser } = require("../../handlers/funciones");
const { ApplicationCommandOptionType, PermissionFlagsBits } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "timeout",
    description: `⚔️ Sirve para enviar a la cárcel temporalmente :0`
}

module.exports = {
    ...command_data,
    aliases: ["mutear", "mute"],
    roles: [ROL.MOD, ROL.ADMIN],
    data: {
        ...command_data,
        options: [
            {
                ...OPTION.USER,
                required: true
            },
            {
                name: 'tiempo',
                description: 'Tiempo entero *en minutos* para enviar a la carcel (default: 10 min)',
                type: ApplicationCommandOptionType.Integer,
                required: false
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
        var tiempo = interaction.options.getInteger('tiempo') ?? 10;
        var razon = interaction.options.getString('razón');
        if (tiempo < 0)
            return interaction.reply({ content: `El tiempo no puede ser negativo`, ephemeral: true });
        try {
            var toMember = getInteractionUser(interaction, `Ehhh :\'<`, true, true);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        var respuesta;
        if (!toMember.roles.cache.has(ROL.MALTRATADOR)) {
            toMember.roles.add(ROL.MALTRATADOR).then(() =>
                setTimeout(() =>
                    toMember.roles.remove(ROL.MALTRATADOR),
                    (tiempo * 60 * 1000)
                )
            );
            respuesta = `${toMember} ha sido enviado a la cárcel durante **${tiempo} minutos**`;
            try {
                if (razon) await toMember.send(`${toMember} te han puesto un timeout de **${tiempo} minutos**. Razón: ${razon}`);
                else await toMember.send(`${toMember} te han puesto un timeout de **${tiempo} minutos**, revisa bien las **normas** :<. Ahora solo tendrás disponible la cárcel en este tiempo. Si crees que ha sido un malentendido, habla con los moderadores. Si el timeout no se te quita en ${tiempo} minutos pídelo en el canal de la cárcel :>`);
            } catch {
                console.log("No se puede enviar el mensaje al usuario expulsado");
            }
        } else {
            respuesta = `${toMember} ya está en la cárcel por timeout o ban`;
        }
        interaction.reply({ content: respuesta, ephemeral: true });
    }
}