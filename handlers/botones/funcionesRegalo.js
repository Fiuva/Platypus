const { MONEDAS } = require('../../config/constantes');
const { modificarMonedas } = require('../funciones');
const { EmbedBuilder } = require("discord.js")

var onClickRegalo = async function (button) {
    var id = button.customId.split('_');
    var idUser = button.user.id;
    var authorInteraction = button.user;
    var userInteraction = null;
    if (id[1] == "navidad") {
        switch (id[2]) {
            case 'sum':
                const premio = parseInt(id[3])
                modificarMonedas(idUser, premio, userInteraction, true);
                var regalo = new EmbedBuilder()
                    .setColor("#EBEF45")
                    .setTitle(`¡${authorInteraction.username} ha abierto un regalo!`)
                    .setAuthor({ name: "Regalo", iconURL: "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f381.png" })
                    .setDescription(`Has conseguido **${premio} ${MONEDAS.NAVIDAD.EMOTE}**`)

                button.update({ embeds: [regalo], components: [] })
                break;
            case 'perdido':
                var regalo = new EmbedBuilder()
                    .setColor("#4B4C1E")
                    .setTitle(`¡${authorInteraction.username} ha perdido un regalo!`)
                    .setAuthor({ name: "Regalo", iconURL: "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f381.png" })
                    .setDescription(`Ha fallado al abrirlo :c`)

                button.update({ embeds: [regalo], components: [] })
                break;
        }
    }
}

module.exports = { onClickRegalo };