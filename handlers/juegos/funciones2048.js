const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const Usuario = require('../../models/usuario');
const { ButtonStyle } = require('../../node_modules/discord-api-types/v10');
const { findOrCreateDocument } = require('../funciones');


function nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33) {
    var arr = [];
    if (b00.data.custom_id.split('_')[3] == '0') arr.push(b00)
    if (b01.data.custom_id.split('_')[3] == '0') arr.push(b01)
    if (b02.data.custom_id.split('_')[3] == '0') arr.push(b02)
    if (b03.data.custom_id.split('_')[3] == '0') arr.push(b03)
    if (b10.data.custom_id.split('_')[3] == '0') arr.push(b10)
    if (b11.data.custom_id.split('_')[3] == '0') arr.push(b11)
    if (b12.data.custom_id.split('_')[3] == '0') arr.push(b12)
    if (b13.data.custom_id.split('_')[3] == '0') arr.push(b13)
    if (b20.data.custom_id.split('_')[3] == '0') arr.push(b20)
    if (b21.data.custom_id.split('_')[3] == '0') arr.push(b21)
    if (b22.data.custom_id.split('_')[3] == '0') arr.push(b22)
    if (b23.data.custom_id.split('_')[3] == '0') arr.push(b23)
    if (b30.data.custom_id.split('_')[3] == '0') arr.push(b30)
    if (b31.data.custom_id.split('_')[3] == '0') arr.push(b31)
    if (b32.data.custom_id.split('_')[3] == '0') arr.push(b32)
    if (b33.data.custom_id.split('_')[3] == '0') arr.push(b33)
    var num = 2;
    if (Math.random() < 0.1) num = 4;
    setNumber2048(arr[Math.random() * arr.length << 0], num)
}
function setNumber2048(button, number, sumado = false) {
    var idNueva = button.data.custom_id.split('_')[0] + '_' + button.data.custom_id.split('_')[1] + '_' + button.data.custom_id.split('_')[2] + '_' + number.toString();
    button.data.custom_id = idNueva;
    if (number != 0) {
        button.data.label = number.toString();
        if (sumado) {
            button.data.style = ButtonStyle.Primary;
        } else if (parseInt(number) >= 128) {
            button.data.style = ButtonStyle.Danger;
        } else {
            button.data.style = ButtonStyle.Success;
        }
    } else {
        button.data.label = '⠀';
        button.data.style = ButtonStyle.Secondary;
    }

}

