const { CANAL_TEXTO } = require("../../config/constantes");
const Usuario = require("../../models/usuario");

module.exports = {
    name: "color",
    aliases: [],
    canales: [CANAL_TEXTO.COMANDOS],
    description: "Cambai tu color del perfil (!rank)",
    run: async (client, message, args) => {
        if (args[0] == undefined) return message.channel.send(`${message.author} escriba el codigo del color que desee (de esta forma: "#FFFFFF" o estos colores: azul, blanco, morado, amarillo, rojo, verde, naranja, rosa o default)`);
        
        var colorMensaje = args[0].toLowerCase();
        var colDef;
        if (colorMensaje.startsWith('#') && colorMensaje.length == 7) {
            colDef = colorMensaje;
        } else if (colorMensaje == 'azul') {
            colDef = '#0000FF';
        } else if (colorMensaje == 'blanco') {
            colDef = '#ffffff';
        } else if (colorMensaje == 'morado') {
            colDef = '#B400FF';
        } else if (colorMensaje == 'amarillo') {
            colDef = '#FFFF00';
        } else if (colorMensaje == 'rojo') {
            colDef = '#FF0000';
        } else if (colorMensaje == 'rosa') {
            colDef = '#FF00FF';
        } else if (colorMensaje == 'verde') {
            colDef = '#00ff00';
        } else if (colorMensaje == 'naranja') {
            colDef = '#FF7F00';
        } else if (colorMensaje == 'default') {
            colDef = '#7289da';
        }
        else {
            message.channel.send(`${message.author} escriba el codigo del color que desee (de esta forma: "#FFFFFF" o estos colores: azul, blanco, morado, amarillo, rojo, verde, naranja, rosa o default)`);
            return;
        }
        await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { color: colDef }, { new: true });
        message.channel.send(`${message.author} se ha modificado su color de !rank correctamente`);
    }
}