(() => {
    const App = {
        htmlElements: {
            nombreUsuario: document.getElementById('nombreUsuario'),
            botonPerfil: document.getElementById('botonPerfil'),
            botonLogout: document.getElementById('botonLogout'),
            imagenUsuario: document.getElementById('imagenUsuario'),
            listaPublicaciones: document.getElementById('listaPublicaciones'),
        },
        init() {
            App.bindEvents();
            App.methods.checkLogin();
            App.methods.mostrarInfoUsuario();
            App.methods.mostrarImagenUsuario();
            App.methods.obtenerYMostrarPublicaciones();
        },
        bindEvents() {
            App.htmlElements.botonPerfil.addEventListener('click', App.handlers.handlePerfil);
            App.htmlElements.botonLogout.addEventListener('click', App.handlers.handleLogout);
            App.htmlElements.listaPublicaciones.addEventListener('click', (event) => {
                if (event.target.classList.contains('ver')) {
                    App.handlers.verAnuncio(event);
                }
            });
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
          
            verAnuncio(event) {
                const tarjeta = event.target.closest('.card'); // Ensure tarjeta is defined
                console.log(tarjeta)
                if (!tarjeta) {
                    console.error('No tarjeta found for the clicked element.');
                    return;
                }
            
                const semillaData = {
                    nombreSemilla: tarjeta.querySelector('h2').innerText.split(': ')[1],
                    variedad: tarjeta.querySelector('p:nth-child(3)').innerText.split(': ')[1],
                    cantidad: tarjeta.querySelector('p:nth-child(4)').innerText.split(': ')[1],
                    origen: tarjeta.querySelector('p:nth-child(5)').innerText.split(': ')[1],
                    fechaCosecha: tarjeta.querySelector('p:nth-child(6)').innerText.split(': ')[1],
                    mensaje: tarjeta.querySelector('p:nth-child(7)').innerText.split(': ')[1],
                };

                console.log(semillaData)
            
                localStorage.setItem('selectedSemilla', JSON.stringify(semillaData));
                window.location.href = '../html/publicacion.html';
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

            async obtenerYMostrarPublicaciones() {
                try {
                    const response = await fetch('/api/publicados');
                    if (!response.ok) {
                        throw new Error('Error al obtener las publicaciones');
                    }
                    const semillas = await response.json();
                    App.methods.renderizarPublicaciones(semillas);
                } catch (error) {
                    console.error('Error al obtener las publicaciones:', error);
                }
            },

            renderizarPublicaciones(semillas) {
                App.htmlElements.listaPublicaciones.innerHTML = '';
                semillas.forEach(semilla => {
                    console.log('Rendering semilla:', semilla); // Log each semilla
                    const publicacionHTML = `
                   <div class="col-md-6 mb-4">
                    <article class="card h-100">
                    <img src="https://images.unsplash.com/photo-1720877851762-1fd589e96311?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Imagen de Semilla" class="card-img-top">
                    <div class="card-body">
                        <h4 class="card-title">Detalles del Producto</h4>
                        <h2 class="card-text">Producto: ${semilla.nombreSemilla}</h2>
                        <p class="card-text">Variedad: ${semilla.variedad}</p>
                        <p class="card-text">Cantidad: ${semilla.cantidad}</p>
                        <p class="card-text">Origen: ${semilla.origen || '-'}</p>
                        <p class="card-text">Fecha de Cosecha: ${semilla.fechaCosecha ? new Date(semilla.fechaCosecha).toLocaleDateString() : '-'}</p>
                        <p class="card-text hidden">Descripcion: ${semilla.mensaje}</p>
                        <button id="ver" class="btn btn-primary ver">Ver Detalles</button>
                    </div>
                </article>
            </div>
        `;
                    App.htmlElements.listaPublicaciones.insertAdjacentHTML('beforeend', publicacionHTML);
                });
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
        },
    };
    App.init();
})();