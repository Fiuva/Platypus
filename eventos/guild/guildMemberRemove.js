const { GUILD, CANAL_TEXTO } = require("../../config/constantes");
const { desequipar } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");

module.exports = async (client, member) => {
    if (member.guild.id != GUILD.SERVER_PLATY) return;

    if (member.id == "959157740591259658") return;

    member.guild.channels.fetch("837367366227853423")
        .then(channel => channel.setName('Ornitorrincos: ' + member.guild.memberCount));

    member.guild.channels.fetch(CANAL_TEXTO.BIENVENIDA)
        .then(channel => channel.send(`${member.user} ha abandonado la familia de ornitorrincos :'<`))

    let userMacotas = (await MascotasData.find({ idDiscord: member.id }))[0];
    if (userMacotas) {
        desequipar(member.guild, userMacotas);
        if (userMacotas.mascotas.length == 0) {
            await MascotasData.deleteOne({ idDiscord: userMacotas.id });
        }
    }

    try { //mmm no lo he probado
        const mensajes = { total: 0, tiempos: [] }
        await RecapData.findOneAndUpdate({ idDiscord: member.id }, { mensajes: mensajes, fechaMovil: null, fechaDnd: null, fechaOnline: null, fechaIdle: null });
        console.log(`Alguien salió, se modifica su documento de ${member.id}`)
    } catch {
        console.log("No existe el documento");
    }
}