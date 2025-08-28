const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const gemini = require("../../models/Gemini");

const command_data = {
    name: "imagen",
    description: `🖼️ Genera una imagen usando IA`
}

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
        return await interaction.editReply('Actualmente ya no se puede generar imágenes (de momento).');
        const prompt = interaction.options.getString('prompt');
        try {
            const { text, base64Image } = await gemini.generateImage(prompt);
            if (base64Image) {
                let embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(prompt.length > 256 ? prompt.slice(0, 253) + '...' : prompt)
                    .setImage('attachment://image.png'); 
                await interaction.editReply({ 
                    content: text,
                    embeds: [embed],
                    files: [{
                        attachment: base64Image,
                        name: 'image.png'
                    }]
                 });
            } else {
                await interaction.editReply('No se pudo generar la imagen');
            }

        } catch (err) {
            await interaction.editReply('Hubo un error al generar la imagen');
            console.error(err);
        }
    }
};