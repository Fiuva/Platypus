const { Calidad, MascotasData, Tipo_Huevo } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");
const { modificarMonedas, findOrCreateDocument } = require("../funciones");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { ButtonStyle, PermissionFlagsBits } = require("../../node_modules/discord-api-types/v10");
const { EVENTOS } = require("../../config/constantes");

const HUEVOS = {
    HUEVO_COMUN: {
        NOMBRE: "Huevo Común",
        TIPO: Tipo_Huevo.Normal,
        PROBABILIDAD: {
            COMUN: 0.45,
            ESPECIAL: 0.33,
            RARO: 0.145,
            ULTRA_RARO: 0.06,
            LEGENDARIO: 0.015
        },
        PRECIO: 52,
        EMOJI: '🥚',
        TIENDA: true
    },
    HUEVO_RARO: {
        NOMBRE: "Huevo Raro",
        TIPO: Tipo_Huevo.Normal,
        PROBABILIDAD: {
            COMUN: 0.20,
            ESPECIAL: 0.35,
            RARO: 0.27,
            ULTRA_RARO: 0.15,
            LEGENDARIO: 0.03
        },
        PRECIO: 90,
        EMOJI: '🐣',
        TIENDA: true
    },
    HUEVO_LEGENDARIO: {
        NOMBRE: "Huevo Legendario",
        TIPO: Tipo_Huevo.Normal,
        PROBABILIDAD: {
            COMUN: 0,
            ESPECIAL: 0.25,
            RARO: 0.37,
            ULTRA_RARO: 0.30,
            LEGENDARIO: 0.08
        },
        PRECIO: 217,
        EMOJI: '🪙',
        TIENDA: true
    },
    HUEVO_NAVIDAD: {
        NOMBRE: "Huevo Navideño 🎄",
        TIPO: Tipo_Huevo.Navidad,
        PROBABILIDAD: {
            COMUN: 0.37,
            ESPECIAL: 0.32,
            RARO: 0.215,
            ULTRA_RARO: 0.07,
            LEGENDARIO: 0.025
        },
        PRECIO: 500,
        EMOJI: '❄️',
        TIENDA: EVENTOS.NAVIDAD
    }
}

function nombreRol(mascotaElegida) {
    const nivelArray = calcularNivelMascota(mascotaElegida);
    if (nivelArray[0] == 5) nivelArray[0] = "Max";
    return `Pet: ${mascotaElegida.nombre}${mascotaElegida.nombre != mascotaElegida.animal.nombre ? ` - ${mascotaElegida.animal.nombre}『${nivelArray[0]}』` : `『${nivelArray[0]}』`}`;
}


function calcularNivelMascota(mascota) {
    var aumento, modo = 1;
    if (!mascota) return;
    switch (mascota.animal.calidad.nombre) {
        case Calidad.Comun.nombre:
            aumento = 10;
            break;
        case Calidad.Especial.nombre:
            aumento = 20;
            break;
        case Calidad.Raro.nombre:
            aumento = 40;
            break;
        case Calidad.Ultra_raro.nombre:
            aumento = 80;
            break;
        case Calidad.Legendario.nombre:
            aumento = 160;
            break;
    }
    if (mascota.animal.nombre.endsWith('✨')) {
        modo = 2;
    } else if (mascota.animal.nombre.endsWith('👑')) {
        modo = 3;
    }
    return calcularLvl(mascota.exp, aumento, modo);
}
function calcularLvl(experienciaTotal, aumento, modo = 1) { //10, 20, 40, 80, 160
    var expActual = experienciaTotal;
    var nivel = 0;
    var calcularExp = 0;
    var calcularExpAnterior;
    for (nivel; calcularExp < expActual + 1; nivel++) {
        calcularExp = calcularExp + (nivel + modo) * aumento;
        if (calcularExp < expActual + 1) calcularExpAnterior = calcularExp;
    }
    nivel--;
    return [nivel, calcularExp, calcularExpAnterior];
}

