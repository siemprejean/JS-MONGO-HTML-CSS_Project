(() => {
    const App = {
        init() {
            App.methods.initializePayPalButtons();
        },

        handlers: {
            async handlePaymentSuccess(details, subscriptionType, monto) {

                const datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                const userId = datosUsuario.userID;
                const planId = subscriptionType === 'mensual' ? "668b33f3aa67e3e7c8eb0827" : "668b33f3aa67e3e7c8eb0828";

                const data = {
                    orderID: details.id,
                    payerID: details.payer.payer_id,
                    paymentStatus: details.status,
                    amount: monto,
                    subscriptionType,
                    userId,
                    planId
                };
                try {
                    // Enviar datos al servidor
                    const response = await fetch('/api/payment/success', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    const responseData = await response.json();

                    if (responseData.success) {
                        window.location.href = '../html/inventario.html';
                    } else {
                        alert('Hubo un problema al actualizar la suscripción.');
                    }
                } catch (error) {
                    console.error('Error al enviar datos al servidor:', error);
                }
            },

            handlePaymentCancel(data) {
                console.log('Datos de la cancelación: ', data);
                window.location.href = '../html/inventario.html';
            },

            handlePaymentError: async (err) => {
                console.error('Error del pago: ', err);
            
                const datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                const userId = datosUsuario.userID;
            
                const data = {
                    message: err.message || 'Error desconocido',
                    stack: err.stack || '',
                    userId,
                };
            
                try {
                    const response = await fetch('/api/payment/error', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
            
                    const responseData = await response.json();
            
                    if (responseData.success) {
                        alert('Se ha registrado el error del pago.');
                    } else {
                        alert('Hubo un problema al registrar el error.');
                    }
                } catch (error) {
                    console.error('Error al enviar datos al servidor:', error);
                }
            }
            
            
        },

        methods: {
            initializePayPalButtons() {
                // Inicializar botón de Plan mensual
                const pago = '30.00';
                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: pago,
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        subscriptionType = 'mensual';
                        return actions.order.capture().then((details) => {
                            alert('Pago exitoso: ' + details.id);
                            App.handlers.handlePaymentSuccess(details, subscriptionType, pago);
                        });
                    },
                    onCancel: (data) => {
                        App.handlers.handlePaymentCancel(data);
                    },
                    onError: (err) => {
                        console.error('Error en el pago: ', err);
                        App.handlers.handlePaymentError(err);
                    }
                }).render('#paypal-button-mensual');

                // Inicializar botón de Publicación Única
                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '3.00'
                                }
                            }]
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            alert('Pago exitoso: ' + details.id);
                            App.handlers.handlePaymentSuccess(details, 'unico');
                        });
                    },
                    onCancel: (data) => {
                        App.handlers.handlePaymentCancel(data);
                    },
                    onError: (err) => {
                        console.error('Error en el pago: ', err);
                        App.handlers.handlePaymentError(err);
                    }
                }).render('#paypal-button-unico');
            },
        },
    };
    
    App.init();
})();


