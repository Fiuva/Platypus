const { ROL } = require("../../config/constantes");

module.exports = {
    name: "ping",
    aliases: ["latencia", "ms"],
    roles: [ROL.ADMIN, ROL.MOD],
    descripcion: "Sirve para ver la latencia del platypus",
    run: async (client, message, args) => {
        message.reply(`El ping del Platypus es de ${client.ws.ping}ms`);
    }
}