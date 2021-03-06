const { MessageEmbed } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { HUEVOS } = require("../../handlers/juegos/funcionesMascotas");
const { Calidad } = require("../../models/mascotas");


module.exports = {
    name: "huevos",
    aliases: ["eggs", "probabilidades"],
    canales: [CANAL_TEXTO.COMANDOS],
    descripcion: "Mira los huevos disponibles en la tienda y sus probabilides",
    run: async (client, message, args) => {
        var embed = new MessageEmbed()
            .setTitle(`Huevos disponibles ✨`)

        Object.values(HUEVOS).forEach(huevo => {
            if (!huevo.TIENDA) return;
            embed.addField(
                `${huevo.EMOJI} __${huevo.NOMBRE}__ _Precio: ${huevo.PRECIO}_`,
                `**${Calidad.Comun.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.COMUN)}% 
                **${Calidad.Especial.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.ESPECIAL)}%
                **${Calidad.Raro.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.RARO)}%
                **${Calidad.Ultra_raro.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.ULTRA_RARO)}%
                **${Calidad.Legendario.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.LEGENDARIO)}%`)
        })

        message.channel.send({ embeds: [embed] });
    }
}

function mostrarProbabilidadFix(probabilidad) {
    return +(probabilidad * 100).toFixed(2);
}