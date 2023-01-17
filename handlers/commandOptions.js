const { ApplicationCommandOptionType } = require("../node_modules/discord-api-types/v10");

const OPTION = {
    USER: {
        name: `usuario`,
        description: 'Menciona a un usuario',
        type: ApplicationCommandOptionType.User,
        required: false
    },
    COLOR: {
        OPTS: {
            name: `color`,
            description: `Elige el color deseado :>`,
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                { name: '🟦Azul', value: '#3434D6' },
                { name: '🟥Rojo', value: '#DE3232' },
                { name: '🟨Amarillo', value: '#DBEC21' },
                { name: '🟪Morado', value: '#9A21EC' },
                { name: '⬜Blanco', value: '#FFFFFF' },
                { name: '🟩Verde', value: '#5CDE45' },
                { name: '🟧Naranja', value: '#E9791E' },
                { name: '🟫Marrón', value: '#8A5326' },
                { name: 'Default', value: '#7289da' }
            ]
        },
        CUSTOM: {
            name: `color`,
            description: `Ejemplo: #7B17DC`,
            type: ApplicationCommandOptionType.String,
            required: false
        }
    }
}

module.exports = {
    OPTION
}
