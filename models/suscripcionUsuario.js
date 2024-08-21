const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suscripcionUsuarioSchema = new Schema({
    usuarioId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    planId: {type: Schema.Types.ObjectId, ref: 'PlanSuscripcion', required: true},
    fechaInicio: {type: Date, required: true},
    fechaFin: {type: Date, required: true},
    publicacionesUsadas: {type: Number, default: 0},
    estado: {type: String, enum: ['activa', 'expirada'], default: 'activa'},
    orderID: {type: String, required: true},
    payerID: {type: String, required: true},
    paymentStatus: {type: String, required: true}
    
}, {
    timestamps: true
});

const SuscripcionUsuario = mongoose.model('SuscripcionUsuario', suscripcionUsuarioSchema);

module.exports = SuscripcionUsuario;
