const cheerio = require('cheerio');
const axios = require('axios');
const { EmbedBuilder } = require("discord.js");
const { TwitterApi } = require('twitter-api-v2');
const { PRIVATE_CONFIG } = require('../config/constantes');

const URL = 'https://www.diainternacionalde.com';


const diainternacionalde = {
    URL: URL,
    getCategorizedResults: async function (url = this.URL) {
        try {
            const response = await axios.get(url);
            const html = response.data;

            const $ = cheerio.load(html);

            const sectionId = "contenido";
            const articles = $(`#${sectionId} article`);
            var foundWeek = false;

            var results = await Promise.all(articles.map(async (index, element) => {
                if (foundWeek) return null;
                const article = $(element);
                const date = article.find(".fecha").text();
                if (date == '') return null;
                const paises = article.find(".paises").text() || ' ';
                const titleElement = article.find("h3 a");
                const title = titleElement.text();
                const link = URL + titleElement.attr("href");
                const type = getType(titleElement);
                foundWeek = /semana/i.test(title);

                try {
                    const imageUrl = URL + article.find("img").attr("src");
                    // Descargar la imagen y guardarla como un Buffer
                    /*
                    const imageResponse = await axios.get(imageUrl, {
                        responseType: 'arraybuffer'
                    });
                    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                    */

                    return { title, paises, link, date, isWeek: /semana/i.test(title), type, imageUrl };
                } catch {
                    return { title, paises, link, date, isWeek: /semana/i.test(title), type, imageUrl: null };
                }
            }));

            results = results.filter((result) => result !== null);

            const today = [];
            const tomorrow = [];
            let week;
            const afterTomorrow = [];

            let dateAnt;
            let dia = 0;

            results.forEach((event) => {
                if (dateAnt && dateAnt != event.date) {
                    dia++;
                }
                dateAnt = event.date;

                if (!event.isWeek) {
                    switch (dia) {
                        case 0:
                            today.push(event);
                            break;
                        case 1:
                            tomorrow.push(event);
                            break;
                        case 2:
                            afterTomorrow.push(event);
                            break;
                    }
                } else {
                    week = event;
                }
            });

            const categorizedResults = {
                today,
                tomorrow,
                afterTomorrow,
                week
            };

            return categorizedResults;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getCategorizedResultsWithDate: async function (mes, dia) {
        return await this.getCategorizedResults(this.URL + `/calendario/${mes}/${dia}`)
    },
    getMessageDataActual: function (did) {
        var embeds = [];
        did.today.forEach(evento => {
            embeds.push(
                new EmbedBuilder()
                    .setTitle(evento.title)
                    .setColor(evento.type.color)
                    .setURL(evento.link)
                    .setImage(evento.imageUrl)
                    .setDescription(evento.paises)
                    .setAuthor({ name: evento.date })
            )
        })
        if (did.tomorrow.length > 0) {
            var embedTomorrow = new EmbedBuilder()
                .setColor("#282828")
            var texto = "";
            did.tomorrow.forEach(evento => {
                texto += "- " + evento.title + "\n";
            })
            embedTomorrow.addFields(
                { name: did.tomorrow[0].date, value: texto, inline: true }
            )
            embeds.push(embedTomorrow);
        }

        embeds[embeds.length - 1].setTimestamp()
        return { content: `**${did.week.title}** - ${did.week.date}`, embeds: embeds };
    },
    getMessageDataCustom: function (did, mes, dia) {
        var embeds = [];
        var embedTomorrow = new EmbedBuilder()
            .setColor("#42DCE7")
        if (did.today.length > 0) {
            var texto = "";
            did.today.forEach(evento => {
                texto += "- " + evento.title + "\n";
            })
            embedTomorrow.addFields(
                { name: did.today[0].date, value: texto, inline: true }
            )
            
        } else {
            embedTomorrow.addFields(
                { name: `Día ${dia} de ${mes}`, value: "No hay festividades este día", inline: true }
            )
            embedTomorrow.setColor("#F75151")
        }
        embeds.push(embedTomorrow);
        embeds[embeds.length - 1].setTimestamp()
        return { embeds: embeds };
    },
    twit: async function (did) {
        try {
            const client = new TwitterApi(PRIVATE_CONFIG.TWITTER.DATOS);

            did.today.forEach(async evento => {
                try {
                    var texto = evento.title.toUpperCase();
                    if (evento.paises) {
                        texto += `\n - ${evento.paises}`
                    }
                    texto += `\n\n ${evento.date}`

                    if (did.imageUrl) {
                        let mediaIds = await Promise.all([
                            // file path
                            //client.v1.uploadMedia('./my-image.jpg'),
                            // from a buffer
                            client.v1.uploadMedia(Buffer.from(await loadImageFromUrl(did.imageUrl)), { mimeType: 'png' }),
                        ]);
                        client.v2.tweet({ text: texto, media: { media_ids: mediaIds } });
                    } else {
                        client.v2.tweet({ text: texto });
                    }
                } catch {
                    console.log('Error al twittear un evento');
                }
            })
        } catch {
            console.log('Error al iniciar sesión del bot de twitter');
        }
    }
}

const TIPO = Object.freeze({
    oficial: {
        nombre: "oficial",
        color: "#0258a1"
    },
    popular: {
        nombre: "popular",
        color: "#5f8b03"
    },
    raro: {
        nombre: "raro",
        color: "#520e63"
    },
    nacional: {
        nombre: "nacional",
        color: "#ce5d02"
    },
    religioso: {
        nombre: "religioso",
        color: "#850401"
    },
    no_oficial: {
        nombre: "no oficial",
        color: "#3b3b3b"
    }
})

function getType(titleElement) {
    if (titleElement.hasClass('diaOficial')) {
        return TIPO.oficial;
    } else if (titleElement.hasClass("diaPopular")) {
        return TIPO.popular;
    } else if (titleElement.hasClass("diaRaro")) {
        return TIPO.raro;
    } else if (titleElement.hasClass("diaNacional")) {
        return TIPO.nacional;
    } else if (titleElement.hasClass("celebRelig")) {
        return TIPO.religioso;
    } else {
        return TIPO.no_oficial;
    }
}

function loadImageFromUrl(imageUrl) {
    return axios
        .get(imageUrl, { responseType: 'arraybuffer' })
        .then((response) => Buffer.from(response.data, 'binary'))
        .catch((error) => {
            console.error('Error al cargar la imagen desde la URL:', error);
            throw error;
        });
}

module.exports = diainternacionalde;