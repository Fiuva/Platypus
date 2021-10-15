var haSaludado = false;
var queTal = false;
var yoQueTal = false;

const disbut = require('discord-buttons');
const client = require('./index.js').client;
const Info = require('./models/infoCumple');
module.exports = { Info };

const urlAvatar = 'https://cdn.discordapp.com/attachments/817486409157836850/897469358564057128/PicsArt_10-12-03.02.42.jpg'; //DESCOMENTAR COSAS!!!
const urlAvatarFbi = 'https://cdn.discordapp.com/attachments/817486409157836850/897972168145637416/ebb1dcff1e89b1fdec0b1defb040f1f6.png'

var saludo = async function (message) {
    var info = await Info.find({ __v: 0 }).exec();
    fase = info[0].fase;
    switch (fase) {
        case 1: return intro(message, fase);
            break;
        case 2: return fase2(message, fase);
            break;
        case 3: return fase3(message, fase);
            break;
        case 4: return fase4(message, fase);
            break;
        case 5: return fase5(message, fase);
            break;
        case 6: return fase6(message, fase);
            break;
    }
    if (message.content.match(/hola/gi)) {
        if (!haSaludado) {
            haSaludado = true;
            await escribir(message, `Hola nutria🦦`);
            queTal = true;
            await timeout(1);
            escribir(message, `Que tal? 👀`).then(message2 => {
                message2.channel.awaitMessages(m => m, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        const cont = collected.first().content;
                        if (cont.match(/bien/ig)) {
                            if (cont.match(/no/ig)) {
                                await escribir(message, `Bueno :'> espero alegrarte un poco entonces :>`)
                            } else {
                                await escribir(message, `Owww, me alegro :>`)
                            }
                        } else if (cont.match(/mal/ig)) {
                            await escribir(message, `Bueno :'< espero alegrarte un poco entonces :>`)
                        } else {
                            await escribir(message, `Supongo que eso es que estás bien xd`)
                        }
                        if (cont.match(/y tu?/ig)) {
                            yoQueTal = true;
                            await escribir(message, `Bueno, pues como un ornitorrinco normal, asi de fiesta 🥳`)
                            client.user.setAvatar(urlAvatar);
                            await escribir(message, `Sudando leche y lo que suelen hacer los mamiferos huevosos`)
                            return intro(message)
                        }
                        await timeout(20)
                        if (!yoQueTal) {
                            yoQueTal = true;
                            await escribir(message, `Pues como no me hablas, te digo como estoy yo :>`)
                            await escribir(message, `Bueno, pues yo estoy como un ornitorrinco normal, asi de fiesta 🥳`)
                            client.user.setAvatar(urlAvatar);
                            await escribir(message, `Sudando leche y lo que suelen hacer los mamiferos huevosos`)
                            return intro(message)
                        }
                    })
                    .catch(async collected => {
                        if (!yoQueTal) {
                            yoQueTal = true;
                            await escribir(message, `Nutriaaaa, no me contestas :<`)
                            await escribir(message, `Pues como no me hablas, te digo como estoy yo :>`)
                            await escribir(message, `Bueno, pues yo estoy como un ornitorrinco normal, asi de fiesta 🥳`)
                            client.user.setAvatar(urlAvatar);
                            await escribir(message, `Sudando leche y lo que suelen hacer los mamiferos huevosos`)
                            return intro(message)
                        }
                    });
            });
        } else {
            escribir(message, `Hola otra vez :> <3`);
        }
    }
    if (message.content.match(/que tal?/gi)) {
        if (!queTal) {
            yoQueTal = true;
            await escribir(message, `Bueno, pues yo estoy como un ornitorrinco normal, asi de fiesta 🥳`)
            client.user.setAvatar(urlAvatar);
            return escribir(message, `Sudando leche y lo que suelen hacer los mamiferos huevosos. Y tú?`).then(message2 => {
                message2.channel.awaitMessages(m => m, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        const cont = collected.first().content;
                        if (cont.match(/bien/ig)) {
                            if (cont.match(/no/ig)) {
                                await escribir(message, `Bueno :'> espero alegrarte un poco entonces :>`)
                            } else {
                                await escribir(message, `Owww, me alegro :>`)
                            }
                        } else if (cont.match(/mal/ig)) {
                            await escribir(message, `Bueno :'< espero alegrarte un poco entonces :>`)
                        } else {
                            await escribir(message, `Supongo que eso es que estás bien xd`)
                        }
                        queTal = true;
                        return intro(message)
                    })
                    .catch(async () => {
                        await escribir(message, `Nutriaaaa, no me contestas :<`)
                        return intro(message)
                    });
            })
        };
        await timeout(1);
        if (!yoQueTal) {
            yoQueTal = true;
            await escribir(message, `Bueno, pues yo estoy como un ornitorrinco normal, asi de fiesta 🥳`)
            client.user.setAvatar(urlAvatar);
            await escribir(message, `Sudando leche y lo que suelen hacer los mamiferos huevosos`)
            return intro(message)
        }
    }
}

