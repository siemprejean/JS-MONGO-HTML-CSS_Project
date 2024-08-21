(() => {
    const App = {
        htmlElements: {
            form: document.getElementById('formularioLogin'),
            loginButton: document.getElementById('botonLogin'),
            registerButton: document.getElementById('botonRegistro'),
            mensaje: document.getElementById('error')
        },
        init() {
            App.methods.checkLogin();
            App.bindEvents();
        },
        bindEvents() {
            App.htmlElements.form.addEventListener('submit', App.handlers.handleLogin);
            App.htmlElements.registerButton.addEventListener('click', App.handlers.handleRegister);
        },
        handlers: {
            async handleLogin(e) {
                e.preventDefault();

                const form = App.htmlElements.form;
                const usuario = form.usuario.value;
                const contra = form.contra.value;

                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ usuario, contra })
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        localStorage.setItem('sessionActive', 'true');
                        localStorage.setItem('usuarioActivo', JSON.stringify(userData));
                        App.htmlElements.mensaje.innerHTML = "Inicio de sesion exitoso.";

                        setTimeout(() => {
                            window.location.href = 'html/home.html';
                        }, 1500);
                    } else {
                        App.htmlElements.mensaje.innerHTML = "Usuario o contraseña incorrecta.";
                    }
                } catch (error) {
                    App.htmlElements.mensaje.innerHTML = "Error al iniciar sesion, intentelo de nuevo mas tarde.";
                }
            },
            handleRegister(event) {
                window.location.href = 'html/registro.html';
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
