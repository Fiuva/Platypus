const disbut = require('discord-buttons');
var cambiarTurno = function(button, b00, b01, b02, b10, b11, b12, b20, b21, b22, content) {
    var id = button.id.split('_');
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
    b00 = b00.setID(b00.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b01 = b01.setID(b01.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b02 = b02.setID(b02.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b10 = b10.setID(b10.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b11 = b11.setID(b11.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b12 = b12.setID(b12.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b20 = b20.setID(b20.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b21 = b21.setID(b21.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    }))
    t = 0;
    b22 = b22.setID(b22.custom_id.replace(reg, function (match) {
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
    var p00 = b00.custom_id.slice(-1);
    var p01 = b01.custom_id.slice(-1);
    var p02 = b02.custom_id.slice(-1);
    var p10 = b10.custom_id.slice(-1);
    var p11 = b11.custom_id.slice(-1);
    var p12 = b12.custom_id.slice(-1);
    var p20 = b20.custom_id.slice(-1);
    var p21 = b21.custom_id.slice(-1);
    var p22 = b22.custom_id.slice(-1);
    if (p00 != '0') {
        if (p00 == p01 && p01 == p02) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        } else if (p00 == p10 && p10 == p20) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        } else if (p00 == p11 && p11 == p22) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        }
    }
    if (p11 != '0') {
        if (p11 == p10 && p10 == p12) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        } else if (p11 == p01 && p01 == p21) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        }
    }
    if (p20 != '0') {
        if (p20 == p21 && p21 == p22) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        } else if (p20 == p11 && p11 == p02) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        }
    }
    if (p22 != '0') {
        if (p22 == p12 && p12 == p02) {
            content = `${button.clicker.user} ha ganado!!`;
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        }
    }
    if (p01 != '0' && p02 != '0' && p10 != '0' && p12 != '0' && p21 != '0' && p22 != '0' && p20 != '0' && p00 != '0' && p11 != '0') {
        content = `La partida estuvo intensa, pero resultó en un empate`;
        editButtons3enRaya('3', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
    }
    return content;
}
function editButtons3enRaya(id1, button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo) {
    var label, style;
    if (tipo == 1) {
        label = 'O';
        style = 'green';
    } else if (tipo == 2) {
        label = 'X';
        style = 'red';
    } else if (tipo == 3) {
        label = 'win';
        style = 'blurple';
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
            b00 = b00.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '01':
            if (label != 'win') b01 = b01.setLabel(label);
            b01 = b01.setStyle(style);
            b01 = b01.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '02':
            if (label != 'win') b02 = b02.setLabel(label);
            b02 = b02.setStyle(style);
            b02 = b02.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '10':
            if (label != 'win') b10 = b10.setLabel(label);
            b10 = b10.setStyle(style);
            b10 = b10.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '11':
            if (label != 'win') b11 = b11.setLabel(label);
            b11 = b11.setStyle(style);
            b11 = b11.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '12':
            if (label != 'win') b12 = b12.setLabel(label);
            b12 = b12.setStyle(style);
            b12 = b12.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '20':
            if (label != 'win') b20 = b20.setLabel(label);
            b20 = b20.setStyle(style);
            b20 = b20.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '21':
            if (label != 'win') b21 = b21.setLabel(label);
            b21 = b21.setStyle(style);
            b21 = b21.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
        case '22':
            if (label != 'win') b22 = b22.setLabel(label);
            b22 = b22.setStyle(style);
            b22 = b22.setID(`${button.id.slice(0, -2)}_${tipo}`)
            break;
    }
}
var tresEnRaya = function (button) {
    if (button.id.startsWith('3enRaya')) {
        var b00 = button.message.components[0].components[0];
        var b01 = button.message.components[0].components[1];
        var b02 = button.message.components[0].components[2];
        var b10 = button.message.components[1].components[0];
        var b11 = button.message.components[1].components[1];
        var b12 = button.message.components[1].components[2];
        var b20 = button.message.components[2].components[0];
        var b21 = button.message.components[2].components[1];
        var b22 = button.message.components[2].components[2];
        var id = button.id.split('_');
        var tipo = button.clicker.id == id[2] ? 1 : 2;
        var content;
        if (id[5] == '0' && id[4] == button.clicker.id) {
            editButtons3enRaya(id[1], button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo)
            content = cambiarTurno(button, b00, b01, b02, b10, b11, b12, b20, b21, b22, content);
            content = comprobarSiWin(button, content);
            const aRow = new disbut.MessageActionRow()
                .addComponents(b00, b01, b02)
            const bRow = new disbut.MessageActionRow()
                .addComponents(b10, b11, b12)
            const cRow = new disbut.MessageActionRow()
                .addComponents(b20, b21, b22)
            button.reply.defer().catch(e => null);
            button.message.edit({
                content: content,
                components: [aRow, bRow, cRow]
            })
        } else {
            button.reply.defer().catch(e => null);
        }
    }
}
var tres = function (message) {
    if (message.mentions.users.first() == undefined || message.mentions.users.first() == message.author || message.mentions.users.first().bot) return message.channel.send(`${message.author} mensciona con quien quieres jugar`);
    const a = Math.random() * 2 << 0
    const turno3enRayaID = [message.author.id, message.mentions.users.first().id][a]
    var b00 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_00_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b01 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_01_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b02 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_02_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b10 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_10_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b11 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_11_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b12 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_12_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b20 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_20_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b21 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_21_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var b22 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`3enRaya_22_${message.author.id}_${message.mentions.users.first().id}_${turno3enRayaID}_0`)
        .setStyle('gray')
    var aRow = new disbut.MessageActionRow()
        .addComponents(b00, b01, b02)
    var bRow = new disbut.MessageActionRow()
        .addComponents(b10, b11, b12)
    var cRow = new disbut.MessageActionRow()
        .addComponents(b20, b21, b22)
    message.channel.send(`Empieza ${message.guild.members.cache.get(turno3enRayaID)}`, {
        components: [aRow, bRow, cRow]
    })
}

module.exports = { tresEnRaya, tres };