var preguntaPerfil = [false, false, false];
async function intro(message, fase = 0) {
    if (!preguntaPerfil[0] && !preguntaPerfil[1]) {
        preguntaPerfil[0] = true;
        if (fase == 0) await Info.findOneAndUpdate({ __v: 0 }, { fase: 1 }, { new: true })
        await timeout(2);
        await escribir(message, `Bueno...`);
        await escribir(message, `Te gusta mi foto de perfil? Me puse un gorro :)`)
        preguntaPerfil[2] = true;
    } else if (preguntaPerfil[0] && !preguntaPerfil[1] && preguntaPerfil[2]) {
        preguntaPerfil[1] = true;
        if ((message.content.match(/si/gi) || message.content.match(/me gusta/gi)) && !message.content.match(/\sno\s/gi)) {
            await escribir(message, `Gracias 😊`)
            await timeout(3);
            await escribir(message, `Por cierto, que no te he felicitado`)
            await escribir(message, `Feliz cumpleaños nutria lechosa!!! 🥳🥳🥳`)
            fase2(message, fase)
        } else {
            await escribir(message, `Comoo??`)
            await escribir(message, `Me compro un gorro para tu cumpleaños y me respondes eso :'<`)
            await escribir(message, `😔`)
            await timeout(3);
            await escribir(message, `Da igual...`)
            await escribir(message, `Por cierto, que no te he felicitado`)
            await escribir(message, `Feliz cumpleaños ancianaaaa 🥳🥳🥳`)
            fase2(message, fase)
        }
    } 
}
var miniFases = [false, false, false, false, false]
async function fase2(message, fase = 0) {
    if (!miniFases[0]) {
        miniFases[0] = true;
        if (fase == 1) await Info.findOneAndUpdate({ __v: 0 }, { fase: 2 }, { new: true })
        await timeout(2);
        await escribir(message, `Bueno, pues te voy a dar el regalo que te ha preparado Fiuva :>`)
        await timeout(2);
        await escribir(message, `mmmm...`)
        await escribir(message, `Espera...`)
        await escribir(message, `Como se que realmente eres Nat??`)
        miniFases[1] = true;
    } else if (miniFases[1] && !miniFases[2]) {
        miniFases[2] = true;
        await timeout(1);
        await escribir(message, `Na na, no me fío`)
        await escribir(message, `Fiuva me ha dicho que es para alguien muy importante y que no la podía fastidiar, que soy un patoso :<`)
        await escribir(message, `Lo siento`)
        await escribir(message, `Pero me tengo que asegurar que eres Nat de verdad 🧐`)
        await timeout(2);
        await escribir(message, `Así que te haré unas breves preguntas...`)
        await timeout(2);
        await escribir(message, `Cómo te llamas?`)
        await timeout(1)
        await escribir(message, `Espera espera`)
        await escribir(message, `Que bazofia de pregunta xd, la cambio`)
        await escribir(message, `Cuantos años tienes? ${message.author}`)
        miniFases[3] = true;
    } else if (miniFases[3] && !miniFases[4]) {
        miniFases[4] = true;
        if (message.content.match(/15/gi) || message.content.match(/quince/gi)) {
            await escribir(message, `He preguntado tu edad, no que día cumples :/`)
            await timeout(2);
            await escribir(message, `a`)
            await escribir(message, `Claro, que coincide 😅`)
            await timeout(2)
            await escribir(message, `Osea que tienes 2+13 😏`)
            await timeout(1)
            await escribir(message, `... en fin xd`)
            return fase3(message, fase)
        } else {
            await escribir(message, `Como?? Algo falla en mis calculos o no te entiendo bien, repite repite 👀`)
            miniFases[4] = false;
        }
    }
}

