const { MessageEmbed } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { nombreRol, buscarMejorMascota } = require("../../handlers/juegos/funcionesMascotas");
const { Calidad, MascotasData } = require("../../models/mascotas");

module.exports = {
    name: "mascotas",
    aliases: ["mostrarmascotas", "pets"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Una lista de tus mascotas",
    run: async (client, message, args) => {
        var author = message.mentions.users.first() || message.author;
        let userMascotas = (await MascotasData.find({ idDiscord: author.id }))[0];
        if (!userMascotas) return message.reply(`${author} no tiene mascotas`);
        var arrArreglado = buscarMejorMascota(userMascotas, null);
        const mascotasOrdenadas = {
            legendarias: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Legendario.nombre),
            ultra_raras: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Ultra_raro.nombre),
            raras: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Raro.nombre),
            especiales: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Especial.nombre),
            comunes: arrArreglado?.filter(m => m.animal.calidad.nombre == Calidad.Comun.nombre)
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
        var embed = new MessageEmbed()
            .setTitle(`Mascotas de ${author.username}`)
            .setColor(rgbToHex(
                mediaColor("r", count, total),
                mediaColor("g", count, total),
                mediaColor("b", count, total)
            ))
            .setFooter({ text: author.username, iconURL: author.displayAvatarURL({ format: "png" }) })
            .setTimestamp(new Date());

        for (key of Object.keys(textos)) {
            hacerTextos(mascotasOrdenadas, key, textos);
            if (textos[key].value.length > 1) embed.addField(textos[key].name, textos[key].value);
        }

        message.reply({ embeds: [embed] });
    }
}

function hacerTextos(mascotasOrdenadas, campo, textos) {
    mascotasOrdenadas[campo]?.sort((a, b) => b.exp - a.exp);
    for (var i = 0; i < mascotasOrdenadas[campo]?.length; i++) {
        const update = textos[campo].value + `${i + 1}. ${nombreRol(mascotasOrdenadas[campo][i]).replace('Pet: ', '')}${mascotasOrdenadas[campo][i].count > 1 ? 'x' + mascotasOrdenadas[campo][i].count : ''}\n`
        if (update > 1018) {
            update = textos[campo].value + `...+${mascotasOrdenadas[campo].length - i + 1}`
            textos[campo].value = update;
            break;
        }
        textos[campo].value = update;
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

function mediaColor(r_g_b, count, total) {
    return ((hexToRgb(Calidad.Comun.color)[r_g_b] * count.comunes) + (hexToRgb(Calidad.Especial.color)[r_g_b] * count.especiales) + (hexToRgb(Calidad.Raro.color)[r_g_b] * count.raras) + (hexToRgb(Calidad.Ultra_raro.color)[r_g_b] * count.ultra_raras) + (hexToRgb(Calidad.Legendario.color)[r_g_b] * count.legendarias)) / total << 0;
}