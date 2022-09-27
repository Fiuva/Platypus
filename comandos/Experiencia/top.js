const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { calcularNivel } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "top",
    aliases: ["lb", "ranking"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "El ranking de la gente más activa del server",
    run: async (client, message, args) => {
        Usuario.find({}).sort({ expTotal: -1 }).exec(async function (err, docs) {
            var j = 0;
            var top = new EmbedBuilder()
                .setTitle(message.guild.name)
                .setThumbnail(message.guild.iconURL())
                .setColor('#FFCB00')
                .setDescription(`Este es el top de 10 personas más activas :sparkles:`)
                .addFields(
                    { name: `:first_place: :white_small_square: ${await test(0)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[0 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[0 + j].expTotal}/${calcularNivel(docs[0 + j].expTotal)[1]}\`` },
                    { name: `:second_place: :white_small_square: ${await test(1)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[1 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[1 + j].expTotal}/${calcularNivel(docs[1 + j].expTotal)[1]}\`` },
                    { name: `:third_place: :white_small_square: ${await test(2)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[2 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[2 + j].expTotal}/${calcularNivel(docs[2 + j].expTotal)[1]}\`` }
                )
            for (var i = 3; i < 10; i++) {
                top.addFields(
                    { name: `#${i + 1} :white_small_square: ${await test(i)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[i + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[i + j].expTotal}/${calcularNivel(docs[i + j].expTotal)[1]}\`` }
                )
            }
            message.channel.send({ embeds: [top] });

            async function test(i) {
                try {
                    let member = await message.guild.members.fetch(docs[i + j].idDiscord)
                    return member.user.username;
                } catch {
                    j++;
                    return test(i);
                }
            }
        });
    }
}