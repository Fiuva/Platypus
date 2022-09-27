function Victima(nombre, id, color, musica, onlyAvatar) {
    this.nombre = nombre;
    this.id = id;
    this.color = color;
    this.musica = musica;
    this.onlyAvatar = onlyAvatar;
}

function parseMensajeEspia(mensajeEspia) {
    var arrayVictimas = [];
    mensajeEspia.split('\n').forEach(
        line => {
            const atributos = line.split(':');
            arrayVictimas.push(new Victima(atributos[0], atributos[1], atributos[2], atributos[3] == 'true', atributos[4] == 'true'));
        });
    return arrayVictimas;
}

var bbddVictimas = {
    arrayVictimas: [],
    setArray(arr) {
        this.arrayVictimas = arr;
    }
}

module.exports = {
    bbddVictimas,
    parseMensajeEspia
}