async function subirExpMascota(message, member = message.member) {
    var userMascotas = (await MascotasData.find({ idDiscord: member.id }))[0];
    if (!userMascotas) return;
    if (!member.roles.cache.has(userMascotas.refRolMascota)) return;
    let mascota = mascotaEquipada(userMascotas);
    let arrNivel = calcularNivelMascota(mascota);
    if (arrNivel[0] < 5) {
        mascota.exp++;
        if (mascota.exp == arrNivel[1]) {
            let nivel = arrNivel[0] + 1;
            var cali = 1;
            switch (mascota.animal.calidad.nombre) {
                case Calidad.Especial:
                    cali = 2;
                    break;
                case Calidad.Raro:
                    cali = 3;
                    break;
                case Calidad.Ultra_raro:
                    cali = 4;
                    break;
                case Calidad.Legendario:
                    cali = 5;
                    break;
            }
            modificarMonedas(userMascotas.idDiscord, nivel * cali * 3);

            let embed = new EmbedBuilder()
                .setColor(mascota.animal.calidad.color);
            switch (nivel) {
                case 5:
                    embed.setDescription(`${member.user} -> **${mascota.nombre}** ha subido a nivel **máximo**`);
                    break;
                default:
                    embed.setDescription(`${member.user} -> **${mascota.nombre}** ha subido a nivel **${nivel}**`);
                    break;
            }
            message.channel.send({ embeds: [embed] });
            updateRol(message.guild, userMascotas);
        }
        await MascotasData.findOneAndUpdate({
            idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.refRolMascota
        }, {
            $inc: { "mascotas.$.exp": 1 }
        });
    }
}
async function subirExperienciaMascotaPareja(message) {
    try {
        let memberPareja = await message.guild.members.fetch((await findOrCreateDocument(message.author.id, Usuario)).parejaId);
        subirExpMascota(message, memberPareja);
    } catch {
    }
}

async function desequipar(guild, userMascotas) {
    try {
        await guild.roles.delete(userMascotas.refRolMascota, `Mascota de \`${userMascotas.idDiscord}\` desequipada`)
    } catch {
        console.log(`No se ha podido eliminar el rol`);
    }
}
async function reEquipar(userMascotas, member) {
    if (member.roles.cache.has(userMascotas.refRolMascota)) {
        console.log(`Ya tiene esa mascota equipada ${userMascotas.idDiscord}`);
        return;
    }
    let mascotaElegida = mascotaEquipada(userMascotas);
    if (!mascotaElegida) return console.log(`${member.user.username} no tiene mascota equipada`);
    try {
        crearRolMascota(mascotaElegida, member).then(async role => {
            userMascotas = await findOrCreateDocument(userMascotas.idDiscord, MascotasData);
            if (member.roles.cache.has(userMascotas.refRolMascota)) return console.log("Mascota ya equipada después de crear el rol");
            await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.refRolMascota }, { refRolMascota: role.id, "mascotas.$.refUltimoRol": role.id });
            member.roles.add(role)
                .then(() => {
                    console.log(`Has equipado a ${mascotaElegida.nombre} ${mascotaElegida.nombre != mascotaElegida.animal.nombre ? `(${mascotaElegida.animal.nombre})` : ''}`) //
                }).catch(() => {
                    desequipar(member.guild, userMascotas);
                    console.log(`Error al asignarte el rol`)
                })
            try {
                let memberPareja = await member.guild.members.fetch((await findOrCreateDocument(userMascotas.idDiscord, Usuario)).parejaId);
                let parejaMascotas = await findOrCreateDocument(memberPareja.id, MascotasData);
                await MascotasData.findOneAndUpdate({ idDiscord: memberPareja.id }, { refRolMascotaP: role.id });
                if (memberPareja.presence == null || memberPareja.presence.status == "offline") return;
                await memberPareja.roles.add(role);
                try {
                    let rolPareja = await member.guild.roles.fetch(parejaMascotas.refRolMascota);
                    if (rolPareja)
                        await member.roles.add(rolPareja);
                } catch {
                    console.log(`No se ha podido equipar la mascota de la pareja`);
                }
            } catch {
                console.log(`No se ha podido equipar la mascota a la pareja`);
            }
        }).catch(e => {
            console.log(e);
            console.log(`No se ha podido crear el rol para equipar, inténtalo más tarde`)
        })
    } catch (e) {
        console.log("Error al re-equipar");
        console.log(e);
    }
}

