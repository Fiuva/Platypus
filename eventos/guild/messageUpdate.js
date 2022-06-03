const { CONFIG, varOnUpdateMessageEspia } = require("../../config/constantes");
const { cambiarEstadoConMensaje } = require("../../handlers/funciones");

module.exports = async (client, oldMessage, newMessage) => {
    if (![CONFIG.MENSAJE_ESTADO, CONFIG.MENSAJE_AVATAR, CONFIG.MENSAJE_ESPIA].includes(oldMessage.id)) return;
    if (newMessage != oldMessage) {
        switch (oldMessage.id) {
            case CONFIG.MENSAJE_ESTADO:
                cambiarEstadoConMensaje(client);
                break;
            case CONFIG.MENSAJE_AVATAR:
                client.user.setAvatar(newMessage.content);
                break;
            case CONFIG.MENSAJE_ESPIA:
                if (varOnUpdateMessageEspia.update == 'Off')
                    varOnUpdateMessageEspia.setUpdate(newMessage.content);
                break;
        }
    }
    
}
