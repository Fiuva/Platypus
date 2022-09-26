const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument } = require("../../handlers/funciones");
const { nombreRol, mascotaEquipada, updateRol } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");

module.exports = {
    name: "nombre",
    alias: ["cambiarnombre"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Cambia el nombre a tu mascota y aparecerá en tu rol de mascota",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Tienes que especificar un nombre para la mascota que tienes equipada");
        const userMascotas = await findOrCreateDocument(message.author.id, MascotasData);
        if (userMascotas.refRolMascota == '0') return message.reply("Tienes que equiparte una mascota para cambiarle el nombre");
        if (!message.guild.roles.cache.has(userMascotas.refRolMascota)) return message.reply("Base de datos no sincronizada, por favor equipese de nuevo la mascota a la que quiere cambiar el nombre");
        try {
            const nombreAntiguo = mascotaEquipada(userMascotas).nombre;
            const nuevoNombre = args.join(' ').replace(/,/i, '');
            mascotaEquipada(userMascotas).nombre = nuevoNombre;
            if (nombreRol(mascotaEquipada(userMascotas)).length > 100)
                return message.reply(`El nombre es demasiado largo`);

            await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord, "mascotas.refUltimoRol": userMascotas.refRolMascota }, { $set: { "mascotas.$.nombre": nuevoNombre } });
            updateRol(message.guild, userMascotas).then(() => {
                message.reply(`Se ha cambiado el nombre de ${nombreAntiguo} a ${nuevoNombre}`);
            }).catch(() => message.reply(`No se ha podido cambiar el nombre del rol`))

        } catch {
            message.reply("Error al cambiar el nombre :<")
        }

    }
}