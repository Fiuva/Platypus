const { onClick2048 } = require("../../handlers/juegos/funciones2048");
const { tresEnRaya } = require("../../handlers/juegos/funciones3enRaya");
const { onClickTienda, onClickEquiparAhora } = require("../../handlers/botones/funcionesTienda");
const { onClickMusica } = require("../../handlers/botones/funcionesMusica");
const { onClickPareja } = require("../../handlers/botones/funcionesPareja");
const { onClickVender } = require("../../handlers/botones/funcionesVender");
const { onClickIntercambio } = require("../../handlers/botones/funcionesIntercambiar");


module.exports = async (client, button) => {
    if (button.isCommand()) {
        if (button.commandName == 'hola') {
            try {
                await button.user.send('Hola humano/a :>')
                button.reply({ content: 'Ya te envié un mensaje :>', ephemeral: true })
            } catch (e) {
                button.reply({ content: 'No tienes los MDs activados o me has bloqueado :<', ephemeral: true })
            }
        }
        return;
    }

    if (button.customId.startsWith('3enRaya_'))
        tresEnRaya(button);
    else if (button.customId.startsWith('2048_'))
        onClick2048(button);
    else if (button.customId.startsWith('tienda_'))
        onClickTienda(button);
    else if (button.customId.startsWith('musica_'))
        onClickMusica(button, client);
    else if (button.customId.startsWith('pareja_'))
        onClickPareja(button);
    else if (button.customId.startsWith('vender_'))
        onClickVender(button);
    else if (button.customId.startsWith('intercambio_'))
        onClickIntercambio(button);
    else if (button.customId.startsWith('equiparAhora_'))
        onClickEquiparAhora(button);
}
