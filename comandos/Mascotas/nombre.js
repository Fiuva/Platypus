const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { nombreRol, mascotaEquipada, updateRol } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");
const { EmbedBuilder } = require("discord.js");

const command_data = {
    name: "nombre",
    description: `🐹 Cambia el nombre a tu mascota y aparecerá en tu rol de mascota`
}

module.exports = {
    ...command_data,
    alias: ["cambiarnombre"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: 'nombre',
                description: `Ejemplo: El lechoso 🥛`,
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        const userMascotas = await findOrCreateDocument(interaction.user.id, MascotasData);
        if (userMascotas.refRolMascota == '0')
            return interaction.reply({ content: "Tienes que equiparte una mascota para cambiarle el nombre", ephemeral: true });
        if (!interaction.guild.roles.cache.has(userMascotas.refRolMascota))
            return interaction.reply({
                content: "Base de datos no sincronizada, por favor equípate de nuevo la mascota a la que quieres cambiar el nombre (</equipar:0>)",
                ephemeral: true
            });
        try {
            const nombreAntiguo = mascotaEquipada(userMascotas).nombre;
            const nuevoNombre = interaction.options.getString('nombre').replace(/,/i, '');
            if (nombreAntiguo == nuevoNombre)
                return interaction.reply({ content: `Tú mascota equipada ya tiene ese nombre`, ephemeral: true });
            mascotaEquipada(userMascotas).nombre = nuevoNombre;
            if (nombreRol(mascotaEquipada(userMascotas)).length > 100)
                return interaction.reply({ content: `El nombre es demasiado largo`, ephemeral: true });

            await MascotasData.findOneAndUpdate(
                { idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.refRolMascota },
                { $set: { "mascotas.$.nombre": nuevoNombre } }
            );
            updateRol(interaction.guild, userMascotas).then(() => {
                let embed = new EmbedBuilder()
                    .setDescription(`Se ha cambiado el nombre de ${nombreAntiguo} a ${nuevoNombre}`)
                    .setColor("#376AE1")
                interaction.reply({ embeds: [embed] });
            }).catch(() => interaction.reply({ content: `No se ha podido cambiar el nombre del rol`, ephemeral: true }))

        } catch {
            interaction.reply({ content: "Error al cambiar el nombre :<", ephemeral: true });
        }
    }
}