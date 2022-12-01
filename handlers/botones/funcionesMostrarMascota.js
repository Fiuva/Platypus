const { MascotasData } = require("../../models/mascotas");
const { findOrCreateDocument } = require("../funciones");
const { mostrarMascotas } = require("../juegos/funcionesMascotas");

var onClickMostrarMascotas = async function (button) {
    var id = button.customId.split('_');
    var authorInteraction = button.user;
    var deNavidad = id[1] == "navidad";

    var author = (await button.guild.members.fetch(id[2])).user;
    let userMascotas = await findOrCreateDocument(author.id, MascotasData);
    const [embed, components] = mostrarMascotas(userMascotas, author, id[3], deNavidad);

    if (id[3] == authorInteraction.id) {
        button.update({ embeds: [embed], components: [components] });
    } else {
        button.reply({ embeds: [embed], components: [components], ephemeral: true });
    }
}

module.exports = { onClickMostrarMascotas };