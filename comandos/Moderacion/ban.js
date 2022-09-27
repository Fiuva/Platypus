const { ROL } = require("../../config/constantes");

module.exports = {
    name: "ban",
    aliases: ["banear", "carcel"],
    roles: [ROL.MOD, ROL.ADMIN],
    description: "Sirve para banear a gente :>>>",
    run: async (client, message, args) => {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(ROL.MALTRATADOR)) {
                toUser.roles.add(ROL.MALTRATADOR);
                message.channel.send(`${toUser} ha sido enviado a la cárcel permanentemente`);
                try {
                    await toUser.send(`${toUser} has sido **baneado** de el server de **Fiuva**, ahora solo tendrás disponible la cárcel y poco más, si te sientes arrepentido/a o crees que ha podido ser un error, puedes hablar con los **moderadores** sobre tu situación y se intentará **solucionar**, es importante hacer caso a las **normas** :>`);
                } catch {
                    console.log("No se puede enviar el mensaje al usuario baneado");
                }
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        } else {
            message.channel.send(`${message.author} tienes que mencionar a quien quieres banear`)
        }
    }
}