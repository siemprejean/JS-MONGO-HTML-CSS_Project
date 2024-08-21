(() => {
    const App = {
        htmlElements: {
            nombreUsuario: document.getElementById('nombreUsuario'),
            botonPerfil: document.getElementById('botonPerfil'),
            botonLogout: document.getElementById('botonLogout'),
            imagenUsuario: document.getElementById('imagenUsuario'),
            numeroLote: document.getElementById('numeroLote'),
            fechaRegistro: document.getElementById('fechaRegistro'),
            nombreSemilla: document.getElementById('nombreSemilla'),
            variedad: document.getElementById('variedad'),
            cantidad: document.getElementById('cantidad'),
            origen: document.getElementById('origen'),
            fechaCosecha: document.getElementById('fechaCosecha'),
            mensaje: document.getElementById('mensaje'),
            botonvolver: document.getElementById('botonVolver')
        },
        init() {
            App.bindEvents();
            App.methods.checkLogin();
            App.methods.mostrarInfoUsuario();
            App.methods.mostrarImagenUsuario();
            App.methods.mostrarDetallesSemilla();
        },
        bindEvents() {
            App.htmlElements.botonPerfil.addEventListener('click', App.handlers.handlePerfil);
            App.htmlElements.botonLogout.addEventListener('click', App.handlers.handleLogout);
            App.htmlElements.botonvolver.addEventListener('click', App.handlers.handlevolver);
        },
        handlers: {
            handlePerfil() {
                window.location.href = '../html/perfil.html';
            },
            handleLogout() {
                localStorage.removeItem('sessionActive');
                localStorage.removeItem('usuarioActivo');
                window.location.href = '/index.html';
            },
            handlevolver(){
                window.location.href = '../html/home.html';
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
                    const welcomeMessage = document.getElementById('welcomeMessage');
                    if (welcomeMessage) {
                        welcomeMessage.textContent = `Bienvenido, ${nombreUsuario.usuario}`;
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
            },

            mostrarDetallesSemilla() {
                const semillaData = JSON.parse(localStorage.getItem('selectedSemilla'));
                if (semillaData) {
                    App.htmlElements.nombreSemilla.innerText = semillaData.nombreSemilla;
                    App.htmlElements.variedad.innerText = semillaData.variedad;
                    App.htmlElements.cantidad.innerText = semillaData.cantidad;
                    App.htmlElements.origen.innerText = semillaData.origen;
                    App.htmlElements.fechaCosecha.innerText = semillaData.fechaCosecha;
                    App.htmlElements.mensaje.innerText = semillaData.mensaje;
                } else {
                    alert('No se encontró información del lote.');
                }
            }
        },
    };
    App.init();
})();