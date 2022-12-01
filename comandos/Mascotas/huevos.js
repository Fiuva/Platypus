const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS } = require("../../config/constantes");
const { HUEVOS } = require("../../handlers/juegos/funcionesMascotas");
const { Calidad, Tipo_Huevo } = require("../../models/mascotas");


module.exports = {
    name: "huevos",
    aliases: ["eggs", "probabilidades"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Mira los huevos disponibles en la tienda y sus probabilides",
    run: async (client, message, args) => {
        var embed = new EmbedBuilder()
            .setTitle(`Huevos disponibles ✨`)

        Object.values(HUEVOS).forEach(huevo => {
            if (!huevo.TIENDA) return;
            embed.addFields({
                name: `${huevo.EMOJI} __${huevo.NOMBRE}__ _Precio: ${huevo.PRECIO} ${huevo.TIPO == Tipo_Huevo.Navidad ? MONEDAS.NAVIDAD.EMOTE : MONEDAS.PC.EMOTE}_`,
                value:
                    `**${Calidad.Comun.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.COMUN)}%
                    **${Calidad.Especial.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.ESPECIAL)}%
                    **${Calidad.Raro.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.RARO)}%
                    **${Calidad.Ultra_raro.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.ULTRA_RARO)}%
                    **${Calidad.Legendario.nombre}:** ${mostrarProbabilidadFix(huevo.PROBABILIDAD.LEGENDARIO)}%`
            })
        })

        message.channel.send({ embeds: [embed] });
    }
}

function mostrarProbabilidadFix(probabilidad) {
    return +(probabilidad * 100).toFixed(2);
}