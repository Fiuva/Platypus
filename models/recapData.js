const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recapSchema = new Schema({
    idDiscord: { type: String, unique: true },
    fechaOnline: { type: String, default: null },
    tiempoTotalOnline: { type: Number, default: 0 },
    fechaIdle: { type: String, default: null },
    tiempoTotalIdle: { type: Number, default: 0 },
    fechaDnd: { type: String, default: null },
    tiempoTotalDnd: { type: Number, default: 0 },
    mensajes: { type: Object, default: { total: 0, tiempos: [] } },
    mensajesMasFrecuencia: { type: Array, default: [] }
})

// crear modelo

const RecapData = mongoose.model('RecapData', recapSchema);

module.exports = RecapData;


// quitar exp limite y añadir exp pareja