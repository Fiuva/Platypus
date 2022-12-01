const { CANAL_TEXTO } = require("../../config/constantes");
const { findOrCreateDocument, getMentionOrUser } = require("../../handlers/funciones");
const { mostrarMascotas } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");

module.exports = {
    name: "mascotas",
    aliases: ["mostrarmascotas", "pets"],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Una lista de tus mascotas",
    run: async (client, message, args) => {
        var author = getMentionOrUser(message);
        let userMascotas = await findOrCreateDocument(author.id, MascotasData);
        if (!userMascotas) return message.reply(`${author} no tiene mascotas`);

        const [embed, components] = mostrarMascotas(userMascotas, author, message.author.id, false);
        message.reply({ embeds: [embed], components: [components] });
    }
}