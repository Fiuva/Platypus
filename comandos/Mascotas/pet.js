const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { findOrCreateDocument, getInteractionUser } = require("../../handlers/funciones");
const { calcularNivelMascota, buscarMejorMascota, mascotaEquipada } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "mascota",
    description: `🐹 Para ver las estadísticas de tú mascota equipada o cualquier otra`
}

module.exports = {
    ...command_data,
    aliases: ["pet"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: `mascota`,
                description: `Ejemplo: Rata`,
                type: ApplicationCommandOptionType.String,
                required: false
            },
            OPTION.USER
        ]
    },
    run: async (client, interaction) => {
        try {
            var author = getInteractionUser(interaction, `Yo no tengo mascotas :\'<'`)
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        let self = author.id == interaction.user.id;
        const userMascotas = await findOrCreateDocument(author.id, MascotasData);
        const args = interaction.options.getString('mascota');
        if (!args) {
            if (userMascotas.refRolMascota == '0') {
                if (self) var res = 'No tienes ninguna mascota equipada ni has especificado la mascota';
                else var res = `${author} no tiene ninguna mascota equipada o no has especificado la mascota`;
                return interaction.reply({
                    content: res,
                    ephemeral: true
                });
            }
            if (!interaction.guild.roles.cache.has(userMascotas.refRolMascota)) {
                if (self) var res = "Error, tienes que tener la mascota equipada, vuélvete a equipar la mascota </equipar:0>"
                else var res = `Error, ${author} tiene que re-equiparse la mascota o tenerla equipada`
                return interaction.reply({
                    content: res,
                    ephemeral: true
                });
            }
            try {
                await interaction.reply({ embeds: [embedMascota(mascotaEquipada(userMascotas), author)] });
            } catch {
                if (self) var res = `Error, no tienes mascota equipada o vuelve a equipártela (</equipar:0>)`
                else var res = `Error, ${author} no tiene la mascota equipada o vuelve a se la tiene que volver a equipar`
                interaction.reply({ content: res, ephemeral: true });
            }
            return;
        }
        try {
            var mascotaElegida = buscarMejorMascota(userMascotas, args);
            if (Array.isArray(mascotaElegida)) {
                var arrArreglado = mascotaElegida[0];
                var resultado = '';
                for (var i = 0; i < arrArreglado.length; i++) {
                    resultado += `${i + 1}. ${arrArreglado[i].nombre} (${arrArreglado[i].nombre != arrArreglado[i].animal.nombre ? `${arrArreglado[i].animal.nombre} | ` : ''}Exp: \`${arrArreglado[i].exp}\`) ${arrArreglado[i].count != 1 ? `x${arrArreglado[i].count}` : ''}\n`;
                }
                var embed = new EmbedBuilder()
                    .setTitle("Elige una mascota")
                    .setDescription(resultado)
                return interaction.reply({ content: mascotaElegida[1], embeds: [embed], ephemeral: true });
            } else {
                interaction.reply({ embeds: [embedMascota(mascotaElegida, author)] });
            }
        } catch (e) {
            interaction.reply({ content: e.message, ephemeral: true });
        }
    }
}

function embedMascota(mascota, author) {
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
        .setFooter({ text: `Propiedad de: ${author.username}`, iconURL: author.displayAvatarURL({ format: 'png' }) })
        .setTimestamp(new Date());
    if (mascota.nombre != mascota.animal.nombre) embed.setAuthor({ name: mascota.nombre })
    return embed;
}