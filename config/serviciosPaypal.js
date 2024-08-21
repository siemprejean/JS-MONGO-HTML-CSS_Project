const { obtenerAccessToken, crearProductoPaypal } = require('./paypal');

const crearProducto = async (nombre, descripcion, precio) => {
    try {
        const accessToken = await obtenerAccessToken();
        const resultado = await crearProductoPaypal(nombre, descripcion, precio, accessToken);
        return resultado;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    crearProducto
};