function deMover02del2048(b02, b03) {
    var v02 = parseInt(b02.data.custom_id.split('_')[3])
    var v03 = parseInt(b03.data.custom_id.split('_')[3])
    if (v02 != 0) {
        if (v03 == 0) {
            setNumber2048(b02, 0);
            setNumber2048(b03, v02);
            return [true, 0];
        } else if (v02 == v03 && b03.data.style != 1) {
            setNumber2048(b02, 0);
            setNumber2048(b03, v02 + v03, true);
            return [true, (v02 + v03)];
        }
    }
    return [false, 0];
}
function deMover01del2048(b01, b02, b03) {
    var v01 = parseInt(b01.data.custom_id.split('_')[3])
    var v02 = parseInt(b02.data.custom_id.split('_')[3])
    var suma = 0;
    if (v01 != 0) {
        if (v02 == 0) {
            setNumber2048(b01, 0);
            setNumber2048(b02, v01);
            suma = deMover02del2048(b02, b03)[1] + suma;
            return [true, suma];
        } else if (v01 == v02 && b02.data.style != 1) {
            setNumber2048(b01, 0);
            setNumber2048(b02, v01 + v02, true);
            return [true, (v01 + v02)];
        }
    }
    return [false, 0];
}
function deMover00del2048(b00, b01, b02, b03) {
    var v00 = parseInt(b00.data.custom_id.split('_')[3])
    var v01 = parseInt(b01.data.custom_id.split('_')[3])
    var suma = 0;
    if (v00 != 0) {
        if (v01 == 0) {
            setNumber2048(b00, 0);
            setNumber2048(b01, v00);
            suma = deMover01del2048(b01, b02, b03)[1] + suma;
            suma = deMover02del2048(b01, b02)[1] + suma;
            return [true, suma];
        } else if (v00 == v01 && b01.data.style != 1) {
            setNumber2048(b00, 0);
            setNumber2048(b01, v00 + v01, true);
            return [true, (v00 + v01)];
        }
    }
    return [false, 0];
}
function abMover20del2048(b20, b30) {
    var v20 = parseInt(b20.data.custom_id.split('_')[3])
    var v30 = parseInt(b30.data.custom_id.split('_')[3])
    if (v20 != 0) {
        if (v30 == 0) {
            setNumber2048(b20, 0);
            setNumber2048(b30, v20);
            return [true, 0];
        } else if (v20 == v30 && b30.data.style != 1) {
            setNumber2048(b20, 0);
            setNumber2048(b30, v20 + v30, true);
            return [true, (v20 + v30)];
        }
    }
    return [false, 0];
}
function abMover10del2048(b10, b20, b30) {
    var v10 = parseInt(b10.data.custom_id.split('_')[3])
    var v20 = parseInt(b20.data.custom_id.split('_')[3])
    var suma = 0;
    if (v10 != 0) {
        if (v20 == 0) {
            setNumber2048(b10, 0);
            setNumber2048(b20, v10);
            suma = abMover20del2048(b20, b30)[1] + suma;
            return [true, suma];
        } else if (v10 == v20 && b20.data.style != 1) {
            setNumber2048(b10, 0);
            setNumber2048(b20, v10 + v20, true);
            return [true, (v20 + v20)];
        }
    }
    return [false, 0];
}
function abMover00del2048(b00, b10, b20, b30) {
    var v00 = parseInt(b00.data.custom_id.split('_')[3])
    var v10 = parseInt(b10.data.custom_id.split('_')[3])
    var suma = 0;
    if (v00 != 0) {
        if (v10 == 0) {
            setNumber2048(b00, 0);
            setNumber2048(b10, v00);
            suma = abMover10del2048(b10, b20, b30)[1] + suma;
            suma = abMover20del2048(b10, b20)[1] + suma;
            return [true, suma];
        } else if (v00 == v10 && b10.data.style != 1) {
            setNumber2048(b00, 0);
            setNumber2048(b10, v00 + v10, true);
            return [true, (v00 + v10)];
        }
    }
    return [false, 0];
}
function izMover01del2048(b01, b00) {
    var v01 = parseInt(b01.data.custom_id.split('_')[3])
    var v00 = parseInt(b00.data.custom_id.split('_')[3])
    if (v01 != 0) {
        if (v00 == 0) {
            setNumber2048(b01, 0);
            setNumber2048(b00, v01);
            return [true, 0];
        } else if (v01 == v00 && b01.data.style != 1 && b00.data.style != 1) {
            setNumber2048(b01, 0);
            setNumber2048(b00, v01 + v00, true);
            return [true, (v01 + v00)];
        }
    }
    return [false, 0];
}
function izMover02del2048(b02, b01, b00) {
    var v02 = parseInt(b02.data.custom_id.split('_')[3])
    var v01 = parseInt(b01.data.custom_id.split('_')[3])
    var suma = 0;
    if (v02 != 0) {
        if (v01 == 0) {
            setNumber2048(b02, 0);
            setNumber2048(b01, v02);
            suma = izMover01del2048(b01, b00)[1] + suma;
            return [true, suma];
        } else if (v02 == v01 && b01.data.style != 1) {
            setNumber2048(b02, 0);
            setNumber2048(b01, v02 + v01, true);
            return [true, (v02 + v01)];
        }
    }
    return [false, 0];
}
function izMover03del2048(b03, b02, b01, b00) {
    var v03 = parseInt(b03.data.custom_id.split('_')[3])
    var v02 = parseInt(b02.data.custom_id.split('_')[3])
    var suma = 0;
    if (v03 != 0) {
        if (v02 == 0) {
            setNumber2048(b03, 0);
            setNumber2048(b02, v03);
            suma = izMover02del2048(b02, b01, b00)[1] + suma;
            suma = izMover01del2048(b01, b00)[1] + suma;
            return [true, suma];
        } else if (v03 == v02 && b02.data.style != 1) {
            setNumber2048(b03, 0);
            setNumber2048(b02, v03 + v02, true);
            return [true, (v03 + v02)];
        }
    }
    return [false, 0];
}
function arMover10del2048(b10, b00) {
    var v10 = parseInt(b10.data.custom_id.split('_')[3])
    var v00 = parseInt(b00.data.custom_id.split('_')[3])
    if (v10 != 0) {
        if (v00 == 0) {
            setNumber2048(b10, 0);
            setNumber2048(b00, v10);
            return [true, 0];
        } else if (v10 == v00 && b00.data.style != 1) {
            setNumber2048(b10, 0);
            setNumber2048(b00, v10 + v00, true);
            return [true, (v10 + v00)];
        }
    }
    return [false, 0];
}
function arMover20del2048(b20, b10, b00) {
    var v20 = parseInt(b20.data.custom_id.split('_')[3])
    var v10 = parseInt(b10.data.custom_id.split('_')[3])
    var suma = 0;
    if (v20 != 0) {
        if (v10 == 0) {
            setNumber2048(b20, 0);
            setNumber2048(b10, v20);
            suma = arMover10del2048(b10, b00)[1] + suma;
            return [true, suma];
        } else if (v20 == v10 && b10.data.style != 1) {
            setNumber2048(b20, 0);
            setNumber2048(b10, v20 + v10, true);
            return [true, (v20 + v10)];
        }
    }
    return [false, 0];
}
function arMover30del2048(b30, b20, b10, b00) {
    var v30 = parseInt(b30.data.custom_id.split('_')[3])
    var v20 = parseInt(b20.data.custom_id.split('_')[3])
    var suma = 0;
    if (v30 != 0) {
        if (v20 == 0) {
            setNumber2048(b30, 0);
            setNumber2048(b20, v30);
            suma = arMover20del2048(b20, b10, b00)[1] + suma;
            suma = arMover10del2048(b10, b00)[1] + suma;
            return [true, suma];
        } else if (v30 == v20 && b20.data.style != 1) {
            setNumber2048(b30, 0);
            setNumber2048(b20, v30 + v20, true);
            return [true, (v30 + v20)];
        }
    }
    return [false, 0];
}

