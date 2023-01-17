const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const { CANAL_TEXTO } = require('../../config/constantes');
const { OPTION } = require('../../handlers/commandOptions');
const { findOrCreateDocument, getInteractionUser } = require('../../handlers/funciones');
const { calcularNivel, roundRect } = require(`${process.cwd()}/handlers/funciones.js`);
const Usuario = require(`${process.cwd()}/models/usuario`);
Canvas.registerFont('./config/Fonts/Impacted.ttf', { family: "Impacted" });

const command_data = {
    name: "rank",
    description: "🔧 Mira tu nivel de experiencia"
}

module.exports = {
    ...command_data,
    aliases: ["perfil", "nivel"],
    channels: [CANAL_TEXTO.COMANDOS],
    data: {
        ...command_data,
        options: [
            OPTION.USER
        ]
    },
    run: async (client, interaction) => {
        try {
            var author = getInteractionUser(interaction)
        } catch (e) {
            return interaction.reply({ content: e.message, ephemeral: true });
        }
        const user = await findOrCreateDocument(author.id, Usuario);

        var expActual = user.expTotal;
        const { nivel, calcularExp, calcularExpAnterior } = calcularNivel(expActual);

        const canvas = Canvas.createCanvas(1920, 480);
        const ctx = canvas.getContext('2d');
        const color = user.color;


        ctx.fillStyle = '#99aab5';
        roundRect(ctx, 0, 0, 1920, 480, 40, true);
        //Rectangulos____________________________
        ctx.fillStyle = '#000000aa';
        roundRect(ctx, 25, 25, 1290, 430, 40, true);
        roundRect(ctx, 1340, 25, 555, 202.5, 40, true);
        roundRect(ctx, 1340, 252.5, 555, 202.5, 40, true);

        roundRect(ctx, 1390, 328.75, 455, 90, 15, true);
        roundRect(ctx, 1390, 101.25, 455, 90, 15, true);
        roundRect(ctx, 25, 430, 1290, 25, 40, true, true, true);
        ctx.fillStyle = color;
        roundRect(ctx, 25, 430, ((expActual - calcularExp) / (calcularExp - calcularExpAnterior) + 1) * 1290, 25, 40, true, true, true);
        //_____________________________________________
        ctx.font = 'bold 100px "Impacted"';
        ctx.fillStyle = '#ffffffaa';
        let filteredUsers = await Usuario.find().sort({ expTotal: -1 });
        filteredUsers = filteredUsers.filter(user => interaction.member.guild.members.cache.get(user.idDiscord) !== undefined)
        const userIndex = filteredUsers.findIndex(user => user.idDiscord === author.id)
        ctx.fillText(`#${userIndex + 1}`, 1030, 370)

        ctx.font = 'bold 100px Arial';
        ctx.fillStyle = color;
        ctx.fillText(`${author.username}`, 450, 150);
        var mensajePareja;
        var y;
        if (user.parejaId == '0') {
            mensajePareja = '*solter@*';
            y = 350;
            ctx.fillStyle = '#ffffff88';
        } else {
            ctx.font = '55px Arial';
            try {
                let member = await interaction.guild.members.fetch(user.parejaId);
                mensajePareja = member.user.username;
            } catch {
                mensajePareja = 'PERDIDA'
            }
            y = 250;
            date = new Date();
            let fecha1 = new Date(user.fechaPareja);
            let restaFechas = date.getTime() - fecha1.getTime();
            var diasCasados = Math.round(restaFechas / (1000 * 60 * 60 * 24));
            ctx.fillStyle = '#00000033';
            roundRect(ctx, 440, 290, 180 + ctx.measureText(diasCasados).width, 90, 20, true);
            ctx.fillStyle = '#ffffffaa';
            ctx.fillText(`D\u00edas: ${diasCasados}`, 450, 350);

            if (interaction.guild.members.cache.get(user.parejaId) == undefined) {
                ctx.fillStyle = '#000000';
            } else if (diasCasados >= 150) {
                ctx.fillStyle = '#37FF19'; //esmeralda
            } else if (diasCasados >= 125) {
                ctx.fillStyle = '#19EEFF'; //diamante
            } else if (diasCasados >= 100) {
                ctx.fillStyle = '#0035C7'; //lapislazul
            } else if (diasCasados >= 75) {
                ctx.fillStyle = '#E9FF00'; //oro
            } else if (diasCasados >= 50) {
                ctx.fillStyle = '#E40000'; //rojo
            } else if (diasCasados >= 25) {
                ctx.fillStyle = '#E7E7E7'; //plata
            } else {
                ctx.fillStyle = '#794B00'; //marron
            }
        }
        ctx.font = 'bold 70px Arial';
        ctx.fillText(`Pareja: ` + mensajePareja, 450, y);
        ctx.font = 'bold 45px "Impacted"';
        ctx.fillStyle = '#ffffff88';
        ctx.fillText(`NIVEL`, 1570, 88.75);
        ctx.fillText(`EXP`, 1580, 316.25);
        ctx.font = '60px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nivel, 1597 - ctx.measureText(nivel).width / 2 + 20, 162); // 1597 162
        ctx.font = '50px Arial';
        ctx.fillText(`${expActual}/${calcularExp}`, 1597 - ctx.measureText(`${expActual}/${calcularExp}`).width / 2 + 20, 385);
        ctx.font = 'italic 80px Arial';
        ctx.fillStyle = color + '88';
        ctx.fillText(`${author.tag.replace(author.username, '')}`, 440 + ctx.measureText(author.username).width * 1.4, 151.5);
        ctx.beginPath();
        ctx.arc(240, 240, 125, 0, Math.PI * 2, true); //ref1: 1700, 250, 200
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(author.displayAvatarURL({ extension: 'jpg' }));
        ctx.drawImage(avatar, 115, 115, 250, 250); //ref1: 1500, 50, 400, 400
        const attachment = new AttachmentBuilder(canvas.toBuffer(), 'imagenRank.png');
        interaction.reply({ files: [attachment] });
    }
}