const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { getInteractionUser, findOrCreateDocument } = require("../../handlers/funciones");
const Usuario = require("../../models/usuario");

const command_data = {
    name: "casar",
    description: `💍 Sirve para formar una bonita pareja :))`
}

module.exports = {
    ...command_data,
    channels: [CANAL_TEXTO.GENERAL],
    aliases: ["casarse"],
    data: {
        ...command_data,
        options: [
            {
                ...OPTION.USER,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        try {
            var parejaUser = getInteractionUser(interaction, `No te puedes casar conmigo :c`, true);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }

        var user = await findOrCreateDocument(interaction.user.id, Usuario);
        var toUser = await findOrCreateDocument(parejaUser.id, Usuario);

        if (user.parejaId != '0') {
            try {
                var parejaName = (await interaction.guild.members.fetch(user.parejaId)).displayName
            } catch {
                var parejaName = '\`pareja perdida\`'
            }

            let embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} ya tienes a ${parejaName} como pareja, para poder casarte con otra persona **divórciate antes** -> </divoraciar:0>`)
                .setColor("#E93E3E")

            return interaction.reply({ embeds: [embed] });
        }

        if (toUser.parejaId != '0') {
            let embed = new EmbedBuilder()
                .setDescription(`${parejaUser.username} ya tiene pareja`)
                .setColor("#E93E3E")
            return interaction.reply({ embeds: [embed] });
        }

        if (user.anillo >= 2) {
            const casar = new ButtonBuilder()
                .setLabel('Casarse')
                .setCustomId(`pareja_casar_${parejaUser.id}_${interaction.user.id}`)
                .setStyle('Success')
                .setEmoji('✅')
            const rechazar = new ButtonBuilder()
                .setLabel('Rechazar')
                .setCustomId(`pareja_rechazar_${parejaUser.id}_${interaction.user.id}`)
                .setStyle('Danger')
                .setEmoji('❌')
            const casarRow = new ActionRowBuilder()
                .addComponents(casar, rechazar)
            let embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} se quiere casar con ${parejaUser.username}`)
                .setColor(user.color)
            interaction.reply({
                content: `Aceptas ${parejaUser}?`,
                embeds: [embed],
                components: [casarRow]
            });
        } else {
            let embed = new EmbedBuilder()
                .setDescription(`${interaction.user.username} necesitas dos anillos para casarte, ve a la tienda (<#${CANAL_TEXTO.COMANDOS}> -> </tienda:0>)`)
                .setColor("#1D1D1D")
            interaction.reply({ embeds: [embed] });
        }
    }
}