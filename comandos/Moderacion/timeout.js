const { ROL } = require("../../config/constantes");
const { msg } = require("../../handlers/funciones");

module.exports = {
    name: "timeout",
    aliases: ["mutear", "mute"],
    roles: [ROL.MOD, ROL.ADMIN],
    description: "Sirve para dar timeout a gente :0",
    run: async (client, message, args) => {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(ROL.MALTRATADOR)) {
                var tiempo = 10;
                if (msg(message, 2, 3)) {
                    let n = Number(msg(message, 2, 3));
                    if (n) tiempo = n;
                }
                toUser.roles.add(ROL.MALTRATADOR).then(() => {
                    setTimeout(function () {
                        toUser.roles.remove(ROL.MALTRATADOR);
                    }, (tiempo * 60 * 1000));
                });
                message.channel.send(`${toUser} ha sido enviado a la cárcel durante ${tiempo} minutos`);
                try {
                    await toUser.send(`${toUser} te han puesto un timeout de ${tiempo} minutos, revisa bien las **normas** :<. Ahora solo tendrás disponible la cárcel en este tiempo. Si crees que ha sido un malentendido, habla con los moderadores. Si el timeout no se te quita en ${tiempo} minutos pídelo en el canal de la cárcel :>`);
                } catch {
                    console.log("No se puede enviar el mensaje al usuario expulsado");
                }
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        } else {
            message.channel.send(`${message.author} tienes que mencionar a quien quieres dar timeout`)
        }
    }
}