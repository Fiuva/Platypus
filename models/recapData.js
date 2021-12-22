const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recapSchema = new Schema({
    idDiscord: { type: String, unique: true },
    fechaOnline: { type: String, default: '0' },
    tiempoTotalOnline: { type: Number, default: 0 }
})

// crear modelo

const RecapData = mongoose.model('RecapData', recapSchema);

module.exports = RecapData;


// quitar exp limite y añadir exp pareja