const { EmbedBuilder } = require("discord.js");
const { MONEDAS } = require("../../config/constantes");
const { modificarMonedas } = require("../funciones");

var onClickEvento = async function (button) {
    var id = button.customId.split('_');
    switch (id[1]) {
        case 'beso':
            switch (id[2]) {
                case 'aceptar':
                    if (button.user.id == id[3]) {
                        let member = await button.guild.members.fetch(id[4])
                        let coins = Math.random() * 100 << 0;
                        await modificarMonedas(member.id, coins);
                        button.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${button.user} ha aceptado el beso de ${member} 💞`)
                                    .setFooter({ text: `${member.user.username} gana ${coins} ${MONEDAS.PC.NOMBRE}` })
                                    .setColor('#5FE452')
                            ],
                            components: []
                        });
                    } else {
                        button.deferUpdate();
                    }
                    break;
                case 'rechazar':
                    if (button.user.id == id[3]) {
                        let member = await button.guild.members.fetch(id[4])
                        button.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${button.user} ha rechazado el beso de ${member}`)
                                    .setColor('#E72727')
                            ],
                            components: []
                        });
                    } else {
                        button.deferUpdate();
                    }
                    break;

                default:
                    break;
            }

        default:
            break;
    }
}

module.exports = { onClickEvento };