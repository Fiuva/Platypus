const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Leonardo = require('../../models/Leonardo');

const command_data = {
    name: "imagen",
    description: `🖼️ Genera una imagen usando IA`
}

const leonardo = new Leonardo();

module.exports = {
    ...command_data,
    data: {
        ...command_data,
        options: [
            {
                name: `prompt`,
                description: `El texto que se usará para generar la imagen`,
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    run: async (client, interaction) => {
        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt');
        try {
            const imagen = await leonardo.generateImage(prompt);
            if (!imagen) {
                const now = new Date();
                const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const nextDayTimestamp = Math.floor(tomorrow.getTime() / 1000);
                await interaction.editReply(`No se pudo generar la imagen, faltan tokens. Se podrá usar este comando <t:${nextDayTimestamp}:R>.`);
                return;
            }
            let url = imagen[0].url;
            let embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTitle(prompt.length > 256 ? prompt.slice(0, 253) + '...' : prompt)
                .setImage(url);

            await interaction.editReply({ embeds: [embed] });
        } catch (err) {
            await interaction.editReply('Hubo un error al generar la imagen');
            console.error(err);
        }
    }
};