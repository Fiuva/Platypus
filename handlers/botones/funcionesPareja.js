const { PRECIO } = require("../../config/constantes");
const { MascotasData } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");

var onClickPareja = async function (button) {
    var id = button.customId.split('_');
    switch (id[1]) {
        case 'casar':
            if (button.user.id == id[2]) {
                try {
                    var user = await Usuario.find({ idDiscord: id[3] }).exec();
                    var toUser = await Usuario.find({ idDiscord: id[2] }).exec();
                    button.channel.send(`${await button.guild.members.fetch(id[3])} se ha casado con ${button.user}!!!`)
                    button.message.delete();
                    date = new Date();
                    var dia = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                    await Usuario.findOneAndUpdate({ idDiscord: id[3] }, { parejaId: id[2], anillo: user[0].anillo - 1, fechaPareja: dia }, { new: true });
                    await Usuario.findOneAndUpdate({ idDiscord: id[2] }, { parejaId: id[3], anillo: toUser[0].anillo + 1, fechaPareja: dia }, { new: true });
                } catch {
                    button.reply("Error al casarse :<");
                }
            } else {
                button.deferUpdate();
            }
            break;
        case 'rechazar':
            if (button.user.id == id[2]) {
                button.channel.send(`${await button.guild.members.fetch(id[3])} ha sido rechezad@ por ${button.user}`)
                button.message.delete();
            } else {
                button.deferUpdate();
            }
            break;
        case 'divorciar-si':
            if (button.user.id == id[2]) {
                var user = (await Usuario.find({ idDiscord: button.user.id }))[0];
                button.channel.send(`${button.user} ha decidido dejar la relación con ${await button.guild.members.fetch(user.parejaId)}`);
                try { //Quitar mascotas
                    let userMascotas = (await MascotasData.find({ idDiscord: user.idDiscord }))[0];
                    try { await button.guild.members.fetch(user.idDiscord).roles.remove(userMascotas.refRolMascotaP) } catch { };
                    await button.guild.members.fetch(user.parejaId).roles.remove(userMascotas.refRolMascota);
                } catch { }
                await Usuario.findOneAndUpdate({ idDiscord: user.parejaId }, { parejaId: '0', fechaPareja: '0' }, { new: true });
                Usuario.findOneAndUpdate({ idDiscord: button.user.id }, { parejaId: '0', monedas: user.monedas - PRECIO.DIVORCIO, fechaPareja: '0' }, { new: true }).then(button.message.delete());
            } else {
                button.deferUpdate();
            }
            break;
        case 'divorciar-no':
            if (button.user.id == id[2]) {
                button.channel.send(`${button.user} ha cancelado el divorcio`);
                button.message.delete();
            } else {
                button.deferUpdate();
            }
            break;
        default:
            break;
    }
}

module.exports = { onClickPareja };