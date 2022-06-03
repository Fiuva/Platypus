const { ROL } = require("../../config/constantes");
const { CANAL_TEXTO, CANAL_VOZ } = require("../../config/constantes");

module.exports = {
    name: "filtro",
    aliases: ["filter", "filters", "filtros"],
    descripcion: "Pon filtros en tus canciones (`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`)",
    canales: [CANAL_TEXTO.MUSICA],
    roles: [ROL.MUSICA_PRO],
    run: async (client, message, args) => {
        if (message.member.voice?.channel?.id != CANAL_VOZ.MUSICA) return message.reply("Tienes que meterte al canal de musica... cara alcachofa!");
        const queue = client.distube.getQueue(message);
        if (!queue) return message.reply("No hay canciones :<");

        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(args[0])) {
            const filter = client.distube.setFilter(message, args);
            message.channel.send("**Filtro actual en la lista:** " + (filter.join(", ") || "Off"));
        } else {
            const filter = client.distube.getQueue(message).filters;
            return message.reply("Filtro actual en la lista: " + (filter.join(", ") || "Off")+"\nEspecifica el filtro: **`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`**");
        }
    }
}