(() => {
    const App = {
        htmlElements: {
            form: document.getElementById('formularioPerfil'),
            botonActualizar: document.getElementById('botonActualizar'),
            botonLogout: document.getElementById('botonLogout'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            botonfotoPerfil: document.getElementById('cambiarfotoperfil'),
            inventario: document.getElementById('botonInventario'),
            botonHome: document.getElementById('botonHome'),
            imagenUsuario: document.getElementById('imagenUsuario'),
        },
        init() {
            App.methods.checkLogin();
            App.methods.mostrarInfoUsuario();
            App.methods.loadUserData();
            App.methods.mostrarImagenUsuario();
            App.bindEvents();
        },
        bindEvents() {
            App.htmlElements.form.addEventListener('submit', App.handlers.handleForm);
            App.htmlElements.botonLogout.addEventListener('click', App.handlers.handleLogout);
            App.htmlElements.botonfotoPerfil.addEventListener('click', App.handlers.handlefoto);
            App.htmlElements.inventario.addEventListener('click', App.handlers.inventario);
            App.htmlElements.botonHome.addEventListener('click', App.handlers.handleHome);
        },
        handlers: {
            async handleForm(event) {
                event.preventDefault();
                const formData = new FormData(App.htmlElements.form);
        
                const data = {
                    nombre: formData.get('nombreCompleto'),
                    usuario: formData.get('nombreUsuario'),
                    correo: formData.get('correo'),
                    telefono: formData.get('telefono'),
                    fechaNacimiento: formData.get('fechaNacimiento'),
                    genero: formData.get('genero'),
                    estado: formData.get('estado'),
                    distrito: formData.get('distrito'),
                    direccionReferencia: formData.get('direccionReferencia'),
                };
                try {
                    const response = await fetch('/api/updateProfile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data), // Convertir datos a JSON y enviar en el cuerpo
                    });
        
                    if (!response.ok) {
                        throw new Error('Error al actualizar el perfil');
                    }
                    localStorage.setItem('usuarioActivo', JSON.stringify(data));
                    App.methods.loadUserData();
                    const result = await response.json();
                    alert(result.message);
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
            handlefoto(){
                window.location.href = '/perfil'
            }
        },
        methods: {
            checkLogin() {
                const sessionActive = localStorage.getItem('sessionActive');
                if (sessionActive !== 'true') {
                    window.location.href = '../index.html';
                }
            },
            loadUserData() {
                const userData = JSON.parse(localStorage.getItem('usuarioActivo'));
                if (userData) {
                    App.htmlElements.welcomeMessage.textContent = `Bienvenido, ${userData.usuario}`;
                    App.htmlElements.form.nombreCompleto.value = userData.nombre;
                    App.htmlElements.form.nombreUsuario.value = userData.usuario;
                    App.htmlElements.form.correo.value = userData.correo;
                    if (userData.telefono === undefined) {
                        App.htmlElements.form.telefono.value = "";
                    } else {
                        App.htmlElements.form.telefono.value = userData.telefono;
                    }
                    
                    App.htmlElements.form.fechaNacimiento.value = userData.fechaNacimiento;
                    App.htmlElements.form.genero.value = userData.genero;
                    App.htmlElements.form.estado.value = userData.estado;
                    App.htmlElements.form.distrito.value = userData.distrito;
                    if (userData.direccionReferencia === undefined) {
                        App.htmlElements.form.direccionReferencia.value = "";
                    } else {
                        App.htmlElements.form.direccionReferencia.value = userData.direccionReferencia;
                    }
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

