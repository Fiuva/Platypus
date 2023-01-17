const { CANAL_TEXTO } = require("../../config/constantes");
const { OPTION } = require("../../handlers/commandOptions");
const { findOrCreateDocument, getMentionOrUser, getInteractionUser } = require("../../handlers/funciones");
const { mostrarMascotas } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");

const command_data = {
    name: "mascotas",
    description: `📋 Una lista de tus mascotas`
}

module.exports = {
    ...command_data,
    aliases: ["mostrarmascotas", "pets"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            OPTION.USER
        ]
    },
    run: async (client, interaction) => {
        try {
            var author = getInteractionUser(interaction, `Yo no tengo mascotas :\'<'`);
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }

        let userMascotas = await findOrCreateDocument(author.id, MascotasData);
        if (!userMascotas) return interaction.reply({ content: `${author} no tiene mascotas`, ephemeral: true });

        const [embed, components] = mostrarMascotas(userMascotas, author, interaction.user.id, false);
        interaction.reply({ embeds: [embed], components: [components] });
    }
}