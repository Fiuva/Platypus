const { AUMENTA_NIVEL, CONFIG, AUMENTAR_MONEDAS_NIVEL } = require("../config/constantes");
const Usuario = require("../models/usuario");
const { ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { ButtonStyle } = require("../node_modules/discord-api-types/v10");
const Genius = require("genius-lyrics");
const Client = new Genius.Client();

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
    deepEqual,
    getMentionOrUser,
    createRegaloRandom,
    shuffle,
    add_data,
    createDataInc,
    getCommandOptionsUser,
    getInteractionUser,
    buscarCancion
}

function getCommandOptionsUser(interaction) {
    try {
        return interaction.options.getUser('usuario')
    } catch {
        return null;
    }
}
function getCommandOptionsMember(interaction) {
    try {
        return interaction.options.getMember('usuario')
    } catch {
        return null;
    }
}

function getInteractionUser(interaction, errorIfBaboso = `Yo no tengo perfil :'<`, notSelf = false, returnMember = false) {
    if (returnMember) {
        var author = getCommandOptionsMember(interaction) || interaction.member;
    } else {
        var author = getCommandOptionsUser(interaction) || interaction.user;
    }
    if (notSelf && author.id == interaction.user.id)
        throw new Error(`No puedes mencionarte a ti mismo`)
    if (author.id === "836972868055203850")
        throw new Error(errorIfBaboso)
    if (!interaction.guild.members.cache.has(author.id))
        throw new Error(`No puedes jugar con alguien que no está en el server, invítala si quieres jugar: https://discord.gg/NJf5ewazMk`)
    return author
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
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
            calcularExp = calcularExp + (nivel + 17) + AUMENTA_NIVEL * 13;
        }
        if (calcularExp < expActual + 1) calcularExpAnterior = calcularExp;
    }
    nivel--;
    return { nivel, calcularExp, calcularExpAnterior };
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
    var user = await findOrCreateDocument(message.author.id, Usuario);
    var lim = user.expTotal;
    const calcularNivelConst = calcularNivel(lim - 1);
    var nivel = calcularNivelConst.nivel + 1;
    var calcularExp = calcularNivelConst.calcularExp;

    await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { expTotal: user.expTotal + 1 });
    if (user.expTotal + 1 == calcularExp) {
        var monedasGanadas = AUMENTAR_MONEDAS_NIVEL;
        var embed = new EmbedBuilder();
        var texto = null;
        var roles = {
            nuevo: null,
            viejo: null
        };
        switch (nivel) {
            case 2:
                roles.nuevo = '836941894474268763';
                texto = `Felicidades! ${message.author}, ahora eres una increíble **Rata de Agua**`;
                break;
            case 5:
                roles.nuevo = '836946522293272596';
                roles.viejo = '836941894474268763';
                texto = `Felicidades! ${message.author}, ahora eres un **Ornitorrinco Bebé**`;
                break;
            case 10:
                roles.nuevo = '836946511199207435';
                roles.viejo = '836946522293272596';
                texto = `Felicidades! ${message.author}, ahora eres una **Nutria Principiante** 🦦`;
                break;
            case 20:
                roles.nuevo = '836946476647186499';
                roles.viejo = '836946511199207435';
                texto = `Felicidades! ${message.author}, ahora eres un **Ornitorrinco Explorador** 🤠`;
                monedasGanadas += 40;
                break;
            case 30:
                roles.nuevo = '836946505490366514';
                roles.viejo = '836946476647186499';
                texto = `Felicidades! ${message.author}, ahora eres un **Cazador de Ornitorrincos** 🗡️`;
                monedasGanadas += 60;
                break;
            case 40:
                roles.nuevo = '836946499023142992';
                roles.viejo = '836946505490366514';
                texto = `Felicidades! ${message.author}, ahora eres un **Tigre Compacto** 🐯`;
                monedasGanadas += 100;
                break;
            case 50:
                roles.nuevo = '836946491733573662';
                roles.viejo = '836946499023142992';
                texto = `Felicidades! ${message.author}, ahora eres un **Lechuza Nocturna** 🦉`;
                monedasGanadas += 100;
                break;
            case 60:
                roles.nuevo = '836946484376502282';
                roles.viejo = '836946491733573662';
                texto = `Felicidades! ${message.author}, ahora eres una **Ornitorrinco Lloroso** :<`;
                monedasGanadas += 150;
                break;
            case 70:
                roles.nuevo = '836946467469918269';
                roles.viejo = '836946484376502282';
                texto = `Felicidades! ${message.author}, ahora eres un **Ornitorrinco Maestro**`;
                monedasGanadas += 250;
                break;
            case 80:
                roles.nuevo = '836946433806041138';
                roles.viejo = '836946467469918269';
                texto = `Felicidades! ${message.author}, ahora eres un **Ornitorrinca divina**`;
                monedasGanadas += 500;
                break;
            case 90:
                roles.nuevo = '836946423139794955';
                roles.viejo = '836946433806041138';
                texto = `Felicidades! ${message.author}, ahora eres un **Ornitorrinco Místico**`;
                monedasGanadas += 750;
                break;
            case 100:
                roles.nuevo = '836946407725334548';
                roles.viejo = '836946423139794955';
                texto = `Felicidades! ${message.author}, ahora eres una **Ornitorrinco de Leyenda**`;
                monedasGanadas += 1000;
                break;
            default:
                texto = `Felicidades! ${message.author}, has subido a nivel ${nivel}`;
                embed.setColor("#A1F975");
                break;
        }
        embed.setDescription(texto);
        modificarMonedas(message.author.id, monedasGanadas);
        if (roles.nuevo) {
            let roles_cache = message.guild.roles.cache;
            let nuevo_rol = roles_cache.get(roles.nuevo);
            message.member.roles.add(nuevo_rol);
            embed.setColor(nuevo_rol.hexColor);
            if (roles.viejo)
                message.member.roles.remove(roles_cache.get(roles.viejo));
        }
        message.channel.send({ embeds: [embed] });
    }
}

