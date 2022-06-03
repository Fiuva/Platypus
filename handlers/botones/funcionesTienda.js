const { PRECIO, NOMBRE_MONEDAS, ROL } = require('../../config/constantes');
const Usuario = require('../../models/usuario');

var onClickTienda = async function (button) {
    var id = button.customId.split('_');
    var idUser = button.user.id;
    var authorInteraction = await button.guild.members.fetch(idUser);
    var userInteraction = await Usuario.find({ idDiscord: idUser }).exec();
    var monedasUser = userInteraction[0].monedas;
    switch (id[1]) {
        case 'anillo':
            var anillosUser = userInteraction[0].anillo;
            if (anillosUser < 2 && monedasUser >= PRECIO.ANILLO) {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { anillo: anillosUser + 1, monedas: monedasUser - PRECIO.ANILLO }, { new: true });
                button.reply(`${authorInteraction.user} ha comprado un anillo`);
            } else if (anillosUser >= 2) {
                button.reply(`${authorInteraction.user} ya has tienes el máximo de anillos (2)`);
            } else {
                button.reply(`${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`);
            }
            break;
        case 'millonario':
            if (authorInteraction.roles.cache.has(ROL.MILLONARIO)) {
                button.reply(`${authorInteraction.user} ya tienes el rol de millonario`)
            } else if (monedasUser < PRECIO.MILLONARIO) {
                button.reply(`${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`)
            } else {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser - PRECIO.MILLONARIO }, { new: true });
                var rolMill = button.guild.roles.cache.get(ROL.MILLONARIO);
                authorInteraction.roles.add(rolMill);
                button.reply(`${authorInteraction.user} ahora es millonario!!!`);
            }
            break;
        case 'musica-pro':
            if (authorInteraction.roles.cache.has(ROL.MUSICA_PRO)) {
                button.reply(`${authorInteraction.user} ya tienes el rol de música`)
            } else if (monedasUser < PRECIO.MUSICA_PRO) {
                button.reply(`${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`)
            } else {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser - PRECIO.MUSICA_PRO }, { new: true });
                var rolMus = button.guild.roles.cache.get(ROL.MUSICA_PRO);
                authorInteraction.roles.add(rolMus);
                button.reply(`${authorInteraction.user} ahora puedes usar comandos especiales en el canal de musica :)`);
            }
            break;
    }
}

module.exports = { onClickTienda };