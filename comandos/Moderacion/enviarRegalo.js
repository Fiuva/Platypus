const { ROL } = require("../../config/constantes");
const { createRegaloRandom } = require("../../handlers/funciones");


module.exports = {
    name: "regalo",
    roles: [ROL.ADMIN],
    description: "Cosas de pruebas",
    run: async (client, message, args) => {
        const [embed, components] = createRegaloRandom();
        message.channel.send({ embeds: [embed], components: [components] });
    }
}