function quitarAzules(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33) {
    if (b00.data.style == ButtonStyle.Primary) setNumber2048(b00, b00.data.label)
    if (b01.data.style == ButtonStyle.Primary) setNumber2048(b01, b01.data.label)
    if (b02.data.style == ButtonStyle.Primary) setNumber2048(b02, b02.data.label)
    if (b03.data.style == ButtonStyle.Primary) setNumber2048(b03, b03.data.label)
    if (b10.data.style == ButtonStyle.Primary) setNumber2048(b10, b10.data.label)
    if (b11.data.style == ButtonStyle.Primary) setNumber2048(b11, b11.data.label)
    if (b12.data.style == ButtonStyle.Primary) setNumber2048(b12, b12.data.label)
    if (b13.data.style == ButtonStyle.Primary) setNumber2048(b13, b13.data.label)
    if (b20.data.style == ButtonStyle.Primary) setNumber2048(b20, b20.data.label)
    if (b21.data.style == ButtonStyle.Primary) setNumber2048(b21, b21.data.label)
    if (b22.data.style == ButtonStyle.Primary) setNumber2048(b22, b22.data.label)
    if (b23.data.style == ButtonStyle.Primary) setNumber2048(b23, b23.data.label)
    if (b30.data.style == ButtonStyle.Primary) setNumber2048(b30, b30.data.label)
    if (b31.data.style == ButtonStyle.Primary) setNumber2048(b31, b31.data.label)
    if (b32.data.style == ButtonStyle.Primary) setNumber2048(b32, b32.data.label)
    if (b33.data.style == ButtonStyle.Primary) setNumber2048(b33, b33.data.label)
}

