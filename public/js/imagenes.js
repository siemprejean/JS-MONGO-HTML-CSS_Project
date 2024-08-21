(() => {
    const App = {
        htmlElements: {
            form: document.getElementById('registroventas'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            botonLogout: document.getElementById('botonLogout'),
            botonfotoPerfil: document.getElementById('cambiarfotoperfil'),
            inventario: document.getElementById('botonInventario'),
            botonHome: document.getElementById('botonHome'),
            botonFoto: document.getElementById('botonfoto'),
            imagenPerfil: document.getElementById('imagenperfil'),
            imagenUsuario: document.getElementById('imagenUsuario'),
            botonback: document.getElementById('botonvuelt'),
        },

        init() {
            App.methods.checkLogin();
            App.methods.mostrarInfoUsuario();
            App.methods.mostrarImagenUsuario();
            App.bindEvents();
        },

        bindEvents() {
            App.htmlElements.form.addEventListener('submit', App.handlers.handleForm);
            App.htmlElements.botonLogout.addEventListener('click', App.handlers.handleLogout);
            App.htmlElements.inventario.addEventListener('click', App.handlers.inventario);
            App.htmlElements.botonHome.addEventListener('click', App.handlers.handleHome);
            App.htmlElements.botonback.addEventListener('click', App.handlers.handleBack);
        },

        handlers: {
            async handleForm(event) {
                event.preventDefault();
                const formData = new FormData(App.htmlElements.form);
                const nombreUsuario = JSON.parse(localStorage.getItem('usuarioActivo')).usuario;
                formData.append('usuario', nombreUsuario);
                console.log(nombreUsuario);
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }
                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Error al actualizar el perfil');
                    }

                    const result = await response.json();
                    console.log('Perfil actualizado:', result);
                } catch (error) {
                    console.error('Error al actualizar el perfil:', error);
                }
                
            },

            handleLogout() {
                localStorage.removeItem('sessionActive');
                window.location.href = '../index.html';
            },

            inventario(){
                window.location.href = '../html/inventario.html';
            },

            handleHome(){
                window.location.href = '../html/home.html';
            },

            handleBack(){
                window.location.href = '../html/inventario.html'
            }
        },
        methods: {
            checkLogin() {
                const sessionActive = localStorage.getItem('sessionActive');
                if (sessionActive !== 'true') {
                    window.location.href = '../index.html';
                }
            },

            mostrarInfoUsuario() {
                const nombreUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                if (nombreUsuario) {
                    if (welcomeMessage) {
                        App.htmlElements.welcomeMessage.textContent = `Bienvenido, ${nombreUsuario.usuario}`;
                    }
                }
            },

            async mostrarImagenUsuario() {
                const NombreUsuario = JSON.parse(localStorage.getItem('usuarioActivo')).usuario;
                try {
                    const response = await fetch(`/getImage/${NombreUsuario}`);
                    if (response.ok) {
                        const imageUrl = URL.createObjectURL(await response.blob());
                        App.htmlElements.imagenUsuario.src = imageUrl;

                        // Guardar la URL de la imagen en localStorage
                        localStorage.setItem('imagenUsuario', imageUrl);
                    } else {
                        throw new Error('Imagen no encontrada');
                    }
                } catch (error) {
                    console.error('Error al obtener la imagen:', error);
                    // Mostrar una imagen por defecto si no hay imagen de usuario
                    const defaultImageUrl = 'https://robohash.org/.png';
                    App.htmlElements.imagenUsuario.src = defaultImageUrl;
                    App.htmlElements.imagenUsuario.alt = 'Imagen de Usuario';
                }
            }
        }
    };

    App.init();
})();