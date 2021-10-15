const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infoCumpleSchema = new Schema({
    fase: { type: Number, default: 0 }
})

// crear modelo

const Info = mongoose.model('Info', infoCumpleSchema);

module.exports = Info;


// quitar exp limite y añadir exp pareja