var miniFases3 = [false, false, false]
async function fase3(message, fase = 0) {
    if (!miniFases3[0]) {
        miniFases3[0] = true;
        if (fase == 2) await Info.findOneAndUpdate({ __v: 0 }, { fase: 3 }, { new: true })
        await timeout(2);
        await escribir(message, `Vale, aquí va otra pregunta que solo la sabría la ✨Nat real✨`)
        await escribir(message, `Cuál es la mejor fruta del mundo??👀`)
        miniFases3[1] = true;
    } else if (miniFases3[1] && !miniFases3[2]) {
        miniFases3[2] = true;
        if (message.content.match(/piña/gi)) {
            await escribir(message, `🤤🤤 La piña piñosaaa`)
            await escribir(message, `🍍🍍🍍🍍`)
            await timeout(3)
            await escribir(message, `Ayy, que tiempos :'>`)
            await timeout(3)
            await escribir(message, `Vale, otra pregunta (no vale buscar):`)
            await timeout(2.5)
            const b0 = new disbut.MessageButton()
                .setLabel('Un programa en un lenguaje que no entiende ni Einstein')
                .setID(`regaloNat_15_t`)
                .setStyle('green')
            const b1 = new disbut.MessageButton()
                .setLabel('Un pepino seco')
                .setID(`regaloNat_15_f1`)
                .setStyle('green')
            const b2 = new disbut.MessageButton()
                .setLabel('Nada más porque es un soso :<')
                .setID(`regaloNat_15_f2`)
                .setStyle('green')
            const b3 = new disbut.MessageButton()
                .setLabel('Un dibujo muy fresco que estuvo dibujando toda la noche')
                .setID(`regaloNat_15_f3`)
                .setStyle('green')
            const b4 = new disbut.MessageButton()
                .setLabel('Una sub al canal del cerdo que ahora es un Yeti')
                .setID(`regaloNat_15_f4`)
                .setStyle('green')
            message.channel.send(`Fiuva el año pasado te regaló para tu cumple una piña y...`, { buttons: [b1, b0, b2, b3, b4] })
            await escribir(message, `(Pro-tip para pobres: Si giras el móvil en horizontal ves las opciones completas :>)`)
        } else {
            await escribir(message, `Estoy empezando a dudar un poco de tu identidad... prueba otra`)
            miniFases3[2] = false;
        }
    }
}

var miniFases4 = [false, false, false, false, false]
async function fase4(message, fase = 0) {
    if (!miniFases4[0]) {
        miniFases4[0] = true;
        if (fase == 3) await Info.findOneAndUpdate({ __v: 0 }, { fase: 4 }, { new: true })
        await timeout(5);
        await escribir(message, `Ahora sí, última pregunta :>`)
        await escribir(message, `Estás preparada? 👀`)
        miniFases4[1] = true;
    } else if (miniFases4[1] && !miniFases4[2]) {
        miniFases4[2] = true;
        if (miniFases4[4]) {
            miniFases4[4] = false;
            await escribir(message, `Ahora estás preparada?`)
            return miniFases4[2] = false;
        }
        if (message.content.match(/si/gi)) {
            await timeout(0.5);
            await escribir(message, `Bien bien`)
            await escribir(message, `La pregunta es...`)
            const b0 = new disbut.MessageButton()
                .setLabel('+100')
                .setID(`regaloNat2_15_t0`)
                .setStyle('green')
            const b1 = new disbut.MessageButton()
                .setLabel('+150')
                .setID(`regaloNat2_15_t1`)
                .setStyle('green')
            const b2 = new disbut.MessageButton()
                .setLabel('+200')
                .setID(`regaloNat2_15_t2`)
                .setStyle('green')
            await timeout(2)
            message.channel.send(`Cuántos días llevas casada?`, { buttons: [b1, b0, b2] })
        } else {
            await escribir(message, `No? Bueno, no hay prisa, cuando estés preparada me dices :)`)
            miniFases4[2] = false;
            miniFases4[4] = true;
        }
    }
}

