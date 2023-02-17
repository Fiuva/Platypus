const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getInteractionUser } = require('../funciones');

var cambiarTurno = function (button, b00, b01, b02, b10, b11, b12, b20, b21, b22) {
    var id = button.customId.split('_');
    var idCambio;
    var content;
    if (id[4] == id[2]) {
        idCambio = id[3];
        content = `Turno de ${button.message.guild.members.cache.get(id[3])}`
    } else {
        idCambio = id[2];
        content = `Turno de ${button.message.guild.members.cache.get(id[2])}`
    }
    var reg = new RegExp(id[4], 'g')
    var t = 0;
    b00.data.custom_id = b00.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b01.data.custom_id = b01.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b02.data.custom_id = b02.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b10.data.custom_id = b10.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b11.data.custom_id = b11.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b12.data.custom_id = b12.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b20.data.custom_id = b20.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b21.data.custom_id = b21.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    t = 0;
    b22.data.custom_id = b22.data.custom_id.replace(reg, function (match) {
        t++;
        return (t === 2) ? idCambio : match
    })
    return content;
}
var comprobarSiWin = function (button, content) {
    var b00 = button.message.components[0].components[0]
    var b01 = button.message.components[0].components[1]
    var b02 = button.message.components[0].components[2]
    var b10 = button.message.components[1].components[0]
    var b11 = button.message.components[1].components[1]
    var b12 = button.message.components[1].components[2]
    var b20 = button.message.components[2].components[0]
    var b21 = button.message.components[2].components[1]
    var b22 = button.message.components[2].components[2]
    var p00 = b00.data.custom_id.slice(-1);
    var p01 = b01.data.custom_id.slice(-1);
    var p02 = b02.data.custom_id.slice(-1);
    var p10 = b10.data.custom_id.slice(-1);
    var p11 = b11.data.custom_id.slice(-1);
    var p12 = b12.data.custom_id.slice(-1);
    var p20 = b20.data.custom_id.slice(-1);
    var p21 = b21.data.custom_id.slice(-1);
    var p22 = b22.data.custom_id.slice(-1);
    let embed = new EmbedBuilder(button.message.embeds[0]);
    if (p00 != '0') {
        if (p00 == p01 && p01 == p02) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado()
        } else if (p00 == p10 && p10 == p20) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        } else if (p00 == p11 && p11 == p22) {
            editButtons3enRaya('00', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        }
    }
    if (p11 != '0') {
        if (p11 == p10 && p10 == p12) {
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('10', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        } else if (p11 == p01 && p01 == p21) {
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('01', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        }
    }
    if (p20 != '0') {
        if (p20 == p21 && p21 == p22) {
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('21', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        } else if (p20 == p11 && p11 == p02) {
            editButtons3enRaya('20', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('11', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        }
    }
    if (p22 != '0') {
        if (p22 == p12 && p12 == p02) {
            editButtons3enRaya('22', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('12', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            editButtons3enRaya('02', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
            return haGanado();
        }
    }
    if (p01 != '0' && p02 != '0' && p10 != '0' && p12 != '0' && p21 != '0' && p22 != '0' && p20 != '0' && p00 != '0' && p11 != '0') {
        editButtons3enRaya('3', button, b00, b01, b02, b10, b11, b12, b20, b21, b22, 3)
        embed.setTitle(`Empate :<`);
        embed.setColor("#C1E736");
    }
    return { embed, content }

    function haGanado() {
        embed.setTitle(`${button.user.username} ha ganado!!`);
        embed.setColor("#30A6EF")
        content = 'Fin de la partida'
        return { embed, content }
    }
}

function editButtons3enRaya(id1, button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo) {
    var label, style;
    if (tipo == 1) {
        label = 'O';
        style = ButtonStyle.Success;
    } else if (tipo == 2) {
        label = 'X';
        style = ButtonStyle.Danger;
    } else if (tipo == 3) {
        label = 'win';
        style = ButtonStyle.Primary;
        b00.data.disabled = true;
        b01.data.disabled = true;
        b02.data.disabled = true;
        b10.data.disabled = true;
        b11.data.disabled = true;
        b12.data.disabled = true;
        b20.data.disabled = true;
        b21.data.disabled = true;
        b22.data.disabled = true;
    }
    switch (id1) {
        case '00':
            if (label != 'win') b00.data.label = label;
            b00.data.style = style;
            b00.data.custom_id = `3enRaya_00_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '01':
            if (label != 'win') b01.data.label = label;
            b01.data.style = style;
            b01.data.custom_id = `3enRaya_01_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '02':
            if (label != 'win') b02.data.label = label;
            b02.data.style = style;
            b02.data.custom_id = `3enRaya_02_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '10':
            if (label != 'win') b10.data.label = label;
            b10.data.style = style;
            b10.data.custom_id = `3enRaya_10_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '11':
            if (label != 'win') b11.data.label = label;
            b11.data.style = style;
            b11.data.custom_id = `3enRaya_11_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '12':
            if (label != 'win') b12.data.label = label;
            b12.data.style = style;
            b12.data.custom_id = `3enRaya_12_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '20':
            if (label != 'win') b20.data.label = label;
            b20.data.style = style;
            b20.data.custom_id = `3enRaya_20_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '21':
            if (label != 'win') b21.data.label = label;
            b21.data.style = style;
            b21.data.custom_id = `3enRaya_21_${button.customId.slice(11, -2)}_${tipo}`;
            break;
        case '22':
            if (label != 'win') b22.data.label = label;
            b22.data.style = style;
            b22.data.custom_id = `3enRaya_22_${button.customId.slice(11, -2)}_${tipo}`;
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
    if (id[5] == '0' && id[4] == button.user.id) {
        editButtons3enRaya(id[1], button, b00, b01, b02, b10, b11, b12, b20, b21, b22, tipo)
        var content = cambiarTurno(button, b00, b01, b02, b10, b11, b12, b20, b21, b22);
        var embedAndContent = comprobarSiWin(button, content);
        const aRow = new ActionRowBuilder()
            .addComponents(b00, b01, b02)
        const bRow = new ActionRowBuilder()
            .addComponents(b10, b11, b12)
        const cRow = new ActionRowBuilder()
            .addComponents(b20, b21, b22)

        button.update({
            content: embedAndContent.content,
            embeds: [embedAndContent.embed],
            components: [aRow, bRow, cRow]
        })

    } else {
        button.deferUpdate();
    }
}
var tres = async function (interaction) {
    const a = Math.random() * 2 << 0
    let jugadores;
    try {
        jugadores = {
            player1: interaction.user,
            player2: getInteractionUser(interaction, `Lo siento, no puedo jugar contigo :<`, true)
        }
    } catch (e) {
        interaction.reply({ content: e.message, ephemeral: true });
        return;
    }

    const turno3enRayaID = [jugadores.player1, jugadores.player2][a]
    var b00 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_00_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b01 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_01_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b02 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_02_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b10 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_10_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b11 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_11_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b12 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_12_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b20 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_20_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b21 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_21_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var b22 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`3enRaya_22_${jugadores.player1.id}_${jugadores.player2.id}_${turno3enRayaID.id}_0`)
        .setStyle('Secondary')
    var aRow = new ActionRowBuilder()
        .addComponents(b00, b01, b02)
    var bRow = new ActionRowBuilder()
        .addComponents(b10, b11, b12)
    var cRow = new ActionRowBuilder()
        .addComponents(b20, b21, b22)

    let embed = new EmbedBuilder()
        .setDescription(`${jugadores.player1.toString()} vs ${jugadores.player2.toString()}`)
        .setColor("#5BDC69")

    await interaction.reply({
        content: `Empieza -> ${turno3enRayaID}`,
        embeds: [embed],
        components: [aRow, bRow, cRow]
    })
}

module.exports = { tresEnRaya, tres };