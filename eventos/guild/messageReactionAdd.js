const { MENSAJE, ROL } = require("../../config/constantes");

module.exports = async (client, reaction, user) => {
    let emoji = reaction.emoji;
    if (reaction.message.id == MENSAJE.INFO_ROLES) {
        if (emoji.name == '⭐') {
            (await reaction.message.guild.members.fetch(user.id)).roles.add(ROL.BRAWL_STARS);
        } else if (emoji.name == '💥') {
            (await reaction.message.guild.members.fetch(user.id)).roles.add(ROL.SUB);
        } else {
            reaction.remove(user);
        }
    }
}