module.exports = {
    HUEVOS,
    nombreRol,
    calcularNivelMascota,
    buscarMejorMascota,
    subirExpMascota,
    mascotaEquipada,
    updateRol,
    desequipar,
    reEquipar,
    subirExperienciaMascotaPareja,
    equiparMascota,
    mostrarMascotas
}

function mascotaEquipada(userMascotas) {
    return userMascotas.mascotas.find(a => a.refUltimoRol == userMascotas.refRolMascota);
}
async function updateRol(guild, userMascotas) {
    await guild.roles.edit(userMascotas.refRolMascota, { name: nombreRol(mascotaEquipada(userMascotas)) });
}

function buscarMejorMascota(userMascotas, texto) {
    if (texto == null) return arreglarArray(userMascotas.mascotas);

    texto = texto.split(',');
    texto[0] = texto[0].trim();
    var mascotasElegibles = userMascotas.mascotas.filter(m => m.nombre.match(new RegExp(texto[0], 'ig')));
    if (mascotasElegibles.length == 0) mascotasElegibles = userMascotas.mascotas.filter(m => m.animal.nombre.match(new RegExp(texto[0], 'ig')));
    if (mascotasElegibles.length == 0) {
        throw new Error(`No se ha encontrado ninguna mascota con nombre \`${texto[0]}\``);
    } else if (mascotasElegibles.length == 1) {
        return mascotasElegibles[0];
    } else {
        var arrArreglado = arreglarArray(mascotasElegibles);
        if (arrArreglado.length == 1) {
            return mascotasElegibles[0];
        } else {
            if (texto.length >= 2) {
                texto[1] = texto[1].trim();
                var segundoArgumento = parseInt(texto[1]);
                if (isNaN(segundoArgumento)) {
                    mascotasElegibles = mascotasElegibles.filter(m => m.animal.nombre.toLowerCase() == texto[1].toLowerCase());
                    if (mascotasElegibles.length == 0) {
                        throw new Error(`No se ha encontrado ninguna mascota de nombre \`${texto[0]}\` que sea \`${texto[1]}\``);
                    } else if (mascotasElegibles.length == 1) {
                        return mascotasElegibles[0];
                    } else {
                        var arrArreglado = arreglarArray(mascotasElegibles);
                        if (arrArreglado.length == 1) {
                            return mascotasElegibles[0];
                        } else {
                            if (texto.length >= 3) {
                                texto[2] = texto[2].trim();
                                mascotasElegibles = mascotasElegibles.filter(m => m.exp.toString() == texto[2]);
                                var arrArreglado = arreglarArray(mascotasElegibles);
                                if (arrArreglado.length == 1) {
                                    return mascotasElegibles[0];
                                } else if (arrArreglado.length == 0) {
                                    throw new Error(`No se ha encontrado ninguna mascota de nombre \`${texto[0]}\` que sea \`${texto[1]}\` y con \`exp=${texto[2]}\``);
                                } else {
                                    return [arrArreglado, "Error al buscar la mascota"]
                                }
                            } else {
                                return [arrArreglado, "No se han especificado suficientes caracteristicas *expecifica también la experiencia*"];
                            }
                        }
                    }
                } else {
                    mascotasElegibles = mascotasElegibles.filter(m => m.exp == segundoArgumento);
                    if (mascotasElegibles.length == 0) {
                        throw new Error(`No se ha encontrado ninguna mascota de nombre \`${texto[0]}\` con \`exp=${texto[1]}\``);
                    } else if (mascotasElegibles.length == 1) {
                        return mascotasElegibles[0];
                    } else {
                        var arrArreglado = arreglarArray(mascotasElegibles);
                        if (arrArreglado.length == 1) {
                            return mascotasElegibles[0];
                        } else {
                            if (texto.length >= 3) {
                                texto[2] = texto[2].trim();
                                mascotasElegibles = mascotasElegibles.filter(m => m.animal.nombre.toLowerCase() == texto[2].toLowerCase());
                                var arrArreglado = arreglarArray(mascotasElegibles);
                                if (arrArreglado.length == 1) {
                                    return mascotasElegibles[0];
                                } else if (arrArreglado.length == 0) {
                                    throw new Error(`No se ha encontrado ninguna mascota de nombre \`${texto[0]}\` que sea \`${texto[2]}\` y con \`exp=${texto[1]}\``);
                                } else {
                                    throw new Error("Error al buscar la mascota");
                                }
                            } else {
                                return [arrArreglado, "No se han especificado suficientes caracteristicas *expecifica también el animal*"];
                            }
                        }
                    }
                }
            } else {
                return [arrArreglado, "No se han especificado suficientes caracteristicas *expecifica también el animal y/o la experiencia*"];
            }
        }
    }

    function arreglarArray(array) {
        var arrArreglado = [];
        for (m of array) {
            if (arrArreglado.find(a => a.nombre == m.nombre && a.animal.nombre == m.animal.nombre && a.exp == m.exp)) {
                arrArreglado.find(a => a.nombre == m.nombre && a.animal.nombre == m.animal.nombre && a.exp == m.exp).count++;
            } else {
                arrArreglado.push({
                    nombre: m.nombre,
                    animal: {
                        nombre: m.animal.nombre,
                        calidad: m.animal.calidad,
                    },
                    exp: m.exp,
                    count: 1
                })
            }
        }
        return arrArreglado;
    }
}

