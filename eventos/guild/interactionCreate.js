const { onClick2048 } = require("../../handlers/juegos/funciones2048");
const { tresEnRaya } = require("../../handlers/juegos/funciones3enRaya");
const { onClickTienda } = require("../../handlers/botones/funcionesTienda");
const { onClickMusica } = require("../../handlers/botones/funcionesMusica");
const { onClickPareja } = require("../../handlers/botones/funcionesPareja");
const { onClickVender } = require("../../handlers/botones/funcionesVender");

module.exports = async (client, button) => {
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
}