async function modificarMonedas(id, sumar, usuario = null, navidad = false) {
    if (!usuario) usuario = await findOrCreateDocument(id, Usuario);
    if (navidad)
        await Usuario.findOneAndUpdate({ idDiscord: id }, { pavos: usuario.pavos + sumar });
    else
        await Usuario.findOneAndUpdate({ idDiscord: id }, { monedas: usuario.monedas + sumar });
}

async function reenviarMensajeTo(msg, canal, refDelAutor = false) {
    await canal.send({
        content: `${refDelAutor ? `${msg.author}: ` : ''}${msg.content.length == 0 ? ' ' : msg.content}`,
        files: Array.from(msg.attachments.values())
    });
}

function calcularTiempoToAdd(date, fecha) {
    if (!fecha) return 0;
    //const fecha1 = new Date(fecha).getTime()
    var t = (date - fecha);
    if (t == date) { //Esto es imposible que pase, pero por si acaso
        t = 0;
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    }
    return t;
}

function createDataInc(fecha, statusAtributo) {
    if (fecha == null) return null;

    // Inicializar variables
    const cambios = [];
    const ultimaConexion = new Date(fecha);
    const dateObject = new Date();
    let tiempoTotal = dateObject.getTime() - ultimaConexion.getTime();
    let diaActual = dateObject.getDay();
    let horaActual = dateObject.getHours();

    // Añadir el tiempo de la última hora
    const anteriorUltimaHora = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), dateObject.getHours());
    const ultimaHora = Math.min(dateObject.getTime() - anteriorUltimaHora.getTime(), dateObject.getTime() - ultimaConexion.getTime());
    cambios.push({ dia: diaActual, hora: horaActual, value: ultimaHora });
    tiempoTotal -= ultimaHora;

    // Añadir el tiempo de las horas anteriores
    while (tiempoTotal > 0) {
        if (horaActual === 0) {
            horaActual = 23;
            if (diaActual === 0) {
                diaActual = 6;
            } else {
                diaActual--;
            }
        } else {
            horaActual--;
        }

        const valor = Math.min(3600000, tiempoTotal);
        cambios.push({ dia: diaActual, hora: horaActual, value: valor });
        tiempoTotal -= valor;
    }

    // Crear el objeto de datos incremental
    const dataInc = {};
    cambios.forEach((cambio) => {
        dataInc[`tiemposPorDia.${cambio.dia}.${cambio.hora}.${statusAtributo}`] = cambio.value;
    });
    return dataInc;
}

