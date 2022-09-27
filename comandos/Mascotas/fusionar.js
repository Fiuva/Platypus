const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { calcularNivelMascota, equiparMascota } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData, Mascota, Animal } = require("../../models/mascotas");

module.exports = {
    name: "fusionar",
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Fusiona 4 mascotas iguales a nivel máximo para obtener una mascota \"evolucionada\"",
    run: async (client, message, args) => {
        const userMascotas = await findOrCreateDocument(message.author.id, MascotasData);
        const mascotasNivel5 = userMascotas.mascotas.filter(mascota => calcularNivelMascota(mascota)[0] == 5);
        if (userMascotas.mascotas.length < 4) {
            return message.reply(`No tienes suficientes mascotas a nivel máximo`)
        } else {
            const arrArreglado = arreglarArray(mascotasNivel5);
            if (Math.max(...arrArreglado.map(o => o.count)) < 4) {
                return message.reply(`Tienes que tener al menos 4 mascotas iguales a nivel máximo para fusionarlas`);
            } else {
                const mascotasElegibles = arrArreglado.filter(a => a.count >= 4);
                if (mascotasElegibles.length > 1) {
                    if (args[0]) {
                        const mmmm = mascotasElegibles.filter(a => a.animal.nombre.match(new RegExp(args[0], 'ig')));
                        if (mmmm.length == 1) {
                            fusionar(mmmm[0], message, userMascotas);
                        } else {
                            return message.reply(`No se ha encontrado esa mascota`)
                        }
                    } else {
                        return message.reply(`Tienes más de 1 tipo de animal para fusionar, especifica el *nombre de animal* del que quieres fusionar`);
                    }
                } else {
                    fusionar(mascotasElegibles[0], message, userMascotas);
                }
            }
        }
    }
}

function arreglarArray(array) {
    var arrArreglado = [];
    for (m of array) {
        if (arrArreglado.find(a => a.animal.nombre == m.animal.nombre && a.exp == m.exp)) {
            arrArreglado.find(a => a.animal.nombre == m.animal.nombre && a.exp == m.exp).count++;
        } else {
            arrArreglado.push({
                nombre: m.nombre,
                animal: {
                    nombre: m.animal.nombre,
                    calidad: m.animal.calidad,
                    clase: m.animal.clase,
                    habitat: m.animal.habitat
                },
                exp: m.exp,
                count: 1
            })
        }
    }
    return arrArreglado;
}

async function fusionar(mascotaConCount, message, userMascotas) {
    const mascotas = userMascotas.mascotas;
    if (mascotaConCount.animal.nombre.endsWith('👑')) return message.reply(`No se pueden fusionar 👑`);
    mascotas.splice(mascotas.findIndex(m => m.animal.nombre === mascotaConCount.animal.nombre && m.exp === mascotaConCount.exp), 1);
    mascotas.splice(mascotas.findIndex(m => m.animal.nombre === mascotaConCount.animal.nombre && m.exp === mascotaConCount.exp), 1);
    mascotas.splice(mascotas.findIndex(m => m.animal.nombre === mascotaConCount.animal.nombre && m.exp === mascotaConCount.exp), 1);
    mascotas.splice(mascotas.findIndex(m => m.animal.nombre === mascotaConCount.animal.nombre && m.exp === mascotaConCount.exp), 1);
    var nuevaMascota;
    if (mascotaConCount.animal.nombre.endsWith('✨')) {
        nuevaMascota = new Mascota(new Animal(mascotaConCount.animal.nombre.replace('✨', '') + '👑', mascotaConCount.animal.clase, mascotaConCount.animal.habitat, mascotaConCount.animal.calidad));
    } else {
        nuevaMascota = new Mascota(new Animal(mascotaConCount.animal.nombre + '✨', mascotaConCount.animal.clase, mascotaConCount.animal.habitat, mascotaConCount.animal.calidad));
    }
    mascotas.push(nuevaMascota);
    await MascotasData.updateOne({ idDiscord: message.author.id }, { mascotas: mascotas });

    try {
        await equiparMascota(nuevaMascota, userMascotas, message.member);
    } catch {

    }

    const embed = new EmbedBuilder()
        .setTitle(nuevaMascota.nombre)
        .setColor(nuevaMascota.animal.calidad.color)
        .setDescription(`Se ha fusionado la mascota y se ha equipado`)
        .setFooter({ text: `Propiedad de: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ format: 'png' }) })
        .setTimestamp(new Date());
    message.reply({ embeds: [embed] });
}