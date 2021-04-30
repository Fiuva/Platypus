const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["REACTION", "MESSAGE", "USER"] });

client.login(process.env.token);


const mongoose = require('mongoose');
const user = 'prueba';
const password = process.env.password;
const dbname = 'Platypus'
const uri = `mongodb+srv://${user}:${password}@cluster0.mc7yn.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e));

const express = require('express');
const Usuario = require('./models/usuario');


const router = express.Router();

var date = new Date();
const nExp = 1;
const aumentaNivel = 10;
const aumentaMonedas = 25;
const precioAnillo = 30;
const precioMillonario = 2000;


const Canvas = require('canvas');
Canvas.registerFont("./Fonts/Impacted.ttf", { family: "Impacted" });
const { findOneAndUpdate, count } = require('./models/usuario');

const nombreMonedas = 'PlatyCoins';
const idMillonario = '836992600979669057';
const idMod = '836950934806069299';
const idAdmin = '836950360782143529';
const idMaltratador = '837016264421408850';
const idBrawlStars = '836877776422305822';
const idSub = '837346304517865532';

const voiceCId = '836957406599577631';
const idVDuo = '836991033208078428';
const idVTrio = '836991104754253836';
const idVCuarteto = '836991178717134877';
const idVQuinteto = '836991212124241941';

client.on('ready', () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
    client.user.setStatus('online');
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    if (oldUserChannel != newUserChannel) {
        if (oldUserChannel == undefined && newUserChannel != undefined) {
            //ENTRAR (a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
        } else if (newUserChannel == undefined) {
            //SALIR (de oldUserChannel)
            eliminarCanalDeVoz(oldUserChannel);
        } else {
            //CAMBIAR (de oldUserChannel a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
            eliminarCanalDeVoz(oldUserChannel);
        }
    }

    function crearCanalDeVoz(idCanalEntrante) {
        if (idCanalEntrante != idVDuo && idCanalEntrante != idVTrio && idCanalEntrante != idVCuarteto && idCanalEntrante != idVQuinteto) return;
        var nombreNuevoCanal;
        var limiteUsuarios;
        switch (idCanalEntrante) {
            case idVDuo:
                nombreNuevoCanal = "D\u00fao de " + newMember.member.user.username;
                limiteUsuarios = 2;
                break;
            case idVTrio:
                nombreNuevoCanal = "Tr\u00edo de " + newMember.member.user.username;
                limiteUsuarios = 3;
                break;
            case idVCuarteto:
                nombreNuevoCanal = "Squad de " + newMember.member.user.username;
                limiteUsuarios = 4;
                break;
            case idVQuinteto:
                nombreNuevoCanal = "Quinteto de " + newMember.member.user.username;
                limiteUsuarios = 5;
                break;
        }
        newMember.guild.channels.create(nombreNuevoCanal, {
            type: 'voice'
        }).then((channel) => {
            channel.setParent(voiceCId);
            channel.setUserLimit(limiteUsuarios);
            newMember.setChannel(channel);
        })
    }
    function eliminarCanalDeVoz(CanalSaliente) {
        if (!CanalSaliente.name.startsWith("D\u00fao de ") && !CanalSaliente.name.startsWith("Tr\u00edo de ") && !CanalSaliente.name.startsWith("Squad de ") && !CanalSaliente.name.startsWith("Quinteto de ")) return;
        if (CanalSaliente.members.size == 0) {
            CanalSaliente.delete();
        }
    }
})

client.on('guildMemberAdd', member => {
    ; (async () => {
        member.guild.channels.cache.get("837367366227853423").setName('Ornitorrincos: ' + member.guild.memberCount);
        const canvas = Canvas.createCanvas(1600, 814);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./platyWall.jpg');
        let x = 0;
        let y = 0;
        ctx.drawImage(background, x, y);

        ctx.font = '125px "Impacted"';
        //Rectangulo letras____________________________
        ctx.fillStyle = '#00000088';
        //ctx.fillRect(0, 320, 135 + ctx.measureText(member.user.username).width, 165); //730 + message.author.username.length * 53.5
        //_____________________________________________0 320 1000 165
        ctx.fillStyle = '#000000';
        ctx.fillText(`${member.user.username}!`, 50, 275);
        ctx.fillText(`Bienvenido`, 50, 135);
        ctx.fillStyle = '#ECCCFF';
        ctx.fillText(`${member.user.username}!`, 65, 265);
        ctx.fillText(`Bienvenido`, 65, 125);

        ctx.beginPath();
        ctx.arc(1380, 595, 200, 0, Math.PI * 2, true); //1700, 250, 250
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 1215, 430, 330, 330); //1500, 50, 400, 400

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'imagenDeBienvenida.png');
        member.guild.channels.cache.get("836730119023493140").send(`**Bienvenid@ ${member.user}, que lo pases bien!** 🤤`, attachment);
    })()
})
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get("837367366227853423").setName('Ornitorrincos: ' + member.guild.memberCount);
    member.guild.channels.cache.get("836730119023493140").send(`${member.user} ha abandonado la familia de ornitorrincos :'<`);
})
client.on('messageReactionAdd', (reaction, user) => {
    let emoji = reaction.emoji;
    if (reaction.message.id == '837347810705539173') {
        if (emoji.name == '⭐') {
            reaction.message.guild.members.cache.get(user.id).roles.add(idBrawlStars);
        } else if (emoji.name == '💥') {
            reaction.message.guild.members.cache.get(user.id).roles.add(idSub);
        } else {
            reaction.remove(user);
        }
    }
})
client.on('messageReactionRemove', (reaction, user) => {
    let emoji = reaction.emoji;
    if (reaction.message.id == '837347810705539173') {
        if (emoji.name == '⭐') {
            reaction.message.guild.members.cache.get(user.id).roles.remove(idBrawlStars);
        }
        if (emoji.name == '💥') {
            reaction.message.guild.members.cache.get(user.id).roles.remove(idSub);
        }
    }
})

