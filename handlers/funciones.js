const { AUMENTA_NIVEL, CONFIG, AUMENTAR_MONEDAS_NIVEL } = require("../config/constantes");
const Usuario = require("../models/usuario");
const { ActivityType } = require("discord.js");

module.exports = {
    msg,
    calcularNivel,
    roundRect,
    cambiarEstadoConMensaje,
    subirExperiencia,
    reenviarMensajeTo,
    calcularTiempoToAdd,
    calcularPrecioVenta,
    findOrCreateDocument,
    random,
    modificarMonedas,
    sleep,
    deepEqual
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function random(array) {
    return array[Math.random() * array.length << 0];
}

function msg(message, c = 0, f = 1, same = false) {
    var content = message.content.replace(/\s+/g, ' ').trim();
    if (same) {
        return content.split(' ').slice(c, f).join(' ');
    }
    else {
        return content.split(' ').slice(c, f).join(' ').toLowerCase();
    }
}

function calcularNivel(experienciaTotal) {
    var expActual = experienciaTotal;
    var nivel = 0;
    var calcularExp = 0;
    var calcularExpAnterior;
    for (nivel; calcularExp < expActual + 1; nivel++) {
        if (nivel <= 17) {
            calcularExp = calcularExp + (nivel + 1) * AUMENTA_NIVEL;
        } else {
            calcularExp = calcularExp + (nivel + 17) + AUMENTA_NIVEL * 17;
        }
        if (calcularExp < expActual + 1) calcularExpAnterior = calcularExp;
    }
    nivel--;
    return [nivel, calcularExp, calcularExpAnterior];
}

function roundRect(ctx, x, y, width, height, radius = 5, fill, stroke = true, sinBordesArriba = false) {
    var r2;
    sinBordesArriba ? r2 = 0 : r2 = radius;
    ctx.beginPath();
    ctx.moveTo(x + r2, y);
    ctx.lineTo(x + width - r2, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r2);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + r2);
    ctx.quadraticCurveTo(x, y, x + r2, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

async function cambiarEstadoConMensaje(client) {
    const message = await client.channels.cache.get(CONFIG.CANAL_CONFIG).messages.fetch(CONFIG.MENSAJE_ESTADO)
    function msg(c = 0, f = 1, same = false) {
        var content = message.content.replace(/\s+/g, ' ').trim();
        if (same) {
            return content.split(' ').slice(c, f).join(' ');
        }
        else {
            return content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }
    var tipo;
    const mensaje = msg(0, 1000).replace('-p ', '').replace('-s ', '').replace('-w ', '').replace('-c ', '').replace('-l ', '').replace('-dnd ', '').replace('-inv ', '').replace('-idl ', '');
    if (msg(0, 100).match('-p')) {
        tipo = ActivityType.Playing;
    } else if (msg(0, 100).match('-s')) {
        client.user.setActivity(mensaje, {
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/fiuva2'
        })
        return;
    } else if (msg(0, 100).match('-w')) {
        tipo = ActivityType.Watching;
    } else if (msg(0, 100).match('-c')) {
        tipo = ActivityType.Competing;
    } else if (msg(0, 100).match('-l')) {
        tipo = ActivityType.Listening;
    } else {
        tipo = ActivityType.Custom;
        message.channel.send('!estado <-p, -c, -l, -w, -s>')
        return;
    }
    var status;
    if (msg(0, 100).match('-dnd')) {
        status = 'dnd';
    } else if (msg(0, 100).match('-inv')) {
        status = 'invisible';
    } else if (msg(0, 100).match('-idl')) {
        status = 'idle';
    } else {
        status = 'online';
    }
    client.user.setPresence({ activities: [{ name: mensaje, type: tipo }], status: status });
}

async function findOrCreateDocument(id, Modelo) {
    let user = (await Modelo.find({ idDiscord: id }))[0];
    if (!user) user = await new Modelo({ idDiscord: id }).save();
    return user;
}

async function subirExperiencia(message) {
    try {
        var user = await Usuario.find({ idDiscord: message.author.id }).exec();
        var lim = user[0].expTotal;
        const calcularNivelConst = calcularNivel(lim - 1);
        var nivel = calcularNivelConst[0] + 1;
        var calcularExp = calcularNivelConst[1];

        await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { expTotal: user[0].expTotal + 1 }, { new: true });
        if (user[0].expTotal + 1 == calcularExp) {
            await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { monedas: user[0].monedas + AUMENTAR_MONEDAS_NIVEL }, { new: true });
            switch (nivel) {
                case 2:
                    message.member.roles.add(message.guild.roles.cache.get('836941894474268763'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres una Hez (el singular de heces)`);
                    break;
                case 5:
                    message.member.roles.add(message.guild.roles.cache.get('836946522293272596'));
                    message.member.roles.remove(message.guild.roles.cache.get('836941894474268763'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres una Piña normal`);
                    break;
                case 10:
                    message.member.roles.add(message.guild.roles.cache.get('836946511199207435'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946522293272596'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Lechuzo Lloroso :'<`);
                    break;
                case 20:
                    message.member.roles.add(message.guild.roles.cache.get('836946476647186499'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946511199207435'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Cerdo Rotatorio`);
                    modificarMonedas(message.author.id, 40);
                    break;
                case 30:
                    message.member.roles.add(message.guild.roles.cache.get('836946505490366514'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946476647186499'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Lechuzo Inverso :>`);
                    modificarMonedas(message.author.id, 60);
                    break;
                case 40:
                    message.member.roles.add(message.guild.roles.cache.get('836946499023142992'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946505490366514'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Mamífero Ovíparo`);
                    modificarMonedas(message.author.id, 100);
                    break;
                case 50:
                    message.member.roles.add(message.guild.roles.cache.get('836946491733573662'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946499023142992'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Ornitorrinco Venenso`);
                    modificarMonedas(message.author.id, 100);
                    break;
                case 60:
                    message.member.roles.add(message.guild.roles.cache.get('836946484376502282'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946491733573662'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres una Nutria Sudorosa <3`);
                    modificarMonedas(message.author.id, 150);
                    break;
                case 70:
                    message.member.roles.add(message.guild.roles.cache.get('836946467469918269'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946484376502282'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Castor con sabor a vainilla`);
                    modificarMonedas(message.author.id, 250);
                    break;
                case 80:
                    message.member.roles.add(message.guild.roles.cache.get('836946433806041138'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946467469918269'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Roedor Profesional`);
                    modificarMonedas(message.author.id, 500);
                    break;
                case 90:
                    message.member.roles.add(message.guild.roles.cache.get('836946423139794955'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946433806041138'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres un Castor Sudoroso`);
                    modificarMonedas(message.author.id, 750);
                    break;
                case 100:
                    message.member.roles.add(message.guild.roles.cache.get('836946407725334548'));
                    message.member.roles.remove(message.guild.roles.cache.get('836946423139794955'));
                    message.channel.send(`Felicidades! ${message.author}, ahora eres una Ornitorrinca Lechosa 🤤`);
                    modificarMonedas(message.author.id, 1000);
                    break;
                default:
                    message.channel.send(`Felicidades! ${message.author}, has subido a nivel ${nivel}`);
                    break;
            }
        }
    } catch {
        await new Usuario({ idDiscord: message.author.id, expTotal: 0 }).save();
    }

}

async function modificarMonedas(id, sumar) {
    var user = await Usuario.find({ idDiscord: id }).exec();
    await Usuario.findOneAndUpdate({ idDiscord: id }, { monedas: user[0].monedas + sumar }, { new: true });
}

async function reenviarMensajeTo(msg, canal, refDelAutor = false) {
    await canal.send({
        content: `${refDelAutor ? `${msg.author}: ` : ''}${msg.content.length == 0 ? ' ' : msg.content}`,
        files: Array.from(msg.attachments.values())
    });
}

function calcularTiempoToAdd(date, fecha) {
    const fecha1 = new Date(fecha)
    var t = (date - fecha1);
    if (t == date.getTime()) {
        t = 0;
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    }
    return t;
}

function calcularPrecioVenta(precioCompra) {
    return Math.floor(precioCompra * (1 - 0.15));
}

function deepEqual(object1, object2) {
    if (!object1 || !object2)
        if (object1 == object2) return true;
        else return false;
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}