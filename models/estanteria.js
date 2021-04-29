const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    idDiscord: { type: String, unique: true },
    reliquias: { type: Array, of: String, default: ["-"] },
    comprada: { type: Boolean, default: false }
})

// crear modelo

const estanteria = mongoose.model('estanteria', usuarioSchema);

module.exports = estanteria;