client.on('message', message => {
    if (message.author.bot) return;
    if (msg() == '!timeout' && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(idMaltratador)) {
                var tiempo = 10;
                if (msg(2, 3)) {
                    if (Number(msg(2, 3))) {
                        tiempo = Number(msg(2, 3));
                    }
                }
                toUser.roles.add(idMaltratador).then(() => {
                    setTimeout(function () {
                        toUser.roles.remove(idMaltratador);
                    }, (tiempo * 60 * 1000));
                });
                message.channel.send(`${toUser} ha sido enviado a la cárcel durante ${tiempo} minutos`);
                toUser.send(`${toUser} te han puesto un timeout de ${tiempo} minutos, revisa bien las **normas** para que no vuelva a ocurrir. Ahora solo tendrás disponible la cárcel en este tiempo. Si crees que ha sido un malentendido, habla con los moderadores. Si el timeout no se te quita en ${tiempo} minutos (por posible mantenimiento inesperado del bot) pídelo en el canal de la cárcel :>`);
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        }
    }
    if (msg() == '!ban' && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(idMaltratador)) {
                toUser.roles.add(idMaltratador);
                message.channel.send(`${toUser} ha sido enviado a la cárcel permanentemente`);
                toUser.send(`${toUser} has sido **baneado** de el server de **Fiuva**, ahora solo tendrás disponible la cárcel y poco más, si te sientes arrepentido/a o crees que ha podido ser un error, puedes hablar con los **moderadores** sobre tu situación y se intentará **solucionar** (siempre con respeto :>) es importante hacer caso a las **normas**`);
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        }
    }
    if (msg() == '!unban' || msg() == '!untimeout' && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (toUser.roles.cache.has(idMaltratador)) {
                toUser.roles.remove(idMaltratador);
                message.channel.send(`${toUser} ha sido liberad@`);
            } else {
                message.channel.send(`${toUser} no está en la carcel`);
            }
        }
    }
    if (message.channel.id != 836721843955040339 && message.channel.id != 836879630815985674) return;

    if (message.channel.id == 836721843955040339) {
        if (msg()) {
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                var nivel = 0;
                var calcularExp = 0;
                var lim = user[0].expTotal;
                for (nivel; calcularExp < lim; nivel++) {
                    calcularExp = calcularExp + (nivel + 1) * aumentaNivel;
                }
                let doc = await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { expTotal: user[0].expTotal + nExp }, { new: true });
                doc.save();
                if (user[0].expTotal + 1 == calcularExp) {
                    let doc = await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { monedas: user[0].monedas + aumentaMonedas }, { new: true });
                    doc.save();
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
                            message.member.roles.add(message.guild.roles.cache.get('836946505490366514'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946511199207435'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Cerdo Rotatorio`);
                            modificarMonedas(message.author.id, 40);
                            break;
                        case 30:
                            message.member.roles.add(message.guild.roles.cache.get('836946499023142992'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946505490366514'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Lechuzo Inverso :>`);
                            modificarMonedas(message.author.id, 60);
                            break;
                        case 40:
                            message.member.roles.add(message.guild.roles.cache.get('836946491733573662'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946499023142992'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Mamífero Ovíparo`);
                            modificarMonedas(message.author.id, 100);
                            break;
                        case 50:
                            message.member.roles.add(message.guild.roles.cache.get('836946484376502282'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946491733573662'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Ornitorrinco Venenso`);
                            modificarMonedas(message.author.id, 100);
                            break;
                        case 60:
                            message.member.roles.add(message.guild.roles.cache.get('836946476647186499'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946484376502282'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres una Nutria Sudorosa <3`);
                            modificarMonedas(message.author.id, 150);
                            break;
                        case 70:
                            message.member.roles.add(message.guild.roles.cache.get('836946467469918269'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946476647186499'));
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
            })().catch(e => {
                new Usuario({ idDiscord: message.author.id, expTotal: 0 }).save().then();
            });
        }
        if (msg() === '!casar') {
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                var toUser = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                if (message.author.id == message.mentions.users.first().id) {
                    message.channel.send(`${message.author} no puedes casarte con extraterrestres`);
                    return;
                } else if (user[0].parejaId == '0' && toUser[0].parejaId == '0' && user[0].anillo >= 2) {
                    message.channel.send(`${message.author.username} se quiere casar con ${message.mentions.users.first().username}, aceptas?`).then(message2 => {
                        message2.react('✅');
                        message2.react('❌');
                        message2.awaitReactions((reaction, user) => user.id == message.mentions.users.first().id && (reaction.emoji.name == '❌' || reaction.emoji.name == '✅'),
                            { max: 1, time: 30000 }).then(collected => {
                                if (collected.first().emoji.name == '❌') {
                                    message.channel.send(`${message.mentions.users.first().username} te ha rechazado ${message.author.username}`);
                                    message2.delete();
                                }
                                else {
                                    date = new Date();
                                    var dia = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                                    message.channel.send(`${message.author} se ha casado con ${message.mentions.users.first()}!!!`);
                                    Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { parejaId: message.mentions.users.first().id, anillo: user[0].anillo - 1, fechaPareja: dia }, { new: true }).then();
                                    Usuario.findOneAndUpdate({ idDiscord: message.mentions.users.first().id }, { parejaId: message.author.id, anillo: toUser[0].anillo + 1, fechaPareja: dia }, { new: true }).then(message2.delete());
                                }
                            }).catch(() => {
                                message2.delete();
                            });
                    })
                } else if (user[0].parejaId != '0') {
                    message.channel.send(`${message.author} ya tienes a ${message.guild.members.cache.get(user[0].parejaId)} como pareja, para poder casarte con otra persona, divorciate antes`);
                } else if (toUser[0].parejaId != '0') {
                    message.reply(`${message.mentions.users.first().username} ya tiene pareja`);
                } else {
                    message.channel.send(`${message.author} necesitas dos anillos para casarte, ve a la tienda`);
                }
            })().catch(e => message.channel.send(`${message.author} menciona a quien quieres enviar tu solicitud para casarte`));
        }
        if (msg() === '!divorciar' || msg() === '!divorcio') {
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                if (user[0].parejaId === '0') {
                    message.channel.send(`${message.author} no estás casad@`);
                } else {
                    if (user[0].monedas < 100) {
                        message.channel.send(`${message.author} necesitas 100 ${nombreMonedas} para divorciarte`);
                    } else {
                        message.channel.send(`${message.author} seguro que te quieres divorciar de ${message.guild.members.cache.get(user[0].parejaId)} y dejar a los 7 niños abandonados? \n (100 ${nombreMonedas})`).then(message2 => {
                            message2.react('✅');
                            message2.react('❌');
                            message2.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '✅'),
                                { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == '❌') {
                                        message.reply('divorcio cancelado');
                                        message2.delete();
                                    }
                                    else {
                                        message.channel.send(`${message.author} a decidido dejar la relación con ${message.guild.members.cache.get(user[0].parejaId)}`);
                                        Usuario.findOneAndUpdate({ idDiscord: user[0].parejaId }, { solicitudId: '0', parejaId: '0', fechaPareja: '0' }, { new: true }).then();
                                        Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { solicitudId: '0', parejaId: '0', monedas: user[0].monedas - 100, fechaPareja: '0' }, { new: true }).then(message2.delete());
                                    }
                                }).catch(() => {
                                    message2.delete();
                                });
                        })
                    }
                }
            })().catch(e => message.channel.send(`${message.author} error`));
        }
    } else {
        if (msg() === '!rank') {
            ; (async () => {
                var username;
                var user;
                if (msg(1, 2)) {
                    user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                    username = message.mentions.users.first();
                }
                else {
                    user = await Usuario.find({ idDiscord: message.author.id }).exec();
                    username = message.author;
                }
                var expActual = user[0].expTotal;
                var nivel = 0;
                var calcularExp = 0;
                for (nivel; calcularExp < expActual + 1; nivel++) {
                    calcularExp = calcularExp + (nivel + 1) * aumentaNivel;
                }
                var calcularExpAnterior = calcularExp - nivel * aumentaNivel;
                nivel--;

                const canvas = Canvas.createCanvas(1920, 480);
                const ctx = canvas.getContext('2d');
                const color = user[0].color;


                ctx.fillStyle = '#99aab5';
                roundRect(ctx, 0, 0, 1920, 480, 40, true);
                //Rectangulos____________________________
                ctx.fillStyle = '#000000aa';
                roundRect(ctx, 25, 25, 1290, 430, 40, true);
                roundRect(ctx, 1340, 25, 555, 202.5, 40, true);
                roundRect(ctx, 1340, 252.5, 555, 202.5, 40, true);

                roundRect(ctx, 1390, 328.75, 455, 90, 15, true);
                roundRect(ctx, 1390, 101.25, 455, 90, 15, true);
                roundRect(ctx, 25, 430, 1290, 25, 40, true, true, true);
                ctx.fillStyle = color;
                roundRect(ctx, 25, 430, ((expActual - calcularExp) / (calcularExp - calcularExpAnterior) + 1) * 1290, 25, 40, true, true, true);
                //_____________________________________________
                ctx.font = 'bold 100px "Impacted"';
                ctx.fillStyle = '#ffffffaa';
                const ordenado = await Usuario.find({}).sort({ expTotal: -1 }).exec();
                for (i = 0; i < ordenado.length; i++) {
                    if (ordenado[i].idDiscord == username.id) {
                        ctx.fillText(`#${i + 1}`, 1030, 370);
                        break;
                    }
                }
                ctx.font = 'bold 100px Arial';
                ctx.fillStyle = color;
                ctx.fillText(`${username.username}`, 450, 150);
                var mensajePareja;
                var y;
                if (user[0].parejaId == '0') {
                    mensajePareja = '*solter@*';
                    y = 350;
                    ctx.fillStyle = '#ffffff88';
                } else {
                    ctx.font = '55px Arial';
                    mensajePareja = message.guild.members.cache.get(user[0].parejaId).user.username;
                    y = 250;
                    date = new Date();
                    let fecha1 = new Date(user[0].fechaPareja);
                    let restaFechas = date.getTime() - fecha1.getTime();
                    var diasCasados = Math.round(restaFechas / (1000 * 60 * 60 * 24));
                    ctx.fillStyle = '#00000033';
                    roundRect(ctx, 440, 290, 180 + ctx.measureText(diasCasados).width, 90, 20, true);
                    ctx.fillStyle = '#ffffffaa';
                    ctx.fillText(`D\u00edas: ${diasCasados}`, 450, 350);
                    if (diasCasados >= 150) {
                        ctx.fillStyle = '#37FF19'; //esmeralda
                    } else if (diasCasados >= 125) {
                        ctx.fillStyle = '#19EEFF'; //diamante
                    } else if (diasCasados >= 100) {
                        ctx.fillStyle = '#0035C7'; //lapislazul
                    } else if (diasCasados >= 75) {
                        ctx.fillStyle = '#E9FF00'; //oro
                    } else if (diasCasados >= 50) {
                        ctx.fillStyle = '#E40000'; //rojo
                    } else if (diasCasados >= 25) {
                        ctx.fillStyle = '#E7E7E7'; //plata
                    } else {
                        ctx.fillStyle = '#794B00'; //marron
                    }
                }
                ctx.font = 'bold 70px Arial';
                ctx.fillText(`Pareja: ` + mensajePareja, 450, y);
                ctx.font = 'bold 45px "Impacted"';
                ctx.fillStyle = '#ffffff88';
                ctx.fillText(`NIVEL`, 1570, 88.75);
                ctx.fillText(`EXP`, 1580, 316.25);
                ctx.font = '60px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(nivel, 1597 - ctx.measureText(nivel).width / 2 + 20, 162); // 1597 162
                ctx.font = '50px Arial';
                ctx.fillText(`${expActual}/${calcularExp}`, 1597 - ctx.measureText(`${expActual}/${calcularExp}`).width / 2 + 20, 385);
                ctx.font = 'italic 80px Arial';
                ctx.fillStyle = color + '88';
                ctx.fillText(`${username.tag.replace(username.username, '')}`, 440 + ctx.measureText(username.username).width * 1.4, 151.5);
                ctx.beginPath();
                ctx.arc(240, 240, 125, 0, Math.PI * 2, true); //ref1: 1700, 250, 200
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(username.displayAvatarURL({ format: 'jpg' }));
                ctx.drawImage(avatar, 115, 115, 250, 250); //ref1: 1500, 50, 400, 400
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'imagenRank.png');
                message.channel.send(attachment);
            })()
        }
        if (msg() === '!color') {
            var colorMensaje = msg(1, 2).toLowerCase();
            var colDef;
            if (colorMensaje.startsWith('#') && colorMensaje.length == 7) {
                colDef = colorMensaje;
            } else if (colorMensaje == 'azul') {
                colDef = '#0000FF';
            } else if (colorMensaje == 'blanco') {
                colDef = '#ffffff';
            } else if (colorMensaje == 'morado') {
                colDef = '#B400FF';
            } else if (colorMensaje == 'amarillo') {
                colDef = '#FFFF00';
            } else if (colorMensaje == 'rojo') {
                colDef = '#FF0000';
            } else if (colorMensaje == 'rosa') {
                colDef = '#FF00FF';
            } else if (colorMensaje == 'verde') {
                colDef = '#00ff00';
            } else if (colorMensaje == 'naranja') {
                colDef = '#FF7F00';
            } else if (colorMensaje == 'default') {
                colDef = '#7289da';
            }
            else {
                message.channel.send(`${message.author} escriba el codigo del color que desee (de esta forma: "#FFFFFF" o estos colores: azul, blanco, morado, amarillo, rojo, verde, naranja, rosa o default)`);
                return;
            }
            Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { color: colDef }, { new: true }).then();
            message.channel.send(`${message.author} se ha modificado su color de !rank correctamente`);
        }
        if (msg() === '!tienda') {
            ; (async () => {
                var userTienda = await Usuario.find({ idDiscord: message.author.id }).exec();
                const mensajeTienda = new Discord.MessageEmbed()
                    .setColor('#74d600')
                    .setTitle('Tienda')
                    .setAuthor('Server de Fiuva', message.guild.iconURL())
                    .setDescription(`Aquí puedes comprar cosas lechosas \n con las ${nombreMonedas} que has ganado`)
                    .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
                    .addFields(
                        { name: '💍 Anillo', value: `${precioAnillo} ${nombreMonedas}` },
                        { name: '💰 Rol Millonario', value: `${precioMillonario} ${nombreMonedas}` }
                    )
                    .addField('\u200B', '\u200B')
                    .setFooter(`${message.author.username} tienes ${userTienda[0].monedas} ${nombreMonedas}`, message.author.displayAvatarURL())
                message.channel.send(mensajeTienda).then(message2 => {
                    message2.react('💍');
                    message2.react('💰');
                    message2.react('❌');
                    tienda();
                    function tienda() {
                        message2.awaitReactions(filter = (reaction, user) => !user.bot && (reaction.emoji.name == '💍' || reaction.emoji.name == '💰' || (reaction.emoji.name == '❌' && user == message.author)),
                            { max: 1, time: 30000 }).then(async collected => {
                                if (collected.first().emoji.name == '❌') {
                                    message2.delete();
                                } else if (collected.first().emoji.name == '💍') {
                                    var idUserReaccion = message2.reactions.resolve('💍').users.cache.array()[1].id;
                                    var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                    var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                    var anillosReac = userReaccion[0].anillo;
                                    var monedasReac = userReaccion[0].monedas;
                                    if (anillosReac < 2 && monedasReac >= precioAnillo) {
                                        Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { anillo: anillosReac + 1, monedas: monedasReac - precioAnillo }, { new: true }).then();
                                        message.channel.send(`${authorReaccion.user} ha comprado un anillo`);
                                    }
                                    else if (anillosReac >= 2) {
                                        message.channel.send(`${authorReaccion.user} ya has tienes el máximo de anillos (2)`);
                                    } else {
                                        message.channel.send(`${authorReaccion.user} no tienes suficientes ${nombreMonedas}`);
                                    }
                                    message2.reactions.resolve('💍').users.remove(idUserReaccion).then(tienda);
                                } else if (collected.first().emoji.name == '💰') {
                                    var idUserReaccion = message2.reactions.resolve('💰').users.cache.array()[1].id;
                                    var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                    var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                    var monedasReac = userReaccion[0].monedas;
                                    if (authorReaccion.roles.cache.has(idMillonario)) {
                                        message.channel.send(`${authorReaccion.user} ya tienes el rol de millonario`)
                                    } else if (monedasReac < precioMillonario) {
                                        message.channel.send(`${authorReaccion.user} no tienes suficientes ${nombreMonedas}`)
                                    } else {
                                        Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { monedas: monedasReac - precioMillonario }, { new: true }).then();
                                        var rolMill = message.guild.roles.cache.get(idMillonario);
                                        authorReaccion.roles.add(rolMill);
                                        message.channel.send(`${authorReaccion.user} ahora es millonario!!!`);
                                    }
                                    message2.reactions.resolve('💰').users.remove(idUserReaccion).then(tienda);
                                }
                            }).catch(() => {
                                message2.delete()
                            });
                    }
                })
            })()

        }
        if (msg() === '!vender') {
            const mensajeTienda = new Discord.MessageEmbed()
                .setColor('#AB0101')
                .setTitle('Vender')
                .setAuthor('Server de Fiuva', message.guild.iconURL())
                .setDescription(`Aquí puedes vender maravillas \n y recuperar ${nombreMonedas}`)
                .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
                .addFields(
                    { name: 'Vender: Anillo', value: `${precioAnillo - 5} ${nombreMonedas}` }
                    //{ name: 'tremenda', value: 'aberracion de prueba', inline: true },
                )
            message.channel.send(mensajeTienda).then(message2 => {
                message2.react('💍');
                message2.react('❌');
                venta();
                function venta() {
                    message2.awaitReactions(filter = (reaction, user) => !user.bot && (reaction.emoji.name == '💍' || (reaction.emoji.name == '❌' && user == message.author)),
                        { max: 1, time: 30000 }).then(async collected => {
                            if (collected.first().emoji.name == '❌') {
                                message2.delete();
                            } else if (collected.first().emoji.name == '💍') {
                                var idUserReaccion = message2.reactions.resolve('💍').users.cache.array()[1].id;
                                var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                var anillosReac = userReaccion[0].anillo;
                                var monedasReac = userReaccion[0].monedas;
                                if (anillosReac > 0) {
                                    Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { anillo: anillosReac - 1, monedas: monedasReac + (precioAnillo - 5) }, { new: true }).then();
                                    message.channel.send(`${authorReaccion.user} has ganado ${precioAnillo - 5} ${nombreMonedas} por vender un anillo`);
                                } else {
                                    message.channel.send(`${authorReaccion.user} no tienes anillos para vender`);
                                }
                                message2.reactions.resolve('💍').users.remove(idUserReaccion).then(venta);
                            }
                        }).catch(() => {
                            message2.delete()
                        });
                }
            })
        }
        if (msg() === '!inventario') {
            ; (async () => {
                var username;
                var user;
                if (msg(1, 2)) {
                    user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                    username = message.mentions.users.first();
                }
                else {
                    user = await Usuario.find({ idDiscord: message.author.id }).exec();
                    username = message.author;
                }

                var mensajeInventario = new Discord.MessageEmbed()
                    .setColor(user[0].color)
                    .setTitle('Inventario')
                    .setAuthor(username.username, username.displayAvatarURL({ format: 'jpg' }))
                    .setDescription(`Contempla el hermoso inventario de ${username.username}`)
                    .addFields(
                        { name: `Banco: `, value: `${user[0].monedas} ${nombreMonedas}` },
                        { name: 'Anillos: ', value: `${user[0].anillo}` },
                    )
                message.channel.send(mensajeInventario)
            })()
        }
        if (msg() === '!addpc' && message.author.id == 431071887372845061) {
            ; (async () => {
                message.delete();
                if (msg(1, 2).startsWith('<@')) {
                    var user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                    username = message.mentions.users.first();
                    var monedasAntes = user[0].monedas;
                    if (!isNaN(parseInt(msg(2, 3)))) {
                        Usuario.findOneAndUpdate({ idDiscord: user[0].idDiscord }, { monedas: monedasAntes + parseInt(msg(2, 3)) }, { new: true }).then(message.channel.send(`${message.author}: Se han añadido ${msg(2, 3)} ${nombreMonedas} a ${message.mentions.users.first()} (Antes: ${monedasAntes} -> __Ahora: ${monedasAntes + parseInt(msg(2, 3))}__) | _Razón:_ **${msg(3, 20, true) || 'Porque sí xd'}**`));
                    } else {
                        message.channel.send(`${message.author}: añadir ${nombreMonedas} !addpc <@user> <lerdocoins> [razón]`);
                    }
                } else {
                    message.channel.send(`${message.author}: añadir ${nombreMonedas} !addpc <@user> <lerdocoins> [razón]`);
                }
            })()
        }
        if (msg() == '!top' || msg() == '!lb' || msg() == '!ranking') {
            Usuario.find({}).sort({ expTotal: -1 }).exec(function (err, docs) {
                var top = new Discord.MessageEmbed()
                    .setTitle(message.guild.name)
                    .setThumbnail(message.guild.iconURL())
                    .setColor('#FFCB00')
                    .setDescription(`Este es el top de 10 personas más activas :sparkles:`)
                    .addFields(
                        { name: `:first_place: :white_small_square: ${message.guild.members.cache.get(docs[0].idDiscord).user.username}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[0].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[0].expTotal}/${calcularNivel(docs[0].expTotal)[1]}\`` },
                        { name: `:second_place: :white_small_square: ${message.guild.members.cache.get(docs[1].idDiscord).user.username}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[1].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[1].expTotal}/${calcularNivel(docs[1].expTotal)[1]}\`` },
                        { name: `:third_place: :white_small_square: ${message.guild.members.cache.get(docs[2].idDiscord).user.username}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[2].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[2].expTotal}/${calcularNivel(docs[2].expTotal)[1]}\`` }
                    )
                for (i = 3; i < 10; i++) {
                    top.addFields(
                        { name: `#${i + 1} :white_small_square: ${message.guild.members.cache.get(docs[i].idDiscord).user.username}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[i].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[i].expTotal}/${calcularNivel(docs[i].expTotal)[1]}\`` }
                    )
                }
                message.channel.send(top);
            });
        }
        if (msg() === '!ayuda' || msg() === '!help' || msg() === '!comandos') {
            const mensajeAyuda = new Discord.MessageEmbed()
                .setColor('#FEA0FA')
                .setTitle('COMANDOS')
                .setAuthor('PLATYPUS', 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png')
                .setDescription(`Veo que necesitas ayuda`)
                .addFields(
                    { name: '#〔🦦〕comandos-platypus', value: `- - - - - - - - - - - - - - - - - -` },
                    { name: '!rank', value: `Mira tu nivel de experiencia`, inline: true },
                    { name: '!color', value: `Cambia tu color de !rank`, inline: true },
                    { name: '!top', value: `El ranking de la gente más activa del server` },
                    { name: '!tienda', value: `Compra cosas en la tienda con ${nombreMonedas}` },
                    { name: '!vender', value: `Vende anillos :>` },
                    { name: '!inventario', value: `Consulta tu inventario`, inline: true },
                    { name: '#〔💬〕general', value: `- - - - - - - - - - - -` },
                    { name: '!casar', value: `Cásate con alguien`, inline: true },
                    { name: '!divorciar', value: `Divórciate`, inline: true },
                    { name: 'Nivel', value: `Gana **experiencia** siendo activo en el chat para conseguir ${nombreMonedas} \n y consigue **roles** en función de tu nivel` },
                );
            message.channel.send(mensajeAyuda);
        }
    }
    function msg(c = 0, f = 1, same = false) {
        if (same) {
            return message.content.split(' ').slice(c, f).join(' ');
        }
        else {
            return message.content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }
})

function calcularNivel(experienciaTotal) {
    var expActual = experienciaTotal;
    var nivel = 0;
    var calcularExp = 0;
    for (nivel; calcularExp < expActual + 1; nivel++) {
        calcularExp = calcularExp + (nivel + 1) * aumentaNivel;
    }
    nivel--;
    return [nivel, calcularExp];
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

async function modificarMonedas(id, sumar) {
    var user = await Usuario.find({ idDiscord: id }).exec();
    await Usuario.findOneAndUpdate({ idDiscord: id }, { monedas: user[0].monedas + sumar }, { new: true });
}

