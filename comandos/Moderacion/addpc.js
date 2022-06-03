const { ROL, NOMBRE_MONEDAS } = require("../../config/constantes");
const { msg } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "addpc",
    aliases: ["addplatycoins"],
    roles: [ROL.ADMIN],
    descripcion: "Sirve para añadir platycoins a alguien",
    run: async (client, message, args) => {
        message.delete();
        const toUser = message.mentions.members.first();
        if (toUser) {
            const user = await Usuario.find({ idDiscord: toUser.id }).exec();
            const monedasAntes = user[0].monedas;
            const numToAdd = parseInt(msg(message, 2, 3));
            if (!isNaN(numToAdd)) {
                Usuario.findOneAndUpdate({ idDiscord: user[0].idDiscord }, { monedas: monedasAntes + numToAdd }, { new: true })
                    .then(
                        message.channel.send(
                            `${message.author}: Se han añadido ${numToAdd} ${NOMBRE_MONEDAS} a ${toUser} (Antes: ${monedasAntes} -> __Ahora: ${monedasAntes + numToAdd}__) | _Razón:_ **${msg(message, 3, 20, true) || 'Porque sí xd'}**`
                        )
                    );
            } else {
                message.channel.send(`${message.author}: añadir ${NOMBRE_MONEDAS} !addpc <@user> <${NOMBRE_MONEDAS}> [razón]`);
            }
        } else {
            message.channel.send(`${message.author}: añadir ${NOMBRE_MONEDAS} !addpc <@user> <${NOMBRE_MONEDAS}> [razón]`);
        }
    }
}