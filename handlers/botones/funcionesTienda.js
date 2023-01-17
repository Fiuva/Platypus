const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { PRECIO, ROL, MONEDAS } = require('../../config/constantes');
const { wiki, Calidad, MascotasData, Mascota, Tipo_Huevo } = require('../../models/mascotas');
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
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${MONEDAS.PC.NOMBRE}`, ephemeral: true });
            }
            break;
        case 'millonario':
            if (authorInteraction.roles.cache.has(ROL.MILLONARIO)) {
                button.reply({ content: `${authorInteraction.user} ya tienes el rol de millonario`, ephemeral: true })
            } else if (monedasUser < PRECIO.MILLONARIO) {
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${MONEDAS.PC.NOMBRE}`, ephemeral: true })
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
                button.reply({ content: `${authorInteraction.user} no tienes suficientes ${MONEDAS.PC.NOMBRE}`, ephemeral: true })
            } else {
                await Usuario.findOneAndUpdate({ idDiscord: idUser }, { monedas: monedasUser - PRECIO.MUSICA_PRO }, { new: true });
                var rolMus = button.guild.roles.cache.get(ROL.MUSICA_PRO);
                authorInteraction.roles.add(rolMus);
                button.reply(`${authorInteraction.user} ahora puedes usar comandos especiales en el canal de musica :)`);
            }
            break;
    }
}

async function abrir(huevo, userUsuario, interaction, collected, components) {
    let monedas, tipo_huevo, nombreMonedas;
    if (huevo.TIPO == Tipo_Huevo.Navidad) {
        monedas = userUsuario.pavos;
        tipo_huevo = Tipo_Huevo.Navidad;
        nombreMonedas = MONEDAS.NAVIDAD.NOMBRE;
    } else {
        monedas = userUsuario.monedas;
        tipo_huevo = Tipo_Huevo.Normal;
        nombreMonedas = MONEDAS.PC.NOMBRE;
    }

    if (monedas < huevo.PRECIO)
        throw new Error(`No tienes suficientes monedas, el huevo vale **${huevo.PRECIO} ${nombreMonedas}**`);

    const user = collected.user;
    const userMascotas = await findOrCreateDocument(user.id, MascotasData);
    const prob = Math.random();

    var mascotaQueSale;

    const probHuevo = huevo.PROBABILIDAD;
    if (prob < probHuevo.COMUN) { //SALE COMUN
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Comun, tipo_huevo)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL) { //SALE ESPECIAL
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Especial, tipo_huevo)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL + probHuevo.RARO) { //SALE RARO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Raro, tipo_huevo)));
    } else if (prob < probHuevo.COMUN + probHuevo.ESPECIAL + probHuevo.RARO + probHuevo.ULTRA_RARO) { //SALE ULTRA RARO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Ultra_raro, tipo_huevo)));
    } else { //SALE LEGENDARIO
        mascotaQueSale = new Mascota(random(wiki.filterAnimalesByCalidad(Calidad.Legendario, tipo_huevo)));
    }

    const embed = new EmbedBuilder()
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
    await modificarMonedas(userMascotas.idDiscord, -huevo.PRECIO, userUsuario, tipo_huevo == Tipo_Huevo.Navidad);

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
        const botonEquipar = new ButtonBuilder()
            .setLabel('Equipar ahora')
            .setCustomId(`equiparAhora_${mascotaQueSale.refUltimoRol}_${userMascotas.idDiscord}`)
            .setStyle('Success')
        await collected.reply({ content: `${user} has comprado un huevo :>`, embeds: [embed], components: [new ActionRowBuilder().addComponents(botonEquipar)] });
        try {
            interaction.editReply({ embeds: collected.message.embeds, components: components })
        } catch { }
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
                await button.reply({ content: `Mascota equipada`, ephemeral: true });
            } catch (e) {
                await button.reply({ content: e.message, ephemeral: true });
            }
        } else {
            await button.reply({ content: `No tienes esa mascota`, ephemeral: true });
        }
    } else {
        await button.reply({ content: `Botón caducado :'> equípatela con !equipar`, ephemeral: true });
    }
}


module.exports = { onClickTienda, abrir, onClickEquiparAhora };