async function comprobarFinJuego(button, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33, message2) {
    const valores = [
        [b00.data.custom_id.split('_')[3], b01.data.custom_id.split('_')[3], b02.data.custom_id.split('_')[3], b03.data.custom_id.split('_')[3]],
        [b10.data.custom_id.split('_')[3], b11.data.custom_id.split('_')[3], b12.data.custom_id.split('_')[3], b13.data.custom_id.split('_')[3]],
        [b20.data.custom_id.split('_')[3], b21.data.custom_id.split('_')[3], b22.data.custom_id.split('_')[3], b23.data.custom_id.split('_')[3]],
        [b30.data.custom_id.split('_')[3], b31.data.custom_id.split('_')[3], b32.data.custom_id.split('_')[3], b33.data.custom_id.split('_')[3]]
    ];
    const noTieneIgualAlLado = (currentValue, index, array) => currentValue != array[index + 1];
    const transpuesta = valores[0].map((_, colIndex) => valores.map(row => row[colIndex]))
    if (!(!valores[0].every(noTieneIgualAlLado) || !valores[1].every(noTieneIgualAlLado) || !valores[2].every(noTieneIgualAlLado) || !valores[3].every(noTieneIgualAlLado) || !transpuesta[0].every(noTieneIgualAlLado) || !transpuesta[1].every(noTieneIgualAlLado) || !transpuesta[2].every(noTieneIgualAlLado) || !transpuesta[3].every(noTieneIgualAlLado)) && !valores[0].includes('0') && !valores[1].includes('0') && !valores[2].includes('0') && !valores[3].includes('0')) {
        //FIN DEL JUEGO
        const user = await Usuario.find({ idDiscord: button.user.id });
        const punt = parseInt(message2.content.split(' ')[1]);
        if (punt > user[0].record2048) {
            await Usuario.findOneAndUpdate({ idDiscord: button.user.id }, { record2048: punt }, { new: true });
            button.channel.send(`${button.user} has conseguido un nuevo record personal en el 2048!! Puntuación: ${punt}`)
        } else {
            button.channel.send(`${button.user} -> fin del juego. Puntuación: ${punt}`)
        }
    }

}

