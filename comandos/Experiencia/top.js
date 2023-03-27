const { EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO, EVENTOS } = require("../../config/constantes");
const { calcularNivel } = require("../../handlers/funciones");
const { rank2048 } = require("../../handlers/juegos/funciones2048");
const Usuario = require("../../models/usuario");
const { ApplicationCommandOptionType } = require("../../node_modules/discord-api-types/v10");

const command_data = {
    name: "top",
    description: `🔝 El ranking de la gente más activa del server`
}

module.exports = {
    ...command_data,
    aliases: ["lb", "ranking"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            {
                name: `experiencia`,
                description: command_data.description,
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: `temporada`,
                        description: `Temporada del servidor`,
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: `Temporada 1`,
                                value: `temporada_1`
                            },
                            {
                                name: `Temporada 2`,
                                value: `temporada_2`
                            },
                        ],
                        required: false
                    }
                ]
            },
            {
                name: '2048',
                description: `🔝 El ranking del /2048 🎮`,
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },
    run: async (client, interaction) => {
        const temporada_default = `temporada_${EVENTOS.TEMPORADA}`;
        const temporada = interaction.options.getString('temporada') ?? temporada_default
        switch (interaction.options.getSubcommand()) {
            case 'experiencia':
                if (temporada == temporada_default)
                    mostrarRankExp(interaction);
                else
                    mostrarRankExpTemporada(interaction, temporada.split('_')[1])
                break;
            case '2048':
                rank2048(interaction);
                break;
        }
    }
}

async function mostrarRankExp(interaction) {
    const docs = await Usuario.find().sort({ expTotal: -1 })
    var j = 0;
    const top3 = [
        {
            user: await test(0),
            cn: calcularNivel(docs[0 + j].expTotal),
            expTotal: docs[0 + j].expTotal
        },
        {
            user: await test(1),
            cn: calcularNivel(docs[1 + j].expTotal),
            expTotal: docs[1 + j].expTotal
        },
        {
            user: await test(2),
            cn: calcularNivel(docs[2 + j].expTotal),
            expTotal: docs[2 + j].expTotal
        }
    ];

    var top = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#FFCB00')
        .setDescription(`Este es el top de 10 personas más activas :sparkles:`)
        .addFields(
            { name: `:first_place: :white_small_square: ${top3[0].user}`, value: `:black_small_square: Nivel: \`${top3[0].cn.nivel}\` \n :black_small_square: Exp: \`${top3[0].expTotal}/${top3[0].cn.calcularExp}\`` },
            { name: `:second_place: :white_small_square: ${top3[1].user}`, value: `:black_small_square: Nivel: \`${top3[1].cn.nivel}\` \n :black_small_square: Exp: \`${top3[1].expTotal}/${top3[1].cn.calcularExp}\`` },
            { name: `:third_place: :white_small_square: ${top3[2].user}`, value: `:black_small_square: Nivel: \`${top3[2].cn.nivel}\` \n :black_small_square: Exp: \`${top3[2].expTotal}/${top3[2].cn.calcularExp}\`` }
        )
    for (var i = 3; i < 10; i++) {
        let posicion = {
            user: await test(i),
            cn: calcularNivel(docs[i + j].expTotal),
            expTotal: docs[i + j].expTotal
        }
        top.addFields(
            { name: `#${i + 1} :white_small_square: ${posicion.user}`, value: `:black_small_square: Nivel: \`${posicion.cn.nivel}\` \n :black_small_square: Exp: \`${posicion.expTotal}/${posicion.cn.calcularExp}\`` }
        )
    }
    interaction.reply({ embeds: [top] });

    async function test(i) {
        try {
            let member = await interaction.guild.members.fetch(docs[i + j].idDiscord)
            return member.user.username;
        } catch (e) {
            j++;
            return test(i);
        }
    }
}

async function mostrarRankExpTemporada(interaction, temporada) {
    const docs = await Usuario.find().sort({ [`expTemporadas.${temporada}`]: -1 });

    var j = 0;
    const top3 = [
        {
            user: await test(0),
            expTotal: docs[0 + j].expTemporadas[`${temporada}`] ?? 0
        },
        {
            user: await test(1),
            expTotal: docs[1 + j].expTemporadas[`${temporada}`] ?? 0
        },
        {
            user: await test(2),
            expTotal: docs[2 + j].expTemporadas[`${temporada}`] ?? 0
        }
    ];

    var top = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#F74A97')
        .setDescription(`Este es el top de 10 personas más activas :sparkles: \n 🫣**Temporada ${temporada}**`)
        .addFields(
            { name: `:first_place: :white_small_square: ${top3[0].user}`, value: `:black_small_square: Exp: \`${top3[0].expTotal}\`` },
            { name: `:second_place: :white_small_square: ${top3[1].user}`, value: `:black_small_square: Exp: \`${top3[1].expTotal}\`` },
            { name: `:third_place: :white_small_square: ${top3[2].user}`, value: `:black_small_square: Exp: \`${top3[2].expTotal}\`` }
        )
    for (var i = 3; i < 10; i++) {
        let posicion = {
            user: await test(i),
            expTotal: docs[i + j].expTemporadas[`${temporada}`]
        }
        top.addFields(
            { name: `#${i + 1} :white_small_square: ${posicion.user}`, value: `:black_small_square: Exp: \`${posicion.expTotal}\`` }
        )
    }
    interaction.reply({ embeds: [top] });

    async function test(i) {
        try {
            let member = await interaction.guild.members.fetch(docs[i + j].idDiscord)
            return member.user.username;
        } catch (e) {
            j++;
            return test(i);
        }
    }
}