var miniFases5 = [false, false, false, false, false]

function modMensajeCarcel(botones, nivel) {
    if (nivel == 0) {
        return botones;
    } else if (nivel == 1) {
        botones[3][2].setLabel('👆').setStyle('red');
        return botones;
    } else if (nivel == 2) {
        botones[4][3].setLabel('👇').setStyle('red');
        botones[0][1].setLabel('👆').setStyle('red');
        botones[2][2].setLabel('👇').setStyle('red');
        return botones;
    } else if (nivel == 3) {
        botones[3][2].setLabel('👆').setStyle('red');
        botones[0][2].setLabel('🦁').setStyle('red');
        return botones;
    } else if (nivel == 4) {
        botones[3][2].setLabel('🦁').setStyle('red');
        botones[0][2].setLabel('🦁').setStyle('red');
        botones[2][2].setLabel('🦁').setStyle('red');
        botones[4][2].setLabel('🦁').setStyle('red');
        return botones;
    }
    else if (nivel == 5) {
        botones[4][3].setLabel('👇').setStyle('red');
        botones[3][1].setLabel('👆').setStyle('red');
        botones[0][0].setLabel('🦁').setStyle('red');
        botones[4][4].setLabel('🦁').setStyle('red');
        botones[0][3].setLabel('🦁').setStyle('red');
        return botones;
    }
}

