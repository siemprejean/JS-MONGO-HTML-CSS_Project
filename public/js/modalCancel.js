// modal.js
(() => {
    const App = {
        htmlElements: {
            modal: document.getElementById('modal'),
            cancelarProceso: document.getElementById('cancelarProceso'),
            confirmarCancelar: document.getElementById('btnCancelar'),
            cerrarModal: document.getElementById('cerrarModal'),
        },
        init() {
            App.bindEvents();
        },
        bindEvents() {
            App.htmlElements.confirmarCancelar.addEventListener('click', App.handlers.showModal);
            App.htmlElements.cancelarProceso.addEventListener('click', App.handlers.cancelProcess);
            App.htmlElements.cerrarModal.addEventListener('click', App.handlers.closeModal);
        },
        handlers: {
            showModal() {
                App.htmlElements.modal.classList.remove('hidden'); // Muestra el modal
            },
            closeModal() {
                App.htmlElements.modal.classList.add('hidden'); // Oculta el modal
            },
            cancelProcess() {
                window.location.href = 'inventario.html'; // Redirige a inventario.html
            },
        },
    };
    
    App.init();
})();





