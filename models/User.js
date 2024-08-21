const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    contra: { type: String, required: true },
    telefono: { type: String, required: false},
    fechaNacimiento: { type: String, required: false},
    genero: { type: String, required: false},
    estado: { type: String, required: false},
    distrito: { type: String, required: false},
    direccionReferencia: { type: String, required: false}
});
const ImageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Tipo ObjectId para referencia a usuarios
        ref: 'User',  // Nombre del modelo referenciado (asegúrate de que coincida con tu modelo de usuario)
        required: true
    },
});

const ImageRSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    lote: {
        type: mongoose.Schema.Types.ObjectId,  // Tipo ObjectId para referencia a usuarios
        ref: 'Semilla',  // Nombre del modelo referenciado (asegúrate de que coincida con tu modelo de usuario)
        required: true
    },
});

const semillaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    numeroLote: { type: String, required: true },
    fechaRegistro: { type: Date, required: true },
    nombreSemilla: { type: String, required: true },
    variedad: { type: String, required: true },
    cantidad: { type: Number, required: true },
    origen: { type: String, required: false },
    fechaCosecha: { type: Date, required: false },
    mensaje: { type: String, required: false},
    publicado: { type: Boolean, default: false },
}, { timestamps: true });

const Semilla = mongoose.model('Semilla', semillaSchema);
const User = mongoose.model('User', userSchema);
const Image = mongoose.model('Image', ImageSchema);
const ImageR = mongoose.model('Imager', ImageRSchema);
// Exportar los modelos correctamente
module.exports = { User, Image, Semilla,ImageR };