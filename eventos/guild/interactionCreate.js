const { onClick2048 } = require("../../handlers/juegos/funciones2048");
const { tresEnRaya } = require("../../handlers/juegos/funciones3enRaya");
const { onClickTienda, onClickEquiparAhora } = require("../../handlers/botones/funcionesTienda");
const { onClickMusica } = require("../../handlers/botones/funcionesMusica");
const { onClickPareja } = require("../../handlers/botones/funcionesPareja");
const { onClickVender } = require("../../handlers/botones/funcionesVender");
const { onClickIntercambio } = require("../../handlers/botones/funcionesIntercambiar");
const { onClickRegalo } = require("../../handlers/botones/funcionesRegalo");
const { onClickMostrarMascotas } = require("../../handlers/botones/funcionesMostrarMascota");
const { onClickEvento } = require("../../handlers/botones/funcionesEventos");
const { CANAL_TEXTO } = require("../../config/constantes");

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        let command = client.commands.get(interaction.commandName);
        if (command.channels && !command.channels.includes(interaction.channelId))
            return interaction.reply({
                content: `Este comando solo está disponible en -> <#${command.channels.join(">, <#")}>`,
                ephemeral: true
            })
        try {
            command.run(client, interaction);
        } catch { }
        return;
    }

    if (interaction.customId.startsWith('3enRaya_'))
        tresEnRaya(interaction);
    else if (interaction.customId.startsWith('2048_'))
        onClick2048(interaction);
    else if (interaction.customId.startsWith('tienda_'))
        onClickTienda(interaction);
    else if (interaction.customId.startsWith('musica_'))
        onClickMusica(interaction, client);
    else if (interaction.customId.startsWith('pareja_'))
        onClickPareja(interaction);
    else if (interaction.customId.startsWith('vender_'))
        onClickVender(interaction);
    else if (interaction.customId.startsWith('intercambio_'))
        onClickIntercambio(interaction);
    else if (interaction.customId.startsWith('equiparAhora_'))
        onClickEquiparAhora(interaction);
    else if (interaction.customId.startsWith('regalo_'))
        onClickRegalo(interaction);
    else if (interaction.customId.startsWith('mostrarMascotas_'))
        onClickMostrarMascotas(interaction);
    else if (interaction.customId.startsWith('evento_'))
        onClickEvento(interaction);
}