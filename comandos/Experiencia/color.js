const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const Usuario = require("../../models/usuario");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "color",
    description: "🔧 Cambia el color de tu perfil"
}

module.exports = {
    ...command_data,
    aliases: [],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: `opciones`,
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    { ...OPTION.COLOR.OPTS, required: true }
                ]
            },
            {
                name: 'custom',
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    { ...OPTION.COLOR.CUSTOM, required: true }
                ]
            }
        ]
    },
    run: async (client, interaction) => {
        let color = interaction.options.getString('color')


        if (!color.startsWith('#') || color.length != 7) {
            interaction.reply({ content: `Escribe el código de color de esta forma -> "#FFFFFF" o elige el otro comando para elegir entre opciones`, ephemeral: true });
            return;
        }
        await Usuario.findOneAndUpdate({ idDiscord: interaction.user.id }, { color: color });
        interaction.reply(`Se ha modificado su color de !rank correctamente`);
    }
}