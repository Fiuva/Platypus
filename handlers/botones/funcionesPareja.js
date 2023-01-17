const { PRECIO } = require("../../config/constantes");
const { MascotasData } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");
const { findOrCreateDocument } = require("../funciones");

var onClickPareja = async function (button) {
    var id = button.customId.split('_');
    switch (id[1]) {
        case 'casar':
            if (button.user.id == id[2]) {
                try {
                    var user = await findOrCreateDocument(id[3], Usuario);
                    var toUser = await findOrCreateDocument(id[2], Usuario);
                    button.update({ content: `${await button.guild.members.fetch(id[3])} se ha casado con ${button.user}!!! 🥳`, components: [], embeds: [] });
                    date = new Date();
                    var dia = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                    await Usuario.findOneAndUpdate({ idDiscord: id[3] }, { parejaId: id[2], anillo: user.anillo - 1, fechaPareja: dia });
                    await Usuario.findOneAndUpdate({ idDiscord: id[2] }, { parejaId: id[3], anillo: toUser.anillo + 1, fechaPareja: dia });
                } catch {
                    button.reply("Error al casarse :<");
                }
            } else {
                button.deferUpdate();
            }
            break;
        case 'rechazar':
            if (button.user.id == id[2]) {
                button.update({ content: `${await button.guild.members.fetch(id[3])} ha sido rechezad@ por ${button.user}`, components: [], embeds: [] })
            } else {
                button.deferUpdate();
            }
            break;
        case 'divorciar-si':
            if (button.user.id == id[2]) {
                var user = await findOrCreateDocument(button.user.id, Usuario);
                try { //Quitar mascotas
                    let userMascotas = await findOrCreateDocument(user.idDiscord, MascotasData);
                    try { await button.guild.members.fetch(user.idDiscord).roles.remove(userMascotas.refRolMascotaP) } catch { };
                    await button.guild.members.fetch(user.parejaId).roles.remove(userMascotas.refRolMascota);
                } catch { }
                try {
                    var pareja = await button.guild.members.fetch(user.parejaId);
                } catch {
                    var pareja = null;
                }
                await Usuario.findOneAndUpdate({ idDiscord: user.parejaId }, { parejaId: '0', fechaPareja: '0' });
                Usuario.findOneAndUpdate(
                    { idDiscord: button.user.id },
                    { parejaId: '0', monedas: user.monedas - PRECIO.DIVORCIO, fechaPareja: '0' }
                ).then(() => button.update({
                    content: `${button.user} ha decidido dejar la relación con ${pareja?.user ?? '\`pareja perdida\`'}`,
                    components: [],
                    embeds: []
                }));
            } else {
                button.deferUpdate();
            }
            break;
        case 'divorciar-no':
            if (button.user.id == id[2]) {
                button.update({ content: `${button.user} ha cancelado el divorcio`, components: [], embeds: [] });
            } else {
                button.deferUpdate();
            }
            break;
        default:
            break;
    }
}

module.exports = { onClickPareja };