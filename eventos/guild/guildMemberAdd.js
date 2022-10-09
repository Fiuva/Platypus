const Canvas = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const { GUILD, CANAL_TEXTO } = require("../../config/constantes");
Canvas.registerFont('./config/Fonts/Impacted.ttf', { family: "Impacted" });

module.exports = async (client, member) => {
    if (member.guild.id != GUILD.SERVER_PLATY) return;

    if (member.id == "959157740591259658") {
        await member.kick();
        return;
    } 

    //Actualiza numero de usuarios
    member.guild.channels.fetch("837367366227853423")
        .then(channel => channel.setName('Ornitorrincos: ' + member.guild.memberCount));

    //Envía imagen de bienvenida
    member.guild.channels.fetch(CANAL_TEXTO.BIENVENIDA)
        .then(async channel => 
            channel.send({
                content: `**Bienvenid@ ${member.user}, que lo pases bien!** 🤤`,
                //files: [await crearImagen(member)] //_arreglar_
            })
        );
}

async function crearImagen(member) {
    console.log("Se crea una imagen");
    const canvas = Canvas.createCanvas(1600, 814);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./config/Imagenes/platyWall.jpg');
    let x = 0;
    let y = 0;
    ctx.drawImage(background, x, y);

    ctx.font = '125px "Impacted"';
    //Rectangulo letras____________________________
    ctx.fillStyle = '#00000088';
    //ctx.fillRect(0, 320, 135 + ctx.measureText(member.user.username).width, 165); //730 + message.author.username.length * 53.5
    //_____________________________________________0 320 1000 165
    ctx.fillStyle = '#000000';
    ctx.fillText(`${member.user.username}!`, 50, 275);
    ctx.fillText(`Bienvenido`, 50, 135);
    ctx.fillStyle = '#ECCCFF';
    ctx.fillText(`${member.user.username}!`, 65, 265);
    ctx.fillText(`Bienvenido`, 65, 125);

    ctx.beginPath();
    ctx.arc(1380, 595, 200, 0, Math.PI * 2, true); //1700, 250, 250
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(avatar, 1215, 430, 330, 330); //1500, 50, 400, 400

    return new AttachmentBuilder(canvas.toBuffer(), 'imagen_de_bienvenida.png');
}