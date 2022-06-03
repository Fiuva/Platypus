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
    mensajesMasFrecuencia: { type: Array, default: [] },
    tiemposEstadoComienzoDia: { type: Object, default: { online: 0, dnd: 0, idle: 0 } },
    tiemposPorDia: { type: Array, default: [
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            },
            {
                online: 0,
                idle: 0,
                dnd: 0
            }
        ] },
    fechaMovil: { type: String, default: null },
    tiempoTotalMovil: { type: Number, default: 0 }
})

// crear modelo

const RecapData = mongoose.model('RecapData', recapSchema);

module.exports = RecapData;


// quitar exp limite y añadir exp pareja