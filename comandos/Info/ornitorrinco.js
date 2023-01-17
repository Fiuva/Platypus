const { ROL } = require("../../config/constantes");

const command_data = {
    name: "ornitorrinco",
    description: `❓ Te enviaré un saludo por MD`
}

module.exports = {
    ...command_data,
    roles: [ROL.ADMIN, ROL.MOD],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        try {
            await interaction.user.send('Hola humano/a :>')
            interaction.reply({ content: 'Ya te envié un mensaje :>', ephemeral: true })
        } catch (e) {
            interaction.reply({ content: 'No tienes los MDs activados o me has bloqueado :<', ephemeral: true })
        }
    }
}
