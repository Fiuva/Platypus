const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, MONEDAS } = require("../../config/constantes");
const { HUEVOS } = require("../../handlers/juegos/funcionesMascotas");
const { Calidad, Tipo_Huevo } = require("../../models/mascotas");

const command_data = {
    name: "huevos",
    description: `🥚 Mira los huevos disponibles en la tienda y sus probabilides`
}

module.exports = {
    ...command_data,
    aliases: ["eggs", "probabilidades"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data
    },
    run: async (client, interaction) => {
        var embed = new EmbedBuilder()
            .setTitle(`Huevos disponibles ✨`)
            .setColor("#E1DFA8")

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

        interaction.reply({ embeds: [embed] });
    }
}

function mostrarProbabilidadFix(probabilidad) {
    return +(probabilidad * 100).toFixed(2);
}