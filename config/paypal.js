const fetch = require('node-fetch');
const TransactionError = require('../models/errorPaypal');

require('dotenv').config();

const obtenerAccessToken = async () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el token de acceso: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.error('Error al obtener el token de acceso de PayPal:', error);
        
        const transactionError = new TransactionError({
            message: error.message,
            stack: error.stack,
            date: new Date()
        });
        await transactionError.save();
        
        throw new Error(`Error al obtener el token de acceso de PayPal: ${error.message}`);
    }
};

const crearProductoPaypal = async (nombreProducto, descripcionProducto, precioProducto, accessToken) => {
    const apiUrl = 'https://api-m.sandbox.paypal.com/v1/catalogs/products';

    const data = {
        name: nombreProducto,
        description: descripcionProducto,
        type: 'SERVICE',
        category: 'SOFTWARE'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al crear el producto en PayPal: ${response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error al crear el producto en PayPal:', error);

        const transactionError = new TransactionError({
            message: error.message,
            stack: error.stack,
            date: new Date()
        });
        await transactionError.save();

        throw new Error(`Error al crear el producto en PayPal: ${error.message}`);
    }
};

const crearPlanPaypal = async (productoId, precio, duracionDias, accessToken) => {
    const apiUrl = 'https://api-m.sandbox.paypal.com/v1/billing/plans';

    const data = {
        product_id: productoId,
        name: `Plan de suscripción de ${duracionDias} días`,
        description: `Suscripción de ${duracionDias} días`,
        billing_cycles: [{
            frequency: {
                interval_unit: 'DAY',
                interval_count: duracionDias
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 1,
            pricing_scheme: {
                fixed_price: {
                    value: precio.toFixed(2),
                    currency_code: 'USD'
                }
            }
        }],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: precio.toFixed(2),
                currency_code: 'USD'
            },
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al crear el plan en PayPal: ${response.statusText}`);
        }

        const result = await response.json();
        return result.id;

    } catch (error) {
        console.error('Error al crear el plan en PayPal:', error);

        const transactionError = new TransactionError({
            message: error.message,
            stack: error.stack,
            date: new Date()
        });
        await transactionError.save();

        throw new Error(`Error al crear el plan en PayPal: ${error.message}`);
    }
};

const crearSuscripcionPaypal = async (planId, returnUrl, cancelUrl, accessToken) => {
    const apiUrl = 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions';

    const data = {
        plan_id: planId,
        application_context: {
            brand_name: 'TuMarca',
            locale: 'es-ES',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al crear la suscripción en PayPal: ${response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error al crear la suscripción en PayPal:', error);

        const transactionError = new TransactionError({
            message: error.message,
            stack: error.stack,
            date: new Date()
        });
        await transactionError.save();

        throw new Error(`Error al crear la suscripción en PayPal: ${error.message}`);
    }
};

module.exports = { obtenerAccessToken, crearProductoPaypal, crearPlanPaypal, crearSuscripcionPaypal };


