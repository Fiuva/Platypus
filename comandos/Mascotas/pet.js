const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { calcularNivelMascota, buscarMejorMascota, mascotaEquipada } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");

module.exports = {
    name: "mascota",
    aliases: ["pet"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Para ver las estadísticas de la mascota equipada o cualquier otra",
    run: async (client, message, args) => {
        const userMascotas = await findOrCreateDocument(message.author.id, MascotasData);
        if (!args[0]) {
            if (userMascotas.refRolMascota == '0') return message.reply('No tienes ninguna mascota equipada ni has especificado la mascota');
            if (!message.guild.roles.cache.has(userMascotas.refRolMascota)) return message.reply("Base de datos no sincronizada, por favor equipese de nuevo una mascota o especifique la mascota que quiere ver");
            try {
                await message.channel.send({ embeds: [embedMascota(mascotaEquipada(userMascotas), message)] });
            } catch {
                message.reply(`Error, no tienes mascota equipada o vuelve a equipártela`);
            }
            return;
        }
        try {
            var mascotaElegida = buscarMejorMascota(userMascotas, args.join(' '));
            if (Array.isArray(mascotaElegida)) {
                var arrArreglado = mascotaElegida[0];
                var resultado = '';
                for (var i = 0; i < arrArreglado.length; i++) {
                    resultado += `${i + 1}. ${arrArreglado[i].nombre} (${arrArreglado[i].nombre != arrArreglado[i].animal.nombre ? `${arrArreglado[i].animal.nombre} | ` : ''}Exp: \`${arrArreglado[i].exp}\`) ${arrArreglado[i].count != 1 ? `x${arrArreglado[i].count}` : ''}\n`;
                }
                var embed = new EmbedBuilder()
                    .setTitle("Elige una mascota")
                    .setDescription(resultado)
                return message.reply({ content: mascotaElegida[1], embeds: [embed] })
            } else {
                message.channel.send({ embeds: [embedMascota(mascotaElegida, message)] });
            }
        } catch (e) {
            message.reply(e.message);
        }

    }
}

function embedMascota(mascota, message) {
    const nivel = calcularNivelMascota(mascota);
    var embed = new EmbedBuilder()
        .setTitle(mascota.animal.nombre)
        .setDescription(nivel[0] == 5 ? `Nivel: \`Max\`` : `Nivel: \`${nivel[0]}\` \n Exp: \`${mascota.exp}/${nivel[1]}\``)
        .addFields(
            { name: `Clase: `, value: mascota.animal.clase, inline: true },
            { name: `Hábitat: `, value: mascota.animal.habitat, inline: true },
            { name: `Calidad: `, value: mascota.animal.calidad.nombre, inline: true }
        )
        .setColor(mascota.animal.calidad.color)
        .setFooter({ text: `Propiedad de: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ format: 'png' }) })
        .setTimestamp(new Date());
    if (mascota.nombre != mascota.animal.nombre) embed.setAuthor({ name: mascota.nombre })
    return embed;
}