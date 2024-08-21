(() => {
    const App = {
        htmlElements: {
            form: document.getElementById('formularioRegistro'),
            botonVolver: document.getElementById('botonVolver'),
        },
        init() {
            App.methods.checkLogin();
            App.bindEvents();
        },
        bindEvents() {
            App.htmlElements.form.addEventListener('submit', App.handlers.handleForm);
            App.htmlElements.botonVolver.addEventListener('click', App.handlers.handleVolver);
        },
        handlers: {
            async handleForm(event) {
                event.preventDefault();
                const formData = new FormData(App.htmlElements.form);
                const data = {
                    nombre: formData.get('nombre'),
                    usuario: formData.get('usuario'),
                    correo: formData.get('correo'),
                    contra: formData.get('contra'),
                    confirmaContra: formData.get('confirmaContra'),
                    telefono: null,
                    fechaNacimiento: null,
                    genero: null,
                    estado: null,
                    distrito: null,
                    direccionReferencia: null,
                };
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.text();
                    alert(result);
                } catch (error) {
                    console.error('Error al registrar el usuario:', error);
                }
            },
            handleVolver(e) {
                window.location.href = '../index.html';
            },
        },
        methods: {
            checkLogin() {
                const sessionActive = localStorage.getItem('sessionActive');
                if (sessionActive === 'true') {
                    window.location.href = '../html/home.html';
                }
            }
        },
    };

    App.init();
})();