async function equiparMascota(mascotaElegida, userMascotas, member) {
    const filtro = a => a.nombre == mascotaElegida.nombre && a.animal.nombre == mascotaElegida.animal.nombre && a.exp == mascotaElegida.exp;
    if (userMascotas.mascotas.find(filtro).refUltimoRol == userMascotas.refRolMascota && member.roles.cache.has(userMascotas.refRolMascota))
        return;
    if (!member.presence || member.presence.status == 'offline') throw new Error('No puedes equipar mascotas estando \"offline\"');

    await desequipar(member.guild, userMascotas);
    crearRolMascota(mascotaElegida, member).then(async role => {
        userMascotas = await findOrCreateDocument(userMascotas.idDiscord, MascotasData);
        if (member.roles.cache.has(userMascotas.refRolMascota)) return console.log("Mascota ya equipada después de crear el rol");
        await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.mascotas.find(filtro).refUltimoRol }, { refRolMascota: role.id, "mascotas.$.refUltimoRol": role.id });
        member.roles.add(role)
            .catch(() => {
                desequipar(member.guild, userMascotas);
            })
        try {
            let memberPareja = await member.guild.members.fetch((await Usuario.find({ idDiscord: userMascotas.idDiscord }))[0].parejaId);
            await findOrCreateDocument(memberPareja.id, MascotasData);
            await MascotasData.findOneAndUpdate({ idDiscord: memberPareja.id }, { refRolMascotaP: role.id });
            if (memberPareja.presence == null || memberPareja.presence.status == "offline") return;
            memberPareja.roles.add(role);
        } catch {
            console.log(`No se ha podido equipar la mascota a la pareja`);
        }
    }).catch(e => {
        console.log(e);
    })
}

