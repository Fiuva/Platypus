const { varOnUpdateMessageEspia } = require("../../config/constantes");
const { parseMensajeEspia, bbddVictimas } = require("../../handlers/funcionesVictimas");
const Canvas = require('canvas');
const { AttachmentBuilder } = require("discord.js");


module.exports = async (client, oldUser, newUser) => {
    if (varOnUpdateMessageEspia.update != 'Off') {
        bbddVictimas.setArray(parseMensajeEspia(varOnUpdateMessageEspia.update));
        varOnUpdateMessageEspia.setUpdate('Off');
    }

    if (bbddVictimas.arrayVictimas.map(v => v.id).includes(newUser.id)) {
        let victima = bbddVictimas.arrayVictimas.filter(v => v.id == newUser.id)[0];
        if (!victima.nombre.startsWith('//'))
            espiarAvatarUsuario(newUser);
    }
}

async function espiarAvatarUsuario(newUser) {
    let detective = client.users.cache.get('431071887372845061');
    const canvas = Canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d')
    let image = await Canvas.loadImage(newUser.displayAvatarURL({ extension: 'jpg', size: 4096 }));
    ctx.drawImage(image, 0, 0, 1080, 1080);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), 'fotodeperfil.png');

    detective.send({ content: `${newUser.username} se cambió de foto de perfil:`, files: [attachment] })
}