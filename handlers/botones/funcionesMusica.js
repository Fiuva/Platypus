const { MessageActionRow } = require("discord.js");

var onClickMusica = async function (button, client) {
    var id = button.customId.split('_');
    if (id[1] == "resume") {
        client.distube.resume(button.message);
        var nb = button.message.components[0].components[0];
        nb.setEmoji('▶');
        nb.setDisabled(true);
        await button.message.edit({ components: [new MessageActionRow().addComponents(nb)] })
        button.deferUpdate();
    }
}

module.exports = { onClickMusica };