const { GUILD, CANAL_TEXTO } = require("../../config/constantes");

module.exports = async (client, member) => {
    if (member.guild.id != GUILD.SERVER_PLATY) return;

    member.guild.channels.cache.get("837367366227853423")
        .channel.setName('Ornitorrincos: ' + member.guild.memberCount);

    member.guild.channels.cache.get(CANAL_TEXTO.BIENVENIDA)
        .channel.send(`${member.user} ha abandonado la familia de ornitorrincos :'<`);

    try { //mmm no lo he probado
        const mensajes = { total: 0, tiempos: [] }
        await RecapData.findOneAndUpdate({ idDiscord: member.id }, { mensajes: mensajes, fechaMovil: null, fechaDnd: null, fechaOnline: null, fechaIdle: null });
        console.log(`Alguien salió, se modifica su documento de ${member.id}`)
    } catch {
        console.log("No existe el documento");
    }
}