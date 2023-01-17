const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { calcularNivelMascota, equiparMascota } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData, Mascota, Animal } = require("../../models/mascotas");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "fusionar",
    description: `🐹✨ Fusiona 4 mascotas iguales a nivel máximo para obtener una mascota \"evolucionada\"`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: `mascota`,
                description: `(necesitas 4 a nivel máximo) | Ejemplo: Rata`,
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    run: async (client, interaction) => {
        const userMascotas = await findOrCreateDocument(interaction.user.id, MascotasData);
        const mascotasNivel5 = userMascotas.mascotas.filter(mascota => calcularNivelMascota(mascota)[0] == 5);
        if (userMascotas.mascotas.length < 4) {
            return interaction.reply({ content: `No tienes suficientes mascotas a nivel máximo`, ephemeral: true })
        } else {
            const arrArreglado = arreglarArray(mascotasNivel5);
            if (Math.max(...arrArreglado.map(o => o.count)) < 4) {
                return interaction.reply({ content: `Tienes que tener al menos 4 mascotas iguales a nivel máximo para fusionarlas`, ephemeral: true });
            } else {
                const mascotasElegibles = arrArreglado.filter(a => a.count >= 4);
                if (mascotasElegibles.length > 1) {
                    if (interaction.options.getString('mascota')) {
                        const mmmm = mascotasElegibles.filter(a => a.animal.nombre.match(new RegExp(interaction.options.getString('mascota'), 'ig')));
                        if (mmmm.length == 1) {
                            fusionar(mmmm[0], interaction, userMascotas);
                        } else {
                            return interaction.reply({ content: `No se ha encontrado esa mascota`, ephemeral: true });
                        }
                    } else {
                        return interaction.reply({ content: `Tienes **más de una especie** de mascota para fusionar, especifica el *nombre de animal* del que quieres fusionar`, ephemeral: true });
                    }
                } else {
                    fusionar(mascotasElegibles[0], interaction, userMascotas);
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

async function fusionar(mascotaConCount, interaction, userMascotas) {
    const mascotas = userMascotas.mascotas;
    if (mascotaConCount.animal.nombre.endsWith('👑')) return interaction.reply({ content: `No se pueden fusionar 👑`, ephemeral: true });
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
    await MascotasData.updateOne({ idDiscord: interaction.user.id }, { mascotas: mascotas });

    try {
        await equiparMascota(nuevaMascota, userMascotas, interaction.member);
    } catch {

    }

    const embed = new EmbedBuilder()
        .setTitle(nuevaMascota.nombre)
        .setColor(nuevaMascota.animal.calidad.color)
        .setDescription(`Se ha fusionado la mascota y se ha equipado`)
        .setFooter({ text: `Propiedad de: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ format: 'png' }) })
        .setTimestamp(new Date());
    interaction.reply({ embeds: [embed] });
}