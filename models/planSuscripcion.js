const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSuscripcionSchema = new Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number,required: true},
    duracionDias: {type: Number,required: true},
    maximoPublicaciones: {type: Number,required: true}
}, {
    timestamps: true
});

const PlanSuscripcion = mongoose.model('PlanSuscripcion', planSuscripcionSchema);

module.exports = PlanSuscripcion;