function mensajeCarcel(nivel) {
    const b00 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_00_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b01 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_01_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b02 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_02_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b03 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_03_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b04 = new disbut.MessageButton()
        .setLabel('🍍')
        .setID(`regaloNatCarcel_15_04_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b10 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_10_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b11 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_11_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b12 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_12_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b13 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_13_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b14 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_14_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b20 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_20_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b21 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_21_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b22 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_22_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b23 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_23_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b24 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_24_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b30 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_30_${nivel}_null`)
        .setStyle('grey')
    const b31 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_31_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b32 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_32_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b33 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_33_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b34 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_34_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b40 = new disbut.MessageButton()
        .setLabel('🦦')
        .setID(`regaloNatCarcel_15_40_${nivel}_null`)
        .setStyle('grey')
    const b41 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_41_${nivel}_null`)
        .setStyle('grey')
    const b42 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_42_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b43 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_43_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    const b44 = new disbut.MessageButton()
        .setLabel(' ')
        .setID(`regaloNatCarcel_15_44_${nivel}_null`)
        .setStyle('grey')
        .setDisabled()
    return botones = [[b00, b01, b02, b03, b04], [b10, b11, b12, b13, b14], [b20, b21, b22, b23, b24], [b30, b31, b32, b33, b34], [b40, b41, b42, b43, b44]]
}

async function fase5(message, fase = 0) {
    if (!miniFases5[0]) {
        miniFases5[0] = true;
        if (fase == 4) await Info.findOneAndUpdate({ __v: 0 }, { fase: 5 }, { new: true })
        miniFases5[1] = true;
    } else if (miniFases5[1] && !miniFases5[2]) {
        miniFases5[2] = true;
        await timeout(2);
        await escribir(message, `Buenos días, se encuentra en la cárcel de Platypus`)
        enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(0), 0), 0);
    }
}

var miniFases6 = [false]

async function fase6(message, fase = 0) {
    if (!miniFases6[0]) {
        miniFases6[0] = true;
        if (fase == 5) await Info.findOneAndUpdate({ __v: 0 }, { fase: 6 }, { new: true })
        await timeout(3)
        await escribir(message, `Naaaaaat me has liberado de la carcel!! Cogiendo piñas?`)
        await escribir(message, `Bueno da igual jsjs gracias por tu tiempo <3`)
        await escribir(message, `Ahora mandale una captura a Fiuva de esto y te envía el regalo :) que me lo comí porque tenía hambre :)`)
        await escribir(message, `Chaooo <3`)
    }
    
}

function resetBotones(botones) {
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            const id = botones[i][j].custom_id.split('_');
            if (id[4] == 'nullMANO' || id[4] == 'nullLEON') {
                botones[i][j].setID(`${id[0]}_${id[1]}_${id[2]}_${id[3]}_null`)
            }
            if (!botones[i][j].disabled)botones[i][j].setDisabled();
        }
    }
    return botones;
}

function moverNutria(botones, strPos, message, nivel) {
    const pos = [parseInt(strPos[0]), parseInt(strPos[1])]
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            if (botones[i][j].label == '🦦') {
                botones[i][j].setLabel(' ').setDisabled();
                if (i > 0) botones[i - 1][j].setDisabled();
                if (i < 4) botones[i + 1][j].setDisabled();
                if (j < 4) botones[i][j + 1].setDisabled();
                if (j > 0) botones[i][j - 1].setDisabled();
            } else if (botones[i][j].label == '👆') {
                const id = botones[i][j].custom_id.split('_');
                if (i == 0) {
                    if (id[4] == 'null' && !(i == pos[0] && j == pos[1]) && botones[i + 1][j].label != '🦁') {
                        botones[i + 1][j].setLabel('👇').setStyle('red').setID(botones[i + 1][j].custom_id + 'MANO');
                        botones[i][j].setLabel(' ').setStyle('grey');
                    }
                } else {
                    if (id[4] == 'null' && !(i == pos[0] && j == pos[1]) && botones[i - 1][j].label != '🦁') {
                        botones[i - 1][j].setLabel('👆').setStyle('red').setID(botones[i - 1][j].custom_id + 'MANO');
                        botones[i][j].setLabel(' ').setStyle('grey');
                    }
                }
            } else if (botones[i][j].label == '👇') {
                const id = botones[i][j].custom_id.split('_');
                if (i == 4) {
                    if (id[4] == 'null' && !(i == pos[0] && j == pos[1]) && botones[i - 1][j].label != '🦁') {
                        botones[i - 1][j].setLabel('👆').setStyle('red').setID(botones[i - 1][j].custom_id + 'MANO');
                        botones[i][j].setLabel(' ').setStyle('grey');
                    }
                } else {
                    if (id[4] == 'null' && !(i == pos[0] && j == pos[1]) && botones[i + 1][j].label != '🦁') {
                        botones[i + 1][j].setLabel('👇').setStyle('red').setID(botones[i + 1][j].custom_id + 'MANO');
                        botones[i][j].setLabel(' ').setStyle('grey');
                    }
                }
            } else if (botones[i][j].label == '🦁') {
                const id = botones[i][j].custom_id.split('_');
                var opcion = [1, 2, 3, 4];
                var opcionElegida = 0;
                var c1 = true;
                var c2 = true;
                var c3 = true;
                var c4 = true;
                if (i == 4) {
                    opcion.splice(opcion.indexOf(1), 1);
                } else if (i == 0) {
                    opcion.splice(opcion.indexOf(2), 1);
                }
                if (j == 4) {
                    opcion.splice(opcion.indexOf(3), 1);
                } else if (j == 0) {
                    opcion.splice(opcion.indexOf(4), 1);
                }
                if (id[4] == 'null') opcionElegida = opcion[Math.random() * opcion.length << 0]
                switch (opcionElegida) {
                    case 1:
                        if (botones[i + 1][j].label == ' ' || botones[i + 1][j].label == '🦦') {
                            botones[i + 1][j].setLabel('🦁').setStyle('red').setID(botones[i + 1][j].custom_id + 'LEON');
                            botones[i][j].setLabel(' ').setStyle('grey');
                        }
                        break;
                    case 2:
                        if (botones[i - 1][j].label == ' ' || botones[i - 1][j].label == '🦦') {
                            botones[i - 1][j].setLabel('🦁').setStyle('red').setID(botones[i - 1][j].custom_id + 'LEON');
                            botones[i][j].setLabel(' ').setStyle('grey');
                        }
                        break;
                    case 3:
                        if (botones[i][j + 1].label == ' ' || botones[i][j + 1].label == '🦦') {
                            botones[i][j + 1].setLabel('🦁').setStyle('red').setID(botones[i][j + 1].custom_id + 'LEON');
                            botones[i][j].setLabel(' ').setStyle('grey');
                        }
                        break;
                    case 4:
                        if (botones[i][j - 1].label == ' ' || botones[i][j - 1].label == '🦦') {
                            botones[i][j - 1].setLabel('🦁').setStyle('red').setID(botones[i][j - 1].custom_id + 'LEON');
                            botones[i][j].setLabel(' ').setStyle('grey');
                        }
                        break;
                }
            }
        }
    }
    if (botones[pos[0]][pos[1]].label == '🍍') {
        botones[pos[0]][pos[1]].setLabel('🦦').setStyle('blurple');
        return siguienteNivel(nivel, message);
    } else if (botones[pos[0]][pos[1]].style == 4) {
        botones[pos[0]][pos[1]].setLabel('☠');
        message.channel.send(`Has muerto :<`)
        botones = resetBotones(botones);
        return enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(nivel), nivel), nivel);
    }
    botones = resetBotones(botones);
    botones[pos[0]][pos[1]].setLabel('🦦').setDisabled(false);
    if (pos[0] < 4) botones[pos[0] + 1][pos[1]].setDisabled(false);
    if (pos[0] > 0) botones[pos[0] - 1][pos[1]].setDisabled(false);
    if (pos[1] < 4) botones[pos[0]][pos[1] + 1].setDisabled(false);
    if (pos[1] > 0) botones[pos[0]][pos[1] - 1].setDisabled(false);
    
}


async function siguienteNivel(nivel, message) {
    switch (nivel) {
        case 0:
            await escribir(message, `Has pasado el nivel 0 :0`)
            enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(1), 1), 1);
            break;
        case 1:
            await escribir(message, `Has pasado el nivel 1 :0`)
            enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(2), 2), 2);
            break;
        case 2:
            await escribir(message, `Has pasado el nivel 2 :0`)
            enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(3), 3), 3);
            break;
        case 3:
            await escribir(message, `Has pasado el nivel 3 :0`)
            enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(4), 4), 4);
            break;
        case 4:
            await escribir(message, `Has pasado el nivel 4 :0`)
            enviarBotones5x5(message, modMensajeCarcel(mensajeCarcel(5), 5), 5);
            break;
        case 5:
            await escribir(message, `Has pasado el nivel 5 :0`)
            client.user.setAvatar(urlAvatar);
            client.user.setUsername('Platypus')
            fase6(message, 5);
            break;
    }
}

function editarBotones5x5(message, botones) {
    var r0 = new disbut.MessageActionRow()
        .addComponents(botones[0][0], botones[0][1], botones[0][2], botones[0][3], botones[0][4])
    var r1 = new disbut.MessageActionRow()
        .addComponents(botones[1][0], botones[1][1], botones[1][2], botones[1][3], botones[1][4])
    var r2 = new disbut.MessageActionRow()
        .addComponents(botones[2][0], botones[2][1], botones[2][2], botones[2][3], botones[2][4])
    var r3 = new disbut.MessageActionRow()
        .addComponents(botones[3][0], botones[3][1], botones[3][2], botones[3][3], botones[3][4])
    var r4 = new disbut.MessageActionRow()
        .addComponents(botones[4][0], botones[4][1], botones[4][2], botones[4][3], botones[4][4])
    message.edit(message.content, { components: [r0, r1, r2, r3, r4] })
}
function enviarBotones5x5(message, botones, nivel) {
    var r0 = new disbut.MessageActionRow()
        .addComponents(botones[0][0], botones[0][1], botones[0][2], botones[0][3], botones[0][4])
    var r1 = new disbut.MessageActionRow()
        .addComponents(botones[1][0], botones[1][1], botones[1][2], botones[1][3], botones[1][4])
    var r2 = new disbut.MessageActionRow()
        .addComponents(botones[2][0], botones[2][1], botones[2][2], botones[2][3], botones[2][4])
    var r3 = new disbut.MessageActionRow()
        .addComponents(botones[3][0], botones[3][1], botones[3][2], botones[3][3], botones[3][4])
    var r4 = new disbut.MessageActionRow()
        .addComponents(botones[4][0], botones[4][1], botones[4][2], botones[4][3], botones[4][4])
    message.channel.send(`Nivel ${nivel}`, { components: [r0, r1, r2, r3, r4] })
}

client.on('clickButton', async (button) => {
    if (button.id.startsWith('regaloNat_15_')) {
        const id = button.id.split('_');
        if (id[2] == 't') {
            button.reply.defer();
            var b0 = button.message.components[0].components[0].setStyle('red').setDisabled()
            var b1 = button.message.components[0].components[1].setStyle('blurple').setDisabled()
            var b2 = button.message.components[0].components[2].setStyle('red').setDisabled()
            var b3 = button.message.components[0].components[3].setStyle('red').setDisabled()
            var b4 = button.message.components[0].components[4].setStyle('red').setDisabled()
            button.message.edit(button.message.content, { buttons: [b0, b1, b2, b3, b4] })
            await escribir(button.message, `Na de locos, como lo has sabido? xdd`);
            await escribir(button.message, `Mira mira`);
            button.message.channel.send(`https://media.discordapp.net/attachments/817486409157836850/897615412836069416/unknown.png`);
            return fase4(button.message, fase)
        } else {
            button.reply.defer();
            var b0 = button.message.components[0].components[0].setStyle('red').setDisabled()
            var b1 = button.message.components[0].components[1].setStyle('blurple').setDisabled()
            var b2 = button.message.components[0].components[2].setStyle('red').setDisabled()
            var b3 = button.message.components[0].components[3].setStyle('red').setDisabled()
            var b4 = button.message.components[0].components[4].setStyle('red').setDisabled()
            button.message.edit(button.message.content, { buttons: [b0, b1, b2, b3, b4] })
            await escribir(button.message, `Mmmm me lo esperaba, la edad te está afectando pero no pasa nada:)`)
            await escribir(button.message, `Mira mira`);
            button.message.channel.send(`https://media.discordapp.net/attachments/817486409157836850/897615412836069416/unknown.png`);
            return fase4(button.message, fase)
        }
    }
    if (button.id.startsWith('regaloNat2_15_')) {
        button.reply.defer();
        var b0 = button.message.components[0].components[0].setStyle('blurple').setDisabled()
        var b1 = button.message.components[0].components[1].setStyle('blurple').setDisabled()
        var b2 = button.message.components[0].components[2].setStyle('blurple').setDisabled()
        button.message.edit(button.message.content, { buttons: [b0, b1, b2] })
        await escribir(button.message, `Increible :0`);
        await escribir(button.message, `La verdad que las 3 eran correctas jsjs`);
        await escribir(button.message, `Hoy soñé que me querías dejar :'>`);
        await escribir(button.message, `Bueno, ahora te doy el regalo`);
        await timeout(2)
        await escribir(button.message, `Voy eh...`)
        await timeout(2)
        await escribir(button.message, `Uy`)
        await escribir(button.message, `Un momento que llaman a la puerta, vengo en nada esperame <3`)
        await timeout(2)
        client.user.setAvatar(urlAvatarFbi);
        client.user.setUsername('FBI').catch(() => { client.user.setUsername('FBI🕵️') })
        return fase5(button.message, fase)
    }
    if (button.id.startsWith('regaloNatCarcel_15_')) {
        button.reply.defer();
        const id = button.id.split('_');
        var botones = [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]];
        for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
                botones[i][j] = button.message.components[i].components[j]
            }
        }
        moverNutria(botones, id[2], button.message, parseInt(id[3]));
        editarBotones5x5(button.message, botones);
    }
})

async function escribir(message, texto) {
    message.channel.startTyping();
    await timeout(texto.length/7.77);
    message.channel.stopTyping();
    return message.channel.send(texto);
}
function timeout(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}

module.exports = { saludo };