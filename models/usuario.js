const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    idDiscord: { type: String, unique: true },
    expTotal: { type: Number, default: 0, required: true },
    parejaId: { type: String, default: '0' },
    fechaPareja: { type: String, default: '0' },
    monedas: { type: Number, default: 0 },
    pavos: { type: Number, default: 0 },
    anillo: { type: Number, default: 0 },
    color: { type: String, default: '#7289da' },
    record2048: { type: Number, default: 0 }
})

// crear modelo

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;


// quitar exp limite y añadir exp pareja