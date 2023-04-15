const fs = require('fs');

module.exports = (client) => {
    try {
        let comandos = 0;
        fs.readdirSync("./comandos/").forEach((carpeta) => {
            if (carpeta.endsWith('_inactive')) return;
            const commands = fs.readdirSync(`./comandos/${carpeta}`).filter((archivo) => archivo.endsWith(".js"));
            for (let archivo of commands) {
                let comando = require(`../comandos/${carpeta}/${archivo}`);
                if (comando.name) {
                    client.commands.set(comando.name, comando);
                    comandos++;
                } else {
                    console.log(`COMANDO [/${carpeta}/${archivo}]`, `error => el comando no está configurado`)
                    continue;
                }
                if (comando.aliases && Array.isArray(comando.aliases)) comando.aliases.forEach((alias) => client.aliases.set(alias, comando.name));
            }
        })
        console.log(`${comandos} comandos cargados`);
    } catch (e) {
        console.log(e);
    }
}