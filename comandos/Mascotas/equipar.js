const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { nombreRol, buscarMejorMascota, desequipar } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const Usuario = require("../../models/usuario");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "equipar",
    description: `🐹 Equipa una mascota de las que tienes`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: `mascota`,
                description: `Ejemplo: Rata`,
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        var userMascotas = await findOrCreateDocument(interaction.user.id, MascotasData);
        if (interaction.member.presence?.status == "offline")
            return interaction.reply({ content: `No puedes equipar mascotas estando offline`, ephemeral: true });

        try {
            const mejorMascota = buscarMejorMascota(userMascotas, interaction.options.getString('mascota'));
            if (Array.isArray(mejorMascota)) {
                var arrArreglado = mejorMascota[0];
                var resultado = '';
                for (var i = 0; i < arrArreglado.length && i < 30; i++) {
                    resultado += `${i + 1}. ${arrArreglado[i].nombre} (${arrArreglado[i].nombre != arrArreglado[i].animal.nombre ? `${arrArreglado[i].animal.nombre} | ` : ''}Exp: \`${arrArreglado[i].exp}\`) ${arrArreglado[i].count != 1 ? `x${arrArreglado[i].count}` : ''}\n`;
                }
                var embed = new EmbedBuilder()
                    .setTitle("Elige una mascota")
                    .setDescription(resultado)
                return interaction.reply({ content: mejorMascota[1], embeds: [embed], ephemeral: true })
            } else {
                equipar(mejorMascota);
            }
        } catch (e) {
            interaction.reply({ content: e.message, ephemeral: true });
        }
        async function equipar(mascotaElegida) {
            const filtro = a => a.nombre == mascotaElegida.nombre && a.animal.nombre == mascotaElegida.animal.nombre && a.exp == mascotaElegida.exp;
            if (userMascotas.mascotas.find(filtro).refUltimoRol == userMascotas.refRolMascota && interaction.member.roles.cache.has(userMascotas.refRolMascota))
                return interaction.reply({ content: `Ya tienes esa mascota equipada`, ephemeral: true });

            let embed = new EmbedBuilder()
                .setDescription(`Equipando mascota...`)
                .setColor("#FFFFFF")
            interaction.reply({ embeds: [embed], fetchReply: true }).then(async replied => {
                await desequipar(interaction.guild, userMascotas);
                interaction.guild.roles.create({
                    name: nombreRol(mascotaElegida),
                    color: mascotaElegida.animal.calidad.color,
                    mentionable: false,
                    reason: `${interaction.user.username} equipa una mascota`
                }).then(async role => {
                    userMascotas = await findOrCreateDocument(userMascotas.idDiscord, MascotasData);
                    if (interaction.member.roles.cache.has(userMascotas.refRolMascota)) return;

                    await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.mascotas.find(filtro).refUltimoRol }, { refRolMascota: role.id, "mascotas.$.refUltimoRol": role.id });
                    interaction.member.roles.add(role)
                        .then(() => {
                            embed.setDescription(`Has equipado a **${mascotaElegida.nombre} ${mascotaElegida.nombre != mascotaElegida.animal.nombre ? `(${mascotaElegida.animal.nombre})` : ''}**`)
                            embed.setColor("#45E16A")
                            replied.edit({ embeds: [embed] })
                        }).catch(() => {
                            desequipar(interaction.guild, userMascotas);
                            replied.edit(`Error al asignarte el rol`)
                        })
                    try {
                        let memberPareja = await interaction.guild.members.fetch((await findOrCreateDocument(userMascotas.idDiscord, Usuario)).parejaId);
                        //await findOrCreateDocument(memberPareja.id, MascotasData);
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