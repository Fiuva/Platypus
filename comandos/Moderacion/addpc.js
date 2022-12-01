const { ROL, MONEDAS } = require("../../config/constantes");
const { msg, modificarMonedas, findOrCreateDocument } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "addpc",
    aliases: ["addplatycoins"],
    roles: [ROL.ADMIN],
    description: "Sirve para añadir platycoins a alguien",
    run: async (client, message, args) => {
        message.delete();
        const toUser = message.mentions.members.first();
        if (toUser) {
            const user = await findOrCreateDocument(toUser.id, Usuario);
            const monedasAntes = user.monedas;
            const numToAdd = parseInt(msg(message, 2, 3));
            if (!isNaN(numToAdd)) {
                modificarMonedas(toUser.id, numToAdd, user)
                    .then(
                        message.channel.send(
                            `${message.author}: Se han añadido ${numToAdd} ${MONEDAS.PC.NOMBRE} a ${toUser} (Antes: ${monedasAntes} -> __Ahora: ${monedasAntes + numToAdd}__) | _Razón:_ **${msg(message, 3, 20, true) || 'Porque sí xd'}**`
                        )
                    );
            } else {
                message.channel.send(`${message.author}: añadir ${MONEDAS.PC.NOMBRE} !addpc <@user> <${MONEDAS.PC.NOMBRE}> [razón]`);
            }
        } else {
            message.channel.send(`${message.author}: añadir ${MONEDAS.PC.NOMBRE} !addpc <@user> <${MONEDAS.PC.NOMBRE}> [razón]`);
        }
    }
}