function mostrarMascotas(userMascotas, author, idAuthorMessage, deNavidad) {
    var arrArreglado = buscarMejorMascota(userMascotas, null);
    let embed = createEmbedMascotas(arrArreglado, author, deNavidad);
    let components = createComponents(deNavidad, author, idAuthorMessage);

    return [embed, components];

    function createEmbedMascotas(arrArreglado, author, deNavidad = false) {
        const mascotasOrdenadas = {
            legendarias: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Legendario.nombre && esDeNavidad(m, deNavidad)),
            ultra_raras: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Ultra_raro.nombre && esDeNavidad(m, deNavidad)),
            raras: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Raro.nombre && esDeNavidad(m, deNavidad)),
            especiales: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Especial.nombre && esDeNavidad(m, deNavidad)),
            comunes: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Comun.nombre && esDeNavidad(m, deNavidad))
        }
        const textos = {
            legendarias: {
                name: `Legendarias`,
                value: '' //.length <= 1024
            },
            ultra_raras: {
                name: `Ultra raras`,
                value: '',
            },
            raras: {
                name: `Raras`,
                value: ''
            },
            especiales: {
                name: `Especiales`,
                value: ''
            },
            comunes: {
                name: `Comunes`,
                value: ''
            }
        }
        const count = {
            legendarias: mascotasOrdenadas.legendarias?.reduce((accumulator, object) => { return accumulator + object.count; }, 0),
            ultra_raras: mascotasOrdenadas.ultra_raras?.reduce((accumulator, object) => { return accumulator + object.count; }, 0),
            raras: mascotasOrdenadas.raras?.reduce((accumulator, object) => { return accumulator + object.count; }, 0),
            especiales: mascotasOrdenadas.especiales?.reduce((accumulator, object) => { return accumulator + object.count; }, 0),
            comunes: mascotasOrdenadas.comunes?.reduce((accumulator, object) => { return accumulator + object.count; }, 0),
        }

        const total = count.legendarias + count.ultra_raras + count.raras + count.especiales + count.comunes;
        var embed = new EmbedBuilder()
            .setTitle(`Mascotas de ${author.username}`)
            .setColor(rgbToHex(
                mediaColor("r", count, total),
                mediaColor("g", count, total),
                mediaColor("b", count, total)
            ))
            .setDescription(`${deNavidad ? '❄️❄️❄️ Mascotas de navidad ❄️❄️❄️' : 'Mascotas normales :>'}`)
            .setFooter({ text: author.username, iconURL: author.displayAvatarURL({ format: "png" }) })
            .setTimestamp(new Date());

        for (key of Object.keys(textos)) {
            hacerTextos(mascotasOrdenadas, key, textos);
            if (textos[key].value.length > 1) embed.addFields({ name: textos[key].name, value: textos[key].value });
        }
        return embed;

        function hacerTextos(mascotasOrdenadas, campo, textos) {
            mascotasOrdenadas[campo]?.sort((a, b) => b.exp - a.exp);
            for (var i = 0; i < mascotasOrdenadas[campo]?.length; i++) {
                const update = textos[campo].value + `${i + 1}. ${nombreRol(mascotasOrdenadas[campo][i]).replace('Pet: ', '')}${mascotasOrdenadas[campo][i].count > 1 ? 'x' + mascotasOrdenadas[campo][i].count : ''}\n`
                if (update.length > 1018) {
                    update = textos[campo].value + `...+${mascotasOrdenadas[campo].length - i + 1}`
                    textos[campo].value = update;
                    break;
                }
                textos[campo].value = update;
            }
        }
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
        }
        function mediaColor(r_g_b, count, total) {
            function hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }
            return ((hexToRgb(Calidad.Comun.color)[r_g_b] * count.comunes) + (hexToRgb(Calidad.Especial.color)[r_g_b] * count.especiales) + (hexToRgb(Calidad.Raro.color)[r_g_b] * count.raras) + (hexToRgb(Calidad.Ultra_raro.color)[r_g_b] * count.ultra_raras) + (hexToRgb(Calidad.Legendario.color)[r_g_b] * count.legendarias)) / total << 0;
        }
        function esDeNavidad(mascota, deNavidad = true) {
            if (deNavidad)
                return mascota.animal.nombre.endsWith("❄️");
            return !mascota.animal.nombre.endsWith("❄️")
        }
    }
    function createComponents(deNavidad, author, idAuthorMessage) {
        let b = new ButtonBuilder()
            .setLabel(`${deNavidad ? 'Normales' : 'Navidad❄️'}`)
            .setCustomId(`mostrarMascotas_${deNavidad ? 'normales' : 'navidad'}_${author.id}_${idAuthorMessage}`)
            .setStyle(ButtonStyle.Primary)
        var rowBotones = new ActionRowBuilder()
            .addComponents(b)
        return rowBotones;
    }
}

function crearRolMascota(mascotaElegida, member) {
    const calidadMascota = mascotaElegida.animal.calidad;
    var permisos = [];
    switch (calidadMascota.nombre) {
        case Calidad.Legendario.nombre:
            permisos = [
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AddReactions
            ]
            break;
        case Calidad.Ultra_raro.nombre:
            permisos = [
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AddReactions
            ]
            break;
        case Calidad.Raro.nombre:
            permisos = [
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AddReactions
            ]
            break;
        case Calidad.Especial.nombre:
            permisos = [
                PermissionFlagsBits.EmbedLinks
            ]
            break;
    }
    return member.guild.roles.create({
        name: nombreRol(mascotaElegida),
        color: mascotaElegida.animal.calidad.color,
        mentionable: false,
        permissions: permisos,
        reason: `${member.id} equipa una mascota`
    })
}