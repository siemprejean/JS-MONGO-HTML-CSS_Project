/**Codigo para crear unicamente nuevos planes en la base de datos
   este codigo se ejecuta 1 sola vez para crear el nuevo plan
   ejecutar bun run crearPlan.js cuando haya modificado el array con el o los 
   nuevos planes eliminando el codigo de los que ya estan creados para evitar cualquier conflicto
   en la creacion de los planes.**/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PlanSuscripcion = require('./models/planSuscripcion');

dotenv.config();

// Conexión a MongoDB
const mongoURI = 'mongodb+srv://Siemprejean:12345@proyectofinal.etzkqco.mongodb.net/?retryWrites=true&w=majority&appName=Proyectofinal';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Función para crear planes de suscripción
async function crearPlanes() {
  try {
    const planes = [
        //modificar estos bloques de datos segun los nuevos planes y eliminar los que ya existan.
      {
        nombre: 'Plan Mensual',
        descripcion: 'Suscripción mensual con 25 publicaciones',
        precio: 30,
        duracionDias: 30,
        maximoPublicaciones: 25
      },
      {
        nombre: 'Publicación Única',
        descripcion: 'Una única publicación de semilla',
        precio: 3,
        duracionDias: 1,
        maximoPublicaciones: 1
      }
    ];

    // Insertamos los planes en la base de datos
    await PlanSuscripcion.insertMany(planes);
    console.log('Planes de suscripción creados exitosamente');
  } catch (error) {
    console.error('Error al crear los planes de suscripción:', error);
  } finally {
    mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

crearPlanes();