function add_data(data, data_to_add, tipo = "$inc") {
    if (data_to_add != null) {
        if (data[tipo])
            Object.assign(data[tipo], data_to_add)
        else
            data[tipo] = data_to_add
    }
    return data
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
function getMentionOrUser(message) {
    return message.mentions.users.first() || message.author;
}

Object.defineProperties(Array.prototype, {
    count: {
        value: function (value) {
            return this.filter(x => x == value).length;
        }
    }
});
function createRegaloRandom() {
    const emotes = {
        ornitorrinco: [
            "<:rechazado:1011314869691228241>",
            "<:platypusTarde:839396747008147487>",
            "<:platypusSaludo:839394513653858335>",
            "<:platypusRefachero:839042641945559051>",
            "<:platypusOro:839396299517853747>",
            "<:platypusNinja:839396877966639104>",
            "<:platypusLloroso:839396511833653268>",
            "<:platypusHambre:839397013623668756>",
            "<:platypusEnfadado:839397136235364393>",
            "<:platypusDudosoJesus:847563489521696788>",
            "<:platypus1:839393604867063848><:platypus2:839393726610538506>",
            "<:platypusPaulita:903974367468331038>",
            "<:baboso:1047514787065626724>",
            "<:platypusHez1:840339984128409602><:platypusHez2:840340006249037865>"
        ],
        getRandom(min = 1, max = 1) {
            return getMultipleRandom(this.ornitorrinco, (Math.random() * (max - min) << 0) + min)
        }
    }
    const emoteElegido = emotes.getRandom()[0];
    const emotesRandom = emotes.getRandom(20, 75);
    const premio = (Math.random() * 1000 << 0) + 100;
    let regalo = new EmbedBuilder()
        .setColor("#EBEF45")
        .setTitle('¡Has encontrado un regalo!')
        .setAuthor({ name: "Regalo", iconURL: "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f381.png" })
        .setDescription(emotesRandom.join(' ') + `\n\n**Cuántos ${emoteElegido} ves?**`)

    const numGanador = emotesRandom.count(emoteElegido);
    let posibles = [...Array(6).keys()].filter(a => a != numGanador);
    posibles = shuffle(posibles);

    let botones = [
        new ButtonBuilder()
            .setLabel(numGanador.toString())
            .setCustomId(`regalo_navidad_sum_${premio}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[0].toString())
            .setCustomId(`regalo_navidad_perdido_1`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[1].toString())
            .setCustomId(`regalo_navidad_perdido_2`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[2].toString())
            .setCustomId(`regalo_navidad_perdido_3`)
            .setStyle(ButtonStyle.Secondary)
    ]
    botones = shuffle(botones);
    var rowBotones = new ActionRowBuilder()
        .addComponents(botones[0], botones[1], botones[2], botones[3])

    return [regalo, rowBotones]

    function getMultipleRandom(arr, num) {
        let res = [];
        let l = arr.length
        for (var i = 0; i < num; i++)
            res.push(arr[Math.random() * l << 0]);
        return res;
    }
}

async function buscarCancion(titulo, interaction) {
    var mensInfo = await interaction.reply({ embeds: [new EmbedBuilder().setColor('#DED500').setDescription(`Obteniendo info de la canción...`)] });
    try {
        const searches = await Client.songs.search(titulo);
        const firstSong = await searches[0];
        if (firstSong) {
            var lyrics = await firstSong.lyrics();
            var embeds = [];

            var n = 2048;
            for (var i = 0; i < lyrics.length; i += n) {
                var trimmedString = lyrics.substring(i, i + 2048);
                if (trimmedString.length < 2048) trimmedString += "\n";
                n = Math.max(Math.min(trimmedString.length, trimmedString.lastIndexOf("\n")), 1000);
                if (i == 0) {
                    embeds.push(
                        new EmbedBuilder()
                            .setTitle(firstSong.title)
                            .setAuthor({ name: firstSong.artist.name, iconURL: firstSong.artist.thumbnail })
                            .setThumbnail(firstSong.thumbnail)
                            .setDescription(lyrics.substring(i, i + n))
                            .setURL(firstSong.url)
                            .setColor('#49D414')
                    );
                } else {
                    embeds.push(
                        new EmbedBuilder()
                            .setDescription(lyrics.substring(i, i + n))
                            .setColor('#49D414')
                    );
                }
            }

            embeds[embeds.length - 1].setTimestamp(new Date(`${firstSong._raw.release_date_for_display}`)).setFooter({ text: `Fecha de lanzamiento` });
            //---Enviar embeds de 6k como max
            var i = 0;
            var j = 0;
            var len = 0;
            var primerMensaje = true;
            while (i < embeds.length) {
                if (len + embeds[i].data.description.length <= 6000) {
                    len += embeds[i].data.description.length;
                    i++;
                    if (i < embeds.length) continue;
                    else {
                        if (primerMensaje) {
                            mensInfo.edit({ embeds: embeds.slice(j, i) });
                            primerMensaje = false;
                            break;
                        }
                        interaction.channel.send({ embeds: embeds.slice(j, i) });
                        break;
                    }
                }
                len = 0;
                if (primerMensaje) {
                    mensInfo.edit({ embeds: embeds.slice(j, i) });
                    primerMensaje = false;
                } else
                    interaction.channel.send({ embeds: embeds.slice(j, i) });
                j = i;
            }
            //----

        } else {
            mensInfo.edit({ embeds: [new EmbedBuilder().setColor('#DE2B00').setDescription(`Canción no encontrada :(`)] });
        }
    } catch {
        mensInfo.edit({ embeds: [new EmbedBuilder().setColor('#DE2B00').setDescription(`No se ha podido conectar con genius.com | Probablemente esté caída la página`)] });
    }

}
