const { CANAL_VOZ, CATEGORIA } = require("../../config/constantes");

module.exports = async (client, oldMember, newMember) => {
    let newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    if (oldUserChannel != newUserChannel) {
        if (oldUserChannel == undefined && newUserChannel != undefined) {
            //ENTRAR (a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
        } else if (newUserChannel == undefined) {
            //SALIR (de oldUserChannel)
            eliminarCanalDeVoz(oldUserChannel);
        } else {
            //CAMBIAR (de oldUserChannel a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
            eliminarCanalDeVoz(oldUserChannel);
        }
    }

    function crearCanalDeVoz(idCanalEntrante) {
        if (![CANAL_VOZ.GAMING_DUO, CANAL_VOZ.GAMING_TRIO, CANAL_VOZ.GAMING_CUARTETO, CANAL_VOZ.GAMING_QUINTETO].includes(idCanalEntrante)) return;
        var nombreNuevoCanal;
        var limiteUsuarios;
        switch (idCanalEntrante) {
            case CANAL_VOZ.GAMING_DUO:
                nombreNuevoCanal = "D\u00fao de " + newMember.member.user.username;
                limiteUsuarios = 2;
                break;
            case CANAL_VOZ.GAMING_TRIO:
                nombreNuevoCanal = "Tr\u00edo de " + newMember.member.user.username;
                limiteUsuarios = 3;
                break;
            case CANAL_VOZ.GAMING_CUARTETO:
                nombreNuevoCanal = "Squad de " + newMember.member.user.username;
                limiteUsuarios = 4;
                break;
            case CANAL_VOZ.GAMING_QUINTETO:
                nombreNuevoCanal = "Quinteto de " + newMember.member.user.username;
                limiteUsuarios = 5;
                break;
        }
        newMember.guild.channels.create(nombreNuevoCanal, {
            type: 'GUILD_VOICE'
        }).then((channel) => {
            channel.setParent(CATEGORIA.GAMING_VOZ);
            channel.setUserLimit(limiteUsuarios);
            newMember.setChannel(channel);
        })
    }
    function eliminarCanalDeVoz(CanalSaliente) {
        if (!CanalSaliente.name.startsWith("D\u00fao de ") && !CanalSaliente.name.startsWith("Tr\u00edo de ") && !CanalSaliente.name.startsWith("Squad de ") && !CanalSaliente.name.startsWith("Quinteto de ")) return;
        if (CanalSaliente.members.size == 0) {
            CanalSaliente.delete();
        }
    }
}