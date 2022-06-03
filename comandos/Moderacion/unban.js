const { ROL } = require("../../config/constantes");

module.exports = {
    name: "unban",
    aliases: ["unbanear", "desbanear", "untimeout", "unmute"],
    roles: [ROL.MOD, ROL.ADMIN],
    descripcion: "Sirve para desbanear a gente :>>>",
    run: async (client, message, args) => {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (toUser.roles.cache.has(ROL.MALTRATADOR)) {
                toUser.roles.remove(ROL.MALTRATADOR);
                message.channel.send(`${toUser} ha sido liberad@`);
            } else {
                message.channel.send(`${toUser} no está en la carcel`);
            }
        } else {
            message.channel.send(`${message.author} tienes que mencionar a quien quieres banear`)
        }
    }
}