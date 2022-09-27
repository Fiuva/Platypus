const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");
const { ROL } = require("../../config/constantes");
const CONSTANTES = require("../../config/constantes");
const RecapData = require("../../models/recapData");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "eval",
    roles: [ROL.ADMIN],
    description: "Comando para evaluar codigo (solo para el admin)",
    run: async (client, message, args) => {
        if (!args.length) return;

        try {
            const evaluado = await eval(args.join(' ').replace('-nd', ''));
            enviarSinLimite(inspect(evaluado), message, args.includes('-nd'), '#26FF00');

        } catch (e) {
            enviarSinLimite(e.toString(), message, args.includes('-nd'), '#FF0000');
        }
    }
}

function enviarSinLimite(s, message, nd, color) {
    if (nd) return;
    const embeds = [];
    var n = 1983;
    for (var i = 0; i < s.length; i += n) {
        var trimmedString = s.substring(i, i + 1983);
        n = Math.max(Math.min(trimmedString.length, trimmedString.lastIndexOf("\n")), 1000);
        const recortado = s.substring(i, i + n)

        embeds.push(new EmbedBuilder()
            .setDescription(`\`\`\`js\n${recortado.replace(/<ref \*1>/gi, '')}\`\`\``)
            .setColor(color));
    }
    embeds[0].setTitle('Debug');
    embeds[embeds.length - 1].setTimestamp(new Date());
    for (var i = 0; i < embeds.length; i += 3) {
        message.channel.send({ embeds: embeds.slice(i, i + 3) });
    }
}