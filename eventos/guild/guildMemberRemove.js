const { GUILD, CANAL_TEXTO } = require("../../config/constantes");

module.exports = async (client, member) => {
    if (member.guild.id != GUILD.SERVER_PLATY) return;

    member.guild.channels.fetch("837367366227853423")
        .then(channel => channel.setName('Ornitorrincos: ' + member.guild.memberCount));

    member.guild.channels.fetch(CANAL_TEXTO.BIENVENIDA)
        .then(channel => channel.send(`${member.user} ha abandonado la familia de ornitorrincos :'<`));

    var recDat = await RecapData.find({ idDiscord: member.id })
    if (recDat[0] != undefined) {
        const mensajes = { total: 0, tiempos: [] }
        await RecapData.findOneAndUpdate({ idDiscord: member.id }, { mensajes: mensajes, fechaMovil: null, fechaDnd: null, fechaOnline: null, fechaIdle: null }, { new: true });
        console.log(`Alguien salió, se modifica su documento de ${member.id}`)
    }
}