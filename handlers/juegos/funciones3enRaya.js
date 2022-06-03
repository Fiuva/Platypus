const { MessageActionRow, MessageButton } = require('discord.js');

var cambiarTurno = function (button, b00, b01, b02, b10, b11, b12, b20, b21, b22, content) {
    var id = button.customId.split('_');
    var idCambio;
    if (id[4] == id[2]) {
        idCambio = id[3];
        content = `Turno de ${button.message.guild.members.cache.get(id[3])}`
    } else {
        idCambio = id[2];
        content = `Turno de ${button.message.guild.members.cache.get(id[2])}`
    }
    var reg = new RegExp(id[4], 'g')
    var t = 0;
    b00 = b00.setCustomId(b00.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b01 = b01.setCustomId(b01.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b02 = b02.setCustomId(b02.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b10 = b10.setCustomId(b10.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b11 = b11.setCustomId(b11.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b12 = b12.setCustomId(b12.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b20 = b20.setCustomId(b20.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b21 = b21.setCustomId(b21.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b22 = b22.setCustomId(b22.customId.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    return content;
}
var comprobarSiWin = function(button, content) {
    var b00 = button.message.components[0].components[0]
    var b01 = button.message.components[0].components[1]
    var b02 = button.message.components[0].components[2]
    var b10 = button.message.components[1].components[0]
    var b11 = button.message.components[1].components[1]
    var b12 = button.message.components[1].components[2]
    var b20 = button.message.components[2].components[0]
    var b21 = button.message.components[2].components[1]
    var b22 = button.message.components[2].components[2]
    var p00 = b00.customId.slice(-1);
    var p01 = b01.customId.slice(-1);
    var p02 = b02.customId.slice(-1);
    var p10 = b10.customId.slice(-1);
    var p11 = b11.customId.slice(-1);
    var p12 = b12.customId.slice(-1);
    var p20 = b20.customId.slice(-1);
    var p21 = b21.customId.slice(-1);
    var p22 = b22.customId.slice(-1);
    if (p00 != '0') {
        if (p00 == p01 && p01 == p02) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        } else if (p00 == p10 && p10 == p20) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        } else if (p00 == p11 && p11 == p22) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        }
    }
    if (p11 != '0') {
        if (p11 == p10 && p10 == p12) {
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        } else if (p11 == p01 && p01 == p21) {
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        }
    }
    if (p20 != '0') {
        if (p20 == p21 && p21 == p22) {
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        } else if (p20 == p11 && p11 == p02) {
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        }
    }
    if (p22 != '0') {
        if (p22 == p12 && p12 == p02) {
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return `${button.user} ha ganado!!`;
        }
    }
    if (p01 != '0' && p02 != '0' && p10 != '0' && p12 != '0' && p21 != '0' && p22 != '0' && p20 != '0' && p00 != '0' && p11 != '0') {
        editButtons3enRaya('3', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        return `Tremendo empate`;
    }
    return content
}
function editButtons3enRaya(id1, button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo) {
    var label, style;
    if (tipo == 1) {
        label = 'O';
        style = 'SUCCESS';
    } else if (tipo == 2) {
        label = 'X';
        style = 'DANGER';
    } else if (tipo == 3) {
        label = 'win';
        style = 'PRIMARY';
        b00.setDisabled(true);
        b01.setDisabled(true);
        b02.setDisabled(true);
        b10.setDisabled(true);
        b11.setDisabled(true);
        b12.setDisabled(true);
        b20.setDisabled(true);
        b21.setDisabled(true);
        b22.setDisabled(true);
    }
    switch (id1) {
        case '00':
            if (label != 'win') b00 = b00.setLabel(label);
            b00 = b00.setStyle(style);
            b00 = b00.setCustomId(`3enRaya_00_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '01':
            if (label != 'win') b01 = b01.setLabel(label);
            b01 = b01.setStyle(style);
            b01 = b01.setCustomId(`3enRaya_01_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '02':
            if (label != 'win') b02 = b02.setLabel(label);
            b02 = b02.setStyle(style);
            b02 = b02.setCustomId(`3enRaya_02_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '10':
            if (label != 'win') b10 = b10.setLabel(label);
            b10 = b10.setStyle(style);
            b10 = b10.setCustomId(`3enRaya_10_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '11':
            if (label != 'win') b11 = b11.setLabel(label);
            b11 = b11.setStyle(style);
            b11 = b11.setCustomId(`3enRaya_11_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '12':
            if (label != 'win') b12 = b12.setLabel(label);
            b12 = b12.setStyle(style);
            b12 = b12.setCustomId(`3enRaya_12_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '20':
            if (label != 'win') b20 = b20.setLabel(label);
            b20 = b20.setStyle(style);
            b20 = b20.setCustomId(`3enRaya_20_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '21':
            if (label != 'win') b21 = b21.setLabel(label);
            b21 = b21.setStyle(style);
            b21 = b21.setCustomId(`3enRaya_21_${button.customId.slice(11, -2)}_${tipo}`)
            break;
        case '22':
            if (label != 'win') b22 = b22.setLabel(label);
            b22 = b22.setStyle(style);
            b22 = b22.setCustomId(`3enRaya_22_${button.customId.slice(11, -2)}_${tipo}`)
            break;
    }
}
var tresEnRaya = function (button) {
    var b00 = button.message.components[0].components[0];
    var b01 = button.message.components[0].components[1];
    var b02 = button.message.components[0].components[2];
    var b10 = button.message.components[1].components[0];
    var b11 = button.message.components[1].components[1];
    var b12 = button.message.components[1].components[2];
    var b20 = button.message.components[2].components[0];
    var b21 = button.message.components[2].components[1];
    var b22 = button.message.components[2].components[2];
    var id = button.customId.split('_');
    var tipo = button.user.id == id[2] ? 1 : 2;
    var content;
    if (id[5] == '0' && id[4] == button.user.id) {
        editButtons3enRaya(id[1], button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo)
        content = cambiarTurno(button, b00, b01, b02, b10, b11, b12, b20, b21, b22, content);
        content = comprobarSiWin(button, content);
        const aRow = new MessageActionRow()
            .addComponents(b00, b01, b02)
        const bRow = new MessageActionRow()
            .addComponents(b10, b11, b12)
        const cRow = new MessageActionRow()
            .addComponents(b20, b21, b22)
        button.deferUpdate().catch(e => null);
        button.message.edit({
            content: content,
            components: [aRow, bRow, cRow]
        })

    } else {
        button.deferUpdate().catch(e => null);
    }
}
var tres = async function (message) {
    if (message.mentions.users.first() == undefined || message.mentions.users.first() == message.author || message.mentions.users.first().bot) return message.channel.send(`${message.author} mensciona con quien quieres jugar`);
    const a = Math.random() * 2 << 0
    const turno3enRayaID = [message.author.id, message.mentions.users.first().id][a]
    var b00 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_00_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b01 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_01_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b02 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_02_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b10 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_10_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b11 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_11_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b12 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_12_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b20 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_20_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b21 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_21_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var b22 = new MessageButton()
        .setLabel(' ')
        .setCustomId(`3enRaya_22_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('SECONDARY')
    var aRow = new MessageActionRow()
        .addComponents(b00, b01, b02)
    var bRow = new MessageActionRow()
        .addComponents(b10, b11, b12)
    var cRow = new MessageActionRow()
        .addComponents(b20, b21, b22)
    await message.channel.send({
        content: `Empieza ${message.guild.members.cache.get(turno3enRayaID)}`,
        components: [aRow, bRow, cRow]
    })
}

module.exports = { tresEnRaya, tres };