const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { User, Image, Semilla, ImageR } = require('./models/User'); // Asegúrate de que la ruta sea correcta según tu estructura de archivos
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const dotenv = require('dotenv');
const { obtenerAccessToken, crearProductoPaypal, crearPlanPaypal, crearSuscripcionPaypal } = require('./config/paypal');
const SuscripcionUsuario = require('./models/suscripcionUsuario');


const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de tamaño de archivo a 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.'), false);
        }
        cb(null, true);
    },
});

//middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/perfil', (req, res) => {
    res.render('perfil');
});

app.get('/',async(req,res) =>{  
    res.render('perfil');
});

app.post('/upload', upload.single('image'),async(req,res) =>{
    const { usuario} = req.body;
    try {
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).send('Usuario no encontrado.');
        }
        console.log('Contenido de la imagen recibida:');
        console.log('Nombre del archivo:', req.file.originalname);
        console.log('Tipo MIME:', req.file.mimetype);
        console.log('Tamaño:', req.file.size, 'bytes');

        let existingImage = await Image.findOne({ userId: user._id });

        if (existingImage) {
            // Si ya tiene una imagen, actualizar los datos de la imagen existente
            existingImage.name = req.file.originalname;
            existingImage.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
            await existingImage.save();
        } else {
            // Si no tiene una imagen, crear una nueva imagen
            const newImage = new Image({
                name: req.file.originalname,
                userId: user._id,
                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });
            await newImage.save();
        }

    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error al cliente
        console.error('Error al actualizar el perfil:', error);
        return res.status(500).send('Error al actualizar el perfil. Inténtelo de nuevo más tarde.');
    }
    });

    app.get('/getImage/:usuario', async (req, res) => {
        const { usuario } = req.params;
        try {
            const user = await User.findOne({ usuario });
            if (!user) {
                return res.status(400).send('Usuario no encontrado.');
            }
    
            const image = await Image.findOne({ userId: user._id });
            if (!image) {
                return res.status(404).send('Imagen no encontrada.');
            }
    
            res.contentType(image.image.contentType);
            res.send(image.image.data);
        } catch (error) {
            console.error('Error al obtener la imagen:', error);
            return res.status(500).send('Error al obtener la imagen. Inténtelo de nuevo más tarde.');
        }
    });
//Conexión a MongoDB
const mongoURI = 'mongodb+srv://Siemprejean:12345@proyectofinal.etzkqco.mongodb.net/?retryWrites=true&w=majority&appName=Proyectofinal';

mongoose.connect(mongoURI)
.then(()=>console.log('Conectado a la Base de datos'))
.catch(err =>console.error('Error al conectar la base de datos'.err));

//rutas y controladores

//Registro
app.post('/api/register', async (req, res) => {
    const { nombre, usuario, correo, contra, confirmaContra, telefono, fechaNacimiento, genero, estado, distrito, direccionReferencia} = req.body;
    if (contra !== confirmaContra) {
        return res.status(400).send('Las contraseñas no coinciden');
    }
    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contra, 10);

        // Crear y guardar el nuevo usuario en la base de datos
        const newUser = new User({ 
            nombre, 
            usuario, 
            correo, 
            contra: hashedPassword,
            telefono,
            fechaNacimiento,
            genero,
            estado,
            distrito,
            direccionReferencia,
        });
        
        await newUser.save();
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(400).send(`Error al registrar el usuario: ${error.message}`);
    }
});

//Login
app.post('/api/login', async (req, res) => {
    const { usuario, contra } = req.body;

    try {
        // Buscar el usuario por el nombre de usuario
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).send('No se puede encontrar este usuario.');
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contra, user.contra);
        if (!isMatch) {
            return res.status(400).json({ error: 'Nombre de usuario o contraseña incorrectos.' });
        }

        res.json({
            userID: user._id,
            usuario: user.usuario,
            nombre: user.nombre,
            correo: user.correo,
            telefono: user.telefono,
            fechaNacimiento: user.fechaNacimiento,
            genero: user.genero,
            estado: user.estado,
            distrito: user.distrito,
            direccionReferencia: user.direccionReferencia,
            fotoPerfil: user.fotoPerfil
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
    }
});

//actualizar perfil
app.post('/api/updateProfile', async (req, res) => {
    const { nombre, usuario, telefono, fechaNacimiento, genero, estado, distrito, direccionReferencia } = req.body;
    try {
        const user = await User.findOne({ usuario });
        if (!user) {
            return res.status(400).send('Usuario no encontrado.');
        }

        // Actualizar los campos del usuario con los datos del formulario
        user.nombre = nombre || user.nombre;
        user.telefono = telefono || user.telefono;
        user.fechaNacimiento = fechaNacimiento || user.fechaNacimiento;
        user.genero = genero || user.genero;
        user.estado = estado || user.estado;
        user.distrito = distrito || user.distrito;
        user.direccionReferencia = direccionReferencia || user.direccionReferencia;

        await user.save();  // Guardar los cambios en el documento del usuario

        // Enviar respuesta JSON indicando que el perfil se actualizó correctamente
        return res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        // Capturar cualquier error y enviar una respuesta de error al cliente
        console.error('Error al actualizar el perfil:', error);
        return res.status(500).send('Error al actualizar el perfil. Inténtelo de nuevo más tarde.');
    }
});



