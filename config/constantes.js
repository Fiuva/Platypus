﻿require('dotenv').config();

const GUILD = {
    SERVER_PLATY: '836721843955040337'
}
const CATEGORIA = {
    GAMING_VOZ: '836957406599577631'
}
const CANAL_TEXTO = {
    BIENVENIDA: '836730119023493140',
    MUSICA: "838801241341558825",
    COMANDOS: "836879630815985674",
    GENERAL: "836721843955040339",
    ANUNCIOS: "836954038816735262",
    PRIVATE_MDS: '840558534495174676',
    PRIVATE_ENVIAR: '937143535843549245',
    PRIVATE_PRUEBAS: '836734022184861706',
    CARCEL: '837065502495866880'
}
const CANAL_VOZ = {
    MUSICA: "838776417768046622",
    GAMING_DUO: '836991033208078428',
    GAMING_TRIO: '836991104754253836',
    GAMING_CUARTETO: '836991178717134877',
    GAMING_QUINTETO: '836991212124241941'
}
const PRECIO = {
    ANILLO: 30,
    MUSICA_PRO: 50,
    DIVORCIO: 100,
    MILLONARIO: 2000
}
const ROL = {
    MILLONARIO: '836992600979669057',
    MOD: '836950934806069299',
    ADMIN: '836880922250575923',
    MALTRATADOR: '837016264421408850',
    BRAWL_STARS: '836877776422305822',
    SUB: '837346304517865532',
    MUSICA_PRO: '980900227655553034',
    TWITCH: {
        TIER1: "1015958493334884454",
        TIER2: "1015958493334884455",
        TIER3: "1015958493334884456"
    }
}
const CONFIG = {
    CANAL_CONFIG: '849733450671718432',
    MENSAJE_ESTADO: '849734239305334834',
    MENSAJE_AVATAR: '902653657089183744',
    MENSAJE_ESPIA: '981684496736870461'
}
const PRIVATE_CONFIG = {
    ENVIRONMENT: process.env.environment,
    TOKEN: process.env.token,
    MONGODB: process.env.mongodb,
    SPOTIFY: {
        clientId: process.env.spclientid,
        clientSecret: process.env.spclientsecret
    },
    TWITCH: {
        CLIENT_ID: process.env.twclientid,
        CLIENT_SECRET: process.env.twclientsecret
    },
    TWITTER: {
        DATOS: {
            appKey: process.env.twiappkey,
            appSecret: process.env.twiappsecret,
            accessToken: process.env.twiaccesstoken,
            accessSecret: process.env.twiaccesssecret
        }
    },
    COOKIE_LEONARDO: process.env.cookieLeonardo
}

const EVENTOS = {
    NAVIDAD: false,
    DIA_BESO: false,
    TEMPORADA: 2
}

const MENSAJE = {
    INFO_ROLES: '837347810705539173'
}

const MONEDAS = {
    PC: {
        NOMBRE: "PlatyCoins",
        EMOTE: "<:platyCoins:1047891251078369290>"
    },
    NAVIDAD: {
        NOMBRE: "Pavos",
        EMOTE: "🦃"
    }
}
const AUMENTAR_MONEDAS_NIVEL = 25;
const AUMENTA_NIVEL = 7;

var varOnUpdateMessageEspia = {
    update: 'Off',
    setUpdate(string) {
        this.update = string;
    }
}


module.exports = {
    GUILD,
    CATEGORIA,
    CANAL_TEXTO,
    CANAL_VOZ,
    PRECIO,
    ROL,
    CONFIG,
    PRIVATE_CONFIG,
    MENSAJE,
    MONEDAS,
    AUMENTAR_MONEDAS_NIVEL,
    AUMENTA_NIVEL,
    EVENTOS,
    varOnUpdateMessageEspia
}