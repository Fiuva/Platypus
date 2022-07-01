const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { PRECIO, NOMBRE_MONEDAS, ROL } = require('../../config/constantes');
const { wiki, Calidad, MascotasData, Mascota } = require('../../models/mascotas');
const Usuario = require('../../models/usuario');
const { findOrCreateDocument, random, modificarMonedas } = require('../funciones');
var gis = require('g-i-s');
const { equiparMascota } = require('../juegos/funcionesMascotas');


var onClickTienda = async function (button) {
    var id = button.customId.split('_');
    var idUser = button.user.id;
    var authorInteraction = await button.guild.members.fetch(idUser);
    var userInteraction = await Usuario.find({ idDiscord: idUser }).exec();
    var monedasUser = userInteraction[0].monedas;

    switch (id[1]) {
        case 'anillo':
            var anillosUser = userInteraction[0].anillo;
            if (anillosUser < 2 && monedasUser >= PRECIO.ANILLO) {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { anillo: anillosUser + 1, monedas: monedasUser - PRECIO.ANILLO }, { new: true });
                button.reply(`${authorInteraction.user} ha comprado un anillo`);
            } else if (anillosUser >= 2) {
                button.reply({ content: `${authorInteraction.user} ya has tienes el máximo de anillos (2)`, ephemeral: true });
            } else {
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`, ephemeral: true });
            }
            break;
        case 'millonario':
            if (authorInteraction.roles.cache.has(ROL.MILLONARIO)) {
                button.reply({ content: `${authorInteraction.user} ya tienes el rol de millonario`, ephemeral: true })
            } else if (monedasUser < PRECIO.MILLONARIO) {
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`, ephemeral: true })
            } else {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser - PRECIO.MILLONARIO }, { new: true });
                var rolMill = button.guild.roles.cache.get(ROL.MILLONARIO);
                authorInteraction.roles.add(rolMill);
                button.reply(`${authorInteraction.user} ahora es millonario!!!`);
            }
            break;
        case 'musica-pro':
            if (authorInteraction.roles.cache.has(ROL.MUSICA_PRO)) {
                button.reply({ content: `${authorInteraction.user} ya tienes el rol de música`, ephemeral: true })
            } else if (monedasUser < PRECIO.MUSICA_PRO) {
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${NOMBRE_MONEDAS}`, ephemeral: true })
            } else {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser - PRECIO.MUSICA_PRO }, { new: true });
                var rolMus = button.guild.roles.cache.get(ROL.MUSICA_PRO);
                authorInteraction.roles.add(rolMus);
                button.reply(`${authorInteraction.user} ahora puedes usar comandos especiales en el canal de musica :)`);
            }
            break;
    }
}

async function abrir(huevo, monedas, message, collected, components) {
    if (monedas < huevo.PRECIO)
        throw new Error(`No tienes suficientes monedas, el huevo vale ${huevo.PRECIO}`);

    const user = collected.user;
    const userMascotas = await findOrCreateDocument(user.id, MascotasData);
    const prob = Math.random();

    var mascotaQueSale;

    const probHuevo = huevo.PROBABILIDAD;
    if (prob < probHuevo.COMUN) { //SALE COMUN
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Comun)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL) { //SALE ESPECIAL
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Especial)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL + probHuevo.RARO) { //SALE RARO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Raro)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL + probHuevo.RARO + probHuevo.ULTRA_RARO) { //SALE ULTRA RARO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Ultra_raro)));
    } else { //SALE LEGENDARIO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Legendario)));
    }

    const embed = new MessageEmbed()
        .setTitle(mascotaQueSale.nombre)
        .addFields(
            { name: `Clase: `, value: mascotaQueSale.animal.clase, inline: true },
            { name: `Hábitat: `, value: mascotaQueSale.animal.habitat, inline: true },
            { name: `Calidad: `, value: mascotaQueSale.animal.calidad.nombre, inline: true }
        )
        .setColor(mascotaQueSale.animal.calidad.color)
        .setDescription(`Se ha abierto un \"${huevo.NOMBRE}\"`)
        .setFooter({ text: `Propiedad de: ${user.username}`, iconURL: user.displayAvatarURL({ format: 'png' }) })
        .setTimestamp(new Date());

    await MascotasData.findOneAndUpdate({ idDiscord: userMascotas.idDiscord }, { $push: { mascotas: mascotaQueSale } });
    await modificarMonedas(userMascotas.idDiscord, -huevo.PRECIO);

    var opts = {
        searchTerm: mascotaQueSale.nombre,
        queryStringAddition: '&tbs=ic:trans',
        filterOutDomains: [
            'pinterest.com',
            'deviantart.com'
        ]
    };
    await gis(opts, async (error, results) => {
        if (!error) {
            try {
                result = results[Math.random() * 30 << 0]
                embed.setImage(result.url);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log(error);
        }
        const botonEquipar = new MessageButton()
            .setLabel('Equipar ahora')
            .setCustomId(`equiparAhora_${mascotaQueSale.refUltimoRol}_${userMascotas.idDiscord}`)
            .setStyle('SUCCESS')
        await message.channel.send({ content: `${user} has comprado un huevo :>`, embeds: [embed], components: [new MessageActionRow().addComponents(botonEquipar)] });
        await collected.deferUpdate();
        collected.editReply({ embeds: collected.message.embeds, components: components })
    });
}

var onClickEquiparAhora = async function (button) {
    var id = button.customId.split('_');
    var idUser = button.user.id;

    if (id[2] == idUser) {
        const userMascotas = await findOrCreateDocument(idUser, MascotasData);
        var authorInteraction = await button.guild.members.fetch(idUser);
        let mascota = userMascotas.mascotas.find(m => m.refUltimoRol == id[1]);
        if (mascota) {
            try {
                await equiparMascota(mascota, userMascotas, authorInteraction);
                button.reply({ content: `Mascota equipada`, ephemeral: true });
            } catch (e) {
                button.reply({ content: e.message, ephemeral: true });
            }
        } else {
            button.reply({ content: `No tienes esa mascota`, ephemeral: true });
        }
    } else {
        button.reply({ content: `Botón caducado :'> equípatela con !equipar`, ephemeral: true }); ç
    }
}


module.exports = { onClickTienda, abrir, onClickEquiparAhora };