//Guardar Registro de nuevo lote
app.post('/api/registerLote', async (req, res) => {
    const { usuario, numeroLote, fechaRegistro, nombreSemilla, variedad, cantidad, origen, fechaCosecha, mensaje } = req.body;
    
    try {
        // Find the existing semilla by numeroLote and usuario
        let existingSemilla = await Semilla.findOne({ usuario, numeroLote });

        if (existingSemilla) {
            // Update the existing semilla with new data
            existingSemilla.fechaRegistro = fechaRegistro;
            existingSemilla.nombreSemilla = nombreSemilla;
            existingSemilla.variedad = variedad;
            existingSemilla.cantidad = cantidad;
            existingSemilla.origen = origen;
            existingSemilla.fechaCosecha = fechaCosecha;
            existingSemilla.mensaje = mensaje;
            await existingSemilla.save();

            res.json({ message: 'Datos del lote de semillas actualizados correctamente' });
        } else {
            // Create and save a new semilla entry
            const newSemilla = new Semilla({
                usuario,
                numeroLote,
                fechaRegistro,
                nombreSemilla,
                variedad,
                cantidad,
                origen,
                fechaCosecha,
                mensaje,
            });
            
            await newSemilla.save();
            res.json({ message: 'Lote de semillas registrado exitosamente' });
        }

    } catch (error) {
        res.status(400).send(`Error al registrar el lote de semillas: ${error.message}`);
    }
});


// Obtener registros de semillas para un usuario específico
app.get('/api/semillas/:userId', async (req, res) => {
    const userId = req.params.userId;
    //console.log(userId)
    try {
        const semillas = await Semilla.find({ usuario: userId });
        res.json(semillas);
    } catch (error) {
        res.status(500).send('Error al obtener los registros de semillas');
    }
});

// Cambiar el estado de lote publicado para saber cuales registros de lotes han sido publicados.
app.post('/api/semillas/:idLote/publicar', async (req, res) => {
    const { idLote } = req.params;
    const { userId } = req.body;

    try {
        const suscripcion = await SuscripcionUsuario.findOne({
            usuarioId: userId,
        });
        
        console.log(suscripcion);
        if (!suscripcion || suscripcion.publicacionesUsadas >= 25) {
            return res.status(403).json({
                message: 'No tienes una suscripción válida o has alcanzado el límite de publicaciones.',
                redirectTo:'../html/opcionesPaypal.html',
            });
        }

        const semilla = await Semilla.findById(idLote);
        if (!semilla) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        semilla.publicado = true;
        await semilla.save();

        suscripcion.publicacionesUsadas += 1;
        if (suscripcion.publicacionesUsadas >= 25) {
            suscripcion.estado = 'expirada';

            const usuario = await User.findById(userId);
            if (usuario) {
                usuario.suscripcionActiva = false;
                await usuario.save();
            }
        }
        await suscripcion.save();

        res.json({ message: 'Anuncio publicado exitosamente' });
    } catch (error) {
        console.error('Error al publicar el anuncio:', error);
        res.status(500).json({ message: 'Error al publicar el anuncio' });
    }
});

// Obtener todos los lotes publicados
app.get('/api/publicados', async (req, res) => {
    try {
        const lotesPublicados = await Semilla.find({ publicado: true });
        res.json(lotesPublicados);
    } catch (error) {
        res.status(500).send('Error al obtener los lotes publicados');
    }
});

app.get('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Imagen no encontrada');
        }

        res.set('Content-Type', image.image.contentType);
        res.send(image.image.data);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).send('Error al obtener la imagen');
    }
});

app.get('/api/random-number',async (req, res) => {
    try{
        const randomNumber = generateRandomNumber(100000, 900000);
        const existinglote = await Semilla.findOne({ numeroLote: randomNumber });
        if(existinglote){
            const randomNumber = generateRandomNumber(100000, 900000);   
        }
        else
        res.json({ randomNumber });
    
    }catch(error){
        console.error('Error al obtener numero de lote', error);
        res.status(500).send('Error al obtener numero de lote');
    }
});

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.delete('/api/semillas/:idLote/eliminar', async (req, res) => {
    const idLote = req.params.idLote;
    try {
        const resultado = await Semilla.findByIdAndDelete(idLote);
        if (!resultado) {
            return res.status(404).send('Lote no encontrado');
        }
        res.json({ message: 'Lote eliminado exitosamente' });
    } catch (error) {
        res.status(500).send('Error al eliminar el lote');
    }
});

app.post('/api/payment/success', async (req, res) => {
    const { orderID, payerID, paymentStatus, amount, subscriptionType, userId, planId } = req.body;

    try {
        let duracionDias;
        if (subscriptionType === 'mensual') {
            duracionDias = 30;
        } else if (subscriptionType === 'unico') {
            duracionDias = 1;
        }

        // Crear o actualizar el registro de suscripción
        const nuevaSuscripcion = new SuscripcionUsuario({
            usuarioId: userId,
            planId: planId,
            fechaInicio: new Date(),
            fechaFin: calcularFechaFin(duracionDias),
            publicacionesUsadas: 0,
            estado: 'activa',
            orderID: orderID,
            payerID: payerID,
            paymentStatus: paymentStatus,
        });
        await nuevaSuscripcion.save();

        // Actualizar el estado de la suscripción en el modelo User
        await User.findByIdAndUpdate(userId, { suscripcionActiva: true });

        res.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar la suscripción:', error);
        res.json({ success: false, message: 'Error al actualizar la suscripción.' });
    }
});

// Ruta para registrar errores de pago
app.post('/api/payment/error', async (req, res) => {
    const { message, stack, userId } = req.body;

    try {
        const newError = new TransactionError({
            message,
            stack,
            userId
        });

        await newError.save();

        res.json({ success: true, message: 'Error registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el error de pago:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el error' });
    }
});

//servidor
app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
});