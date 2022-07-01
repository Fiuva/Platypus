const { MessageEmbed } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { nombreRol, buscarMejorMascota, desequipar } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "equipar",
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Equipa una mascota de las que tienes",
    run: async (client, message, args) => {
        const userMascotas = await findOrCreateDocument(message.author.id, MascotasData);
        if(message.member.presence?.status == "offline") return message.reply(`No puedes equipar mascotas estando offline`)
        try {
            const mejorMascota = buscarMejorMascota(userMascotas, args.join(' '));
            if (Array.isArray(mejorMascota)) {
                var arrArreglado = mejorMascota[0];
                var resultado = '';
                for (var i = 0; i < arrArreglado.length && i < 30; i++) {
                    resultado += `${i + 1}. ${arrArreglado[i].nombre} (${arrArreglado[i].nombre != arrArreglado[i].animal.nombre ? `${arrArreglado[i].animal.nombre} | ` : ''}Exp: \`${arrArreglado[i].exp}\`) ${arrArreglado[i].count != 1 ? `x${arrArreglado[i].count}` : ''}\n`;
                }
                var embed = new MessageEmbed()
                    .setTitle("Elige una mascota")
                    .setDescription(resultado)
                return message.reply({ content: mejorMascota[1], embeds: [embed] })
            } else {
                equipar(mejorMascota);
            }
        } catch (e) {
            message.reply(e.message);
        }
        async function equipar(mascotaElegida) {
            const filtro = a => a.nombre == mascotaElegida.nombre && a.animal.nombre == mascotaElegida.animal.nombre && a.exp == mascotaElegida.exp;
            if (userMascotas.mascotas.find(filtro).refUltimoRol == userMascotas.refRolMascota && message.member.roles.cache.has(userMascotas.refRolMascota)) {
                message.reply(`Ya tienes esa mascota equipada`)
                return;
            }
            message.reply(`Equipando mascota...`).then(async replied => {
                await desequipar(message.guild, userMascotas);
                message.guild.roles.create({
                    name: nombreRol(mascotaElegida),
                    color: mascotaElegida.animal.calidad.color,
                    mentionable: false,
                    reason: `${message.author.username} equipa una mascota`
                }).then(async role => {
                    await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.mascotas.find(filtro).refUltimoRol }, { refRolMascota: role.id, "mascotas.$.refUltimoRol": role.id });
                    message.member.roles.add(role)
                        .then(() => {
                            replied.edit(`Has equipado a ${mascotaElegida.nombre} ${mascotaElegida.nombre != mascotaElegida.animal.nombre ? `(${mascotaElegida.animal.nombre})` : ''}`)
                        }).catch(() => {
                            desequipar(message.guild, userMascotas);
                            replied.edit(`Error al asignarte el rol`)
                        })
                    try {
                        let memberPareja = await message.guild.members.fetch((await Usuario.find({ idDiscord: userMascotas.idDiscord }))[0].parejaId);
                        await findOrCreateDocument(memberPareja.id, MascotasData);
                        await MascotasData.findOneAndUpdate({ idDiscord: memberPareja.id }, { refRolMascotaP: role.id });
                        if (memberPareja.presence == null || memberPareja.presence.status == "offline") return;
                        memberPareja.roles.add(role);
                    } catch (e) {
                        console.log(`No se ha podido equipar la mascota a la pareja ${e.message}`);
                    }
                }).catch(e => {
                    console.log(e);
                    replied.edit(`No se ha podido crear el rol para equipar, inténtalo más tarde`)
                })
            })
        }
    }
}