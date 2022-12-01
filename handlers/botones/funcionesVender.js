const { PRECIO, MONEDAS, ROL } = require('../../config/constantes');
const Usuario = require('../../models/usuario');
const { calcularPrecioVenta } = require('../funciones');

var onClickVender = async function (button) {
    var id = button.customId.split('_');
    var idUser = button.user.id;
    var authorInteraction = await button.guild.members.fetch(idUser);
    var userInteraction = await Usuario.find({ idDiscord: idUser }).exec();
    var monedasUser = userInteraction[0].monedas;
    switch (id[1]) {
        case 'anillo':
            const anillosUser = userInteraction[0].anillo;
            if (userInteraction[0].anillo > 0) {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { anillo: anillosUser - 1, monedas: monedasUser + calcularPrecioVenta(PRECIO.ANILLO) }, { new: true });
                button.reply(`${authorInteraction.user} has ganado ${calcularPrecioVenta(PRECIO.ANILLO)} ${MONEDAS.PC.NOMBRE} vendiendo un anillo`);
            } else {
                button.reply(`${authorInteraction.user} no tienes anillos para vender`)
            }
            break;
        case 'musica-pro':
            if (authorInteraction.roles.cache.has(ROL.MUSICA_PRO)) {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser + calcularPrecioVenta(PRECIO.MUSICA_PRO) }, { new: true });
                const rolMus = button.guild.roles.cache.get(ROL.MUSICA_PRO);
                authorInteraction.roles.remove(rolMus);
                button.reply(`${authorInteraction.user} has ganado ${calcularPrecioVenta(PRECIO.MUSICA_PRO)} ${MONEDAS.PC.NOMBRE} vendiendo el rol de música`);
            } else {
                button.reply(`${authorInteraction.user} no tienes el rol de música`)
            }
            break;
        case 'millonario':
            if (authorInteraction.roles.cache.has(ROL.MILLONARIO)) {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser + calcularPrecioVenta(PRECIO.MILLONARIO) }, { new: true });
                const rolMill = button.guild.roles.cache.get(ROL.MILLONARIO);
                authorInteraction.roles.remove(rolMill);
                button.reply(`${authorInteraction.user} has ganado ${calcularPrecioVenta(PRECIO.MILLONARIO)} ${MONEDAS.PC.NOMBRE} vendiendo tu rol de millonario`);
            } else {
                button.reply(`${authorInteraction.user} no tienes el rol de millonario`)
            }
            break;
    }
}

module.exports = { onClickVender };