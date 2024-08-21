(() => {
    const App = {
        htmlElements: {
            form: document.getElementById('registroLoteSemillas'),
            botonLogout: document.getElementById('botonLogout'),
            botonPerfil: document.getElementById('botonPerfil'),
            botonHome: document.getElementById('botonHome'),
            botonimagen: document.getElementById('botonima'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            fotoSemilla: document.getElementById('fotoSemilla'),
            tablaBody: document.getElementById('tablaBody'),
            imagenUsuario: document.getElementById('imagenUsuario'),
            imagen: document.getElementById('inputFotoSemilla1'),
            fechaRegistro: document.getElementById('fechaRegistro'),
            Lote: document.getElementById('Lote'),
        },

        init() {
            App.methods.checkLogin();
            App.methods.mostrarInfoUsuario();
            App.methods.loadUserData();
            App.methods.obtenerYRenderizarSemillas();
            App.methods.mostrarImagenUsuario();
            App.bindEvents();
        },

        bindEvents() {
            App.htmlElements.form.addEventListener('submit', App.handlers.handleForm);
            App.htmlElements.botonLogout.addEventListener('click', App.handlers.handleLogout);
            App.htmlElements.botonPerfil.addEventListener('click', App.handlers.handlePerfil);
            App.htmlElements.botonHome.addEventListener('click', App.handlers.handleHome);
            App.htmlElements.tablaBody.addEventListener('click', (event) => {
                if (event.target.classList.contains('publicar')) {
                    App.handlers.publicarAnuncio(event);
                } else if (event.target.classList.contains('ver')) {
                    App.handlers.mostrarLote(event);
                } else if(event.target.classList.contains('eliminar')){
                    App.handlers.eliminarAnuncio(event);
                } else if(event.target.classList.contains('editar')){
                    App.handlers.editarAnuncio(event);
                }
            });
            
        },

        handlers: {
            async handleForm(event) {
                event.preventDefault();
                const formData = new FormData(App.htmlElements.form);
                const datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                const loteValue = document.getElementById('Lote').value;

                if (loteValue) {
                    console.log('Lote value provided:', loteValue);
                } else {
                    console.log('Lote value is empty, generating random number...');
                    const response = await fetch('/api/random-number');
                    const ram = await response.json();
                    loteValue = ram.randomNumber;
                    console.log('Generated random number:', randomNumber);
                }

                    const data = {
                        usuario: datosUsuario.userID,
                        numeroLote: loteValue,
                        fechaRegistro: formData.get('fechaRegistro'),
                        nombreSemilla: formData.get('nombreSemilla'),
                        variedad: formData.get('variedad'),
                        cantidad: formData.get('cantidad'),
                        origen: formData.get('origen'),
                        fechaCosecha: formData.get('fechaCosecha'),
                        mensaje: formData.get('mensajePromocional'),
                    };
                    console.log(data);
                    try {
                        const response = await fetch('/api/registerLote', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });
                
                        if (!response.ok) {
                            throw new Error('Error al cargar los datos');
                        }
                        const result = await response.json();
                        alert(result.message);
                        App.htmlElements.form.reset();
                        App.methods.obtenerYRenderizarSemillas(); // Reset
                    } catch (error) {
                        console.error('Error al guardar los datos:', error);
                    }
            },

            async publicarAnuncio(event) {
                const idLote = event.target.closest('tr').dataset.idLote;
                console.log(idLote);
                const datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                const userId = datosUsuario.userID;
                try {
                    const response = await fetch(`/api/semillas/${idLote}/publicar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId: userId })
                    });
            
                    const result = await response.json();
            
                    if (!response.ok) {
                        if (response.status === 403) {
                            window.location.href = result.redirectTo;
                            return;
                        }
                        throw new Error('Error al publicar el anuncio');
                    }
            
                    alert(result.message);
                    App.methods.obtenerYRenderizarSemillas();
                } catch (error) {
                    console.error('Error al publicar el anuncio:', error);
                }
            },

            async editarAnuncio(event) {
                const selectedRow = event.target.closest('tr'); // Get the closest row
                const idLote = selectedRow.dataset.idLote; // Get the ID of the selected lote
            
                // Extract data from the row
                const semillaData = {
                    numeroLote: selectedRow.cells[0].innerText,
                    fechaRegistro: new Date(selectedRow.cells[1].innerText).toISOString().split('T')[0],
                    nombreSemilla: selectedRow.cells[2].innerText,
                    variedad: selectedRow.cells[3].innerText,
                    cantidad: selectedRow.cells[4].innerText,
                    origen: selectedRow.cells[5].innerText,
                    fechaCosecha: selectedRow.cells[6].innerText,
                    mensaje: selectedRow.cells[7].innerText,
                };
            
                // Populate the form with the current data
                App.htmlElements.form.Lote.value = semillaData.numeroLote;
                App.htmlElements.form.nombreSemilla.value = semillaData.nombreSemilla;
                App.htmlElements.form.variedad.value = semillaData.variedad;
                App.htmlElements.form.cantidad.value = semillaData.cantidad;
                App.htmlElements.form.origen.value = semillaData.origen;
                App.htmlElements.form.fechaCosecha.value = semillaData.fechaCosecha;
                App.htmlElements.form.mensajePromocional.value = semillaData.mensaje;
            
                // Optionally, show a modal or form to confirm the edit
                // For example, show a modal (implement this function as needed)
                //this.showEditForm(idLote);
            },
            
            /*showEditForm(idLote) {
                // Logic to show the edit form or modal
                // You might want to store the idLote in a hidden field or variable
                // to use it when submitting the edited data
            },*/
            
            async eliminarAnuncio(event) {
                const idLote = event.target.closest('tr').dataset.idLote; // Get the idLote from the clicked row
                const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este anuncio?"); // Confirm deletion
            
                if (confirmDelete) {
                    try {
                        const response = await fetch(`/api/semillas/${idLote}/eliminar`, {
                            method: 'DELETE', // Use the DELETE method
                        });
            
                        if (!response.ok) {
                            throw new Error('Error al eliminar el anuncio');
                        }
            
                        const result = await response.json();
                        alert(result.message); // Show success message
                        App.methods.obtenerYRenderizarSemillas(); // Refresh the table
                    } catch (error) {
                        console.error('Error al eliminar el anuncio:', error);
                        alert('Error al eliminar el anuncio');
                    }
                }
            },
            
            mostrarLote(event) {
                const selectedRow = event.target.closest('tr'); // Ensure selectedRow is defined
                if (!selectedRow) {
                    console.error('No row found for the clicked element.');
                    return;
                }
            
                const semillaData = {
                    numeroLote: selectedRow.cells[0].innerText,
                    nombreSemilla: selectedRow.cells[1].innerText,
                    variedad: selectedRow.cells[2].innerText,
                    cantidad: selectedRow.cells[3].innerText,
                    origen: selectedRow.cells[4].innerText,
                    fechaCosecha: selectedRow.cells[5].innerText,
                    mensaje: selectedRow.cells[6].innerText,
                };
            
                localStorage.setItem('selectedSemilla', JSON.stringify(semillaData));
                window.location.href = '../html/publicacion.html';
            },      

            handleLogout() {
                localStorage.removeItem('sessionActive');
                localStorage.removeItem('usuarioActivo');
                window.location.href = '../index.html';
            },
            handlePerfil(){
                window.location.href = '../html/perfil.html';
            },
            handleHome(){
                window.location.href = '../html/home.html';
            },
            handleimagenesRegistro(){
                window.location.href = '/imagenes'
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

            obtenerFecha() {
                const fecha = new Date();
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const year = String(fecha.getFullYear());
                return `${year}-${mes}-${dia}`;
            },

            loadUserData() {
                const fecha = App.methods.obtenerFecha();

                console.log(fecha);
                App.htmlElements.form.fechaRegistro.value = fecha;
            },

            async obtenerYRenderizarSemillas() {
                const datosUsuario = JSON.parse(localStorage.getItem('usuarioActivo'));
                try {
                    const response = await fetch(`/api/semillas/${datosUsuario.userID}`);
                    const semillas = await response.json();
                    console.log(semillas);
                    App.methods.renderizarTabla(semillas);
                } catch (error) {
                    console.error('Error al obtener los datos de las semillas:', error);
                }
            },

            renderizarTabla(semillas) {
                const tablaBody = App.htmlElements.tablaBody;
                tablaBody.innerHTML = '';
                semillas.forEach(semilla => {
                    console.log(`semilla.publicado: ${semilla.publicado}`);
                    const nuevaFila = document.createElement('tr');
                    nuevaFila.dataset.idLote = semilla._id;
            
                    const botonEstado = semilla.publicado ? 'disabled' : '';                    
            
                    nuevaFila.innerHTML = `
                        <td>${semilla.numeroLote}</td>
                        <td>${new Date(semilla.fechaRegistro).toLocaleDateString()}</td>
                        <td>${semilla.nombreSemilla}</td>
                        <td>${semilla.variedad}</td>
                        <td>${semilla.cantidad}</td>
                        <td>${semilla.origen || ''}</td>
                        <td>${semilla.fechaCosecha ? new Date(semilla.fechaCosecha).toLocaleDateString() : ''}</td>
                        <td>${semilla.mensaje || ''}</td>
                        <td>${semilla.cantidad || ''}</td>
                        <td>
                            <button class="boton publicar" ${botonEstado}>Publicar</button>
                            ${semilla.publicado ? '<button class="boton editar">Editar</button>' : ''}
                        </td>
                        <td><button class="boton eliminar">Eliminar</button></td>
                        <td><button class="boton ver">Ver</button></td>
                    `;
                    tablaBody.appendChild(nuevaFila);
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
            },

            },
            
        }

    App.init();
})();