var onClick2048 = function (button) {
    const id = button.customId.split('_');
    switch (id[1]) {
        case 'bDe':
            if (button.user.id == id[2]) {
                var b00 = button.message.components[0].components[0]
                var b01 = button.message.components[0].components[1]
                var b02 = button.message.components[0].components[2]
                var b03 = button.message.components[0].components[3]
                var b10 = button.message.components[1].components[0]
                var b11 = button.message.components[1].components[1]
                var b12 = button.message.components[1].components[2]
                var b13 = button.message.components[1].components[3]
                var b20 = button.message.components[2].components[0]
                var b21 = button.message.components[2].components[1]
                var b22 = button.message.components[2].components[2]
                var b23 = button.message.components[2].components[3]
                var b30 = button.message.components[3].components[0]
                var b31 = button.message.components[3].components[1]
                var b32 = button.message.components[3].components[2]
                var b33 = button.message.components[3].components[3]
                var bIz = button.message.components[4].components[0]
                var bAr = button.message.components[4].components[1]
                var bAb = button.message.components[4].components[2]
                var bDe = button.message.components[4].components[3]
                quitarAzules(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
                const a = deMover02del2048(b02, b03);
                const b = deMover02del2048(b12, b13)
                const c = deMover02del2048(b22, b23)
                const d = deMover02del2048(b32, b33)
                const e = deMover01del2048(b01, b02, b03)
                const f = deMover01del2048(b11, b12, b13)
                const g = deMover01del2048(b21, b22, b23)
                const h = deMover01del2048(b31, b32, b33)
                const i = deMover00del2048(b00, b01, b02, b03)
                const j = deMover00del2048(b10, b11, b12, b13)
                const k = deMover00del2048(b20, b21, b22, b23)
                const l = deMover00del2048(b30, b31, b32, b33)
                const suma = a[1] + b[1] + c[1] + d[1] + e[1] + f[1] + g[1] + h[1] + i[1] + j[1] + k[1] + l[1];
                if (!(a[0] || b[0] || c[0] || d[0] || e[0] || f[0] || g[0] || h[0] || i[0] || j[0] || k[0] || l[0])) return button.deferUpdate();
                nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33)
                var r0 = new ActionRowBuilder()
                    .addComponents(b00, b01, b02, b03)
                var r1 = new ActionRowBuilder()
                    .addComponents(b10, b11, b12, b13)
                var r2 = new ActionRowBuilder()
                    .addComponents(b20, b21, b22, b23)
                var r3 = new ActionRowBuilder()
                    .addComponents(b30, b31, b32, b33)
                var rC = new ActionRowBuilder()
                    .addComponents(bIz, bAr, bAb, bDe)
                button.message.edit({
                    content: `Puntuación: ${parseInt(button.message.content.split(' ')[1]) + suma} | ${button.message.content.split(' | ')[1]}`,
                    components: [r0, r1, r2, r3, rC]
                }).then(
                    message2 => comprobarFinJuego(button, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33, message2)
                )
            }
            button.deferUpdate()
            break;
        case 'bIz':
            if (button.user.id == id[2]) {
                var b00 = button.message.components[0].components[0]
                var b01 = button.message.components[0].components[1]
                var b02 = button.message.components[0].components[2]
                var b03 = button.message.components[0].components[3]
                var b10 = button.message.components[1].components[0]
                var b11 = button.message.components[1].components[1]
                var b12 = button.message.components[1].components[2]
                var b13 = button.message.components[1].components[3]
                var b20 = button.message.components[2].components[0]
                var b21 = button.message.components[2].components[1]
                var b22 = button.message.components[2].components[2]
                var b23 = button.message.components[2].components[3]
                var b30 = button.message.components[3].components[0]
                var b31 = button.message.components[3].components[1]
                var b32 = button.message.components[3].components[2]
                var b33 = button.message.components[3].components[3]
                var bIz = button.message.components[4].components[0]
                var bAr = button.message.components[4].components[1]
                var bAb = button.message.components[4].components[2]
                var bDe = button.message.components[4].components[3]
                quitarAzules(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
                const a = izMover01del2048(b01, b00);
                const b = izMover01del2048(b11, b10)
                const c = izMover01del2048(b21, b20)
                const d = izMover01del2048(b31, b30)
                const e = izMover02del2048(b02, b01, b00)
                const f = izMover02del2048(b12, b11, b10)
                const g = izMover02del2048(b22, b21, b20)
                const h = izMover02del2048(b32, b31, b30)
                const i = izMover03del2048(b03, b02, b01, b00)
                const j = izMover03del2048(b13, b12, b11, b10)
                const k = izMover03del2048(b23, b22, b21, b20)
                const l = izMover03del2048(b33, b32, b31, b30)
                const suma = a[1] + b[1] + c[1] + d[1] + e[1] + f[1] + g[1] + h[1] + i[1] + j[1] + k[1] + l[1];
                if (!(a[0] || b[0] || c[0] || d[0] || e[0] || f[0] || g[0] || h[0] || i[0] || j[0] || k[0] || l[0])) return button.deferUpdate();
                nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33)
                var r0 = new ActionRowBuilder()
                    .addComponents(b00, b01, b02, b03)
                var r1 = new ActionRowBuilder()
                    .addComponents(b10, b11, b12, b13)
                var r2 = new ActionRowBuilder()
                    .addComponents(b20, b21, b22, b23)
                var r3 = new ActionRowBuilder()
                    .addComponents(b30, b31, b32, b33)
                var rC = new ActionRowBuilder()
                    .addComponents(bIz, bAr, bAb, bDe)
                button.message.edit({
                    content: `Puntuación: ${parseInt(button.message.content.split(' ')[1]) + suma} | ${button.message.content.split(' | ')[1]}`,
                    components: [r0, r1, r2, r3, rC]
                }).then(
                    message2 => comprobarFinJuego(button, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33, message2)
                )
            }
            button.deferUpdate()
            break;
        case 'bAb':
            if (button.user.id == id[2]) {
                var b00 = button.message.components[0].components[0]
                var b01 = button.message.components[0].components[1]
                var b02 = button.message.components[0].components[2]
                var b03 = button.message.components[0].components[3]
                var b10 = button.message.components[1].components[0]
                var b11 = button.message.components[1].components[1]
                var b12 = button.message.components[1].components[2]
                var b13 = button.message.components[1].components[3]
                var b20 = button.message.components[2].components[0]
                var b21 = button.message.components[2].components[1]
                var b22 = button.message.components[2].components[2]
                var b23 = button.message.components[2].components[3]
                var b30 = button.message.components[3].components[0]
                var b31 = button.message.components[3].components[1]
                var b32 = button.message.components[3].components[2]
                var b33 = button.message.components[3].components[3]
                var bIz = button.message.components[4].components[0]
                var bAr = button.message.components[4].components[1]
                var bAb = button.message.components[4].components[2]
                var bDe = button.message.components[4].components[3]
                quitarAzules(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
                const a = abMover20del2048(b20, b30);
                const b = abMover20del2048(b21, b31)
                const c = abMover20del2048(b22, b32)
                const d = abMover20del2048(b23, b33)
                const e = abMover10del2048(b10, b20, b30)
                const f = abMover10del2048(b11, b21, b31)
                const g = abMover10del2048(b12, b22, b32)
                const h = abMover10del2048(b13, b23, b33)
                const i = abMover00del2048(b00, b10, b20, b30)
                const j = abMover00del2048(b01, b11, b21, b31)
                const k = abMover00del2048(b02, b12, b22, b32)
                const l = abMover00del2048(b03, b13, b23, b33)
                const suma = a[1] + b[1] + c[1] + d[1] + e[1] + f[1] + g[1] + h[1] + i[1] + j[1] + k[1] + l[1];
                if (!(a[0] || b[0] || c[0] || d[0] || e[0] || f[0] || g[0] || h[0] || i[0] || j[0] || k[0] || l[0])) return button.deferUpdate();
                nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33)
                var r0 = new ActionRowBuilder()
                    .addComponents(b00, b01, b02, b03)
                var r1 = new ActionRowBuilder()
                    .addComponents(b10, b11, b12, b13)
                var r2 = new ActionRowBuilder()
                    .addComponents(b20, b21, b22, b23)
                var r3 = new ActionRowBuilder()
                    .addComponents(b30, b31, b32, b33)
                var rC = new ActionRowBuilder()
                    .addComponents(bIz, bAr, bAb, bDe)
                button.message.edit({
                    content: `Puntuación: ${parseInt(button.message.content.split(' ')[1]) + suma} | ${button.message.content.split(' | ')[1]}`,
                    components: [r0, r1, r2, r3, rC]
                }).then(
                    message2 => comprobarFinJuego(button, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33, message2)
                )
            }
            button.deferUpdate()
            break;
        case 'bAr':
            if (button.user.id == id[2]) {
                var b00 = button.message.components[0].components[0]
                var b01 = button.message.components[0].components[1]
                var b02 = button.message.components[0].components[2]
                var b03 = button.message.components[0].components[3]
                var b10 = button.message.components[1].components[0]
                var b11 = button.message.components[1].components[1]
                var b12 = button.message.components[1].components[2]
                var b13 = button.message.components[1].components[3]
                var b20 = button.message.components[2].components[0]
                var b21 = button.message.components[2].components[1]
                var b22 = button.message.components[2].components[2]
                var b23 = button.message.components[2].components[3]
                var b30 = button.message.components[3].components[0]
                var b31 = button.message.components[3].components[1]
                var b32 = button.message.components[3].components[2]
                var b33 = button.message.components[3].components[3]
                var bIz = button.message.components[4].components[0]
                var bAr = button.message.components[4].components[1]
                var bAb = button.message.components[4].components[2]
                var bDe = button.message.components[4].components[3]
                quitarAzules(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
                const a = arMover10del2048(b10, b00);
                const b = arMover10del2048(b11, b01)
                const c = arMover10del2048(b12, b02)
                const d = arMover10del2048(b13, b03)
                const e = arMover20del2048(b20, b10, b00)
                const f = arMover20del2048(b21, b11, b01)
                const g = arMover20del2048(b22, b12, b02)
                const h = arMover20del2048(b23, b13, b03)
                const i = arMover30del2048(b30, b20, b10, b00)
                const j = arMover30del2048(b31, b21, b11, b01)
                const k = arMover30del2048(b32, b22, b12, b02)
                const l = arMover30del2048(b33, b23, b13, b03)
                const suma = a[1] + b[1] + c[1] + d[1] + e[1] + f[1] + g[1] + h[1] + i[1] + j[1] + k[1] + l[1];
                if (!(a[0] || b[0] || c[0] || d[0] || e[0] || f[0] || g[0] || h[0] || i[0] || j[0] || k[0] || l[0])) return button.deferUpdate();
                nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33)
                var r0 = new ActionRowBuilder()
                    .addComponents(b00, b01, b02, b03)
                var r1 = new ActionRowBuilder()
                    .addComponents(b10, b11, b12, b13)
                var r2 = new ActionRowBuilder()
                    .addComponents(b20, b21, b22, b23)
                var r3 = new ActionRowBuilder()
                    .addComponents(b30, b31, b32, b33)
                var rC = new ActionRowBuilder()
                    .addComponents(bIz, bAr, bAb, bDe)
                button.message.edit({
                    content: `Puntuación: ${parseInt(button.message.content.split(' ')[1]) + suma} | ${button.message.content.split(' | ')[1]}`,
                    components: [r0, r1, r2, r3, rC]
                }).then(
                    message2 => comprobarFinJuego(button, b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33, message2)
                )
            }
            button.deferUpdate()
            break;
        default:
            break;
    }
}
var iniciar2048 = async function (interaction) {
    const user = await findOrCreateDocument(interaction.user.id, Usuario);
    const b00 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_00_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b01 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_01_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b02 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_02_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b03 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_03_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b10 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_10_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b11 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_11_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b12 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_12_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b13 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_13_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b20 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_20_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b21 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_21_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b22 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_22_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b23 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_23_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b30 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_30_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b31 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_31_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b32 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_32_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const b33 = new ButtonBuilder()
        .setLabel('⠀')
        .setCustomId(`2048_33_${interaction.user.id}_0`)
        .setStyle('Secondary')
        .setDisabled(true)
    const bIz = new ButtonBuilder()
        .setLabel('←')
        .setCustomId(`2048_bIz_${interaction.user.id}_0`)
        .setStyle('Primary')
    const bAr = new ButtonBuilder()
        .setLabel('↑')
        .setCustomId(`2048_bAr_${interaction.user.id}_0`)
        .setStyle('Primary')
    const bAb = new ButtonBuilder()
        .setLabel('↓')
        .setCustomId(`2048_bAb_${interaction.user.id}_0`)
        .setStyle('Primary')
    const bDe = new ButtonBuilder()
        .setLabel('→')
        .setCustomId(`2048_bDe_${interaction.user.id}_0`)
        .setStyle('Primary')
    nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
    nuevoNumeroAzar2048(b00, b01, b02, b03, b10, b11, b12, b13, b20, b21, b22, b23, b30, b31, b32, b33);
    var r0 = new ActionRowBuilder()
        .addComponents(b00, b01, b02, b03)
    var r1 = new ActionRowBuilder()
        .addComponents(b10, b11, b12, b13)
    var r2 = new ActionRowBuilder()
        .addComponents(b20, b21, b22, b23)
    var r3 = new ActionRowBuilder()
        .addComponents(b30, b31, b32, b33)
    var rC = new ActionRowBuilder()
        .addComponents(bIz, bAr, bAb, bDe)
    interaction.reply({
        content: `Puntuación: 0 | Record personal: ${user.record2048}`,
        components: [r0, r1, r2, r3, rC]
    })
}
var rank2048 = async function (interaction) {
    const docs = await Usuario.find().sort({ record2048: -1 });
    var j = 0;
    var top = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#FFCB00')
        .setDescription(`Este es el top de 10 personas en el **</2048:0>** :sparkles:`)
        .addFields(
            { name: `:first_place: :white_small_square: ${await test(0)}`, value: `:black_small_square: Puntuación: \`${docs[0 + j].record2048}\`` },
            { name: `:second_place: :white_small_square: ${await test(1)}`, value: `:black_small_square: Puntuación: \`${docs[1 + j].record2048}\`` },
            { name: `:third_place: :white_small_square: ${await test(2)}`, value: `:black_small_square: Puntuación: \`${docs[2 + j].record2048}\`` }
        )
    for (var i = 3; i < 10; i++) {
        top.addFields(
            { name: `#${i + 1} :white_small_square: ${await test(i)}`, value: `:black_small_square: Puntuación: \`${docs[i + j].record2048}\`` }
        )
    }

    interaction.reply({ embeds: [top] });
    async function test(i) {
        try {
            let member = await interaction.guild.members.fetch(docs[i + j].idDiscord)
            return member.user.username;
        } catch {
            j++;
            return test(i);
        }
    }
}

module.exports = { onClick2048, iniciar2048, rank2048 };