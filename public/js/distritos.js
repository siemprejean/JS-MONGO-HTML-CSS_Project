(() => {
    const Distritos = {
        htmlElements: {
            selectProvincia: document.getElementById('estado'),
            selectDistrito: document.getElementById('distrito')
        },
        init() {
            Distritos.bindEvents();
            Distritos.methods.loadUserData();
        },
        bindEvents() {
            Distritos.htmlElements.selectProvincia.addEventListener('change', Distritos.handlers.handleProvinciaChange);
        },
        handlers: {
            handleProvinciaChange(event) {
                const provincia = event.target.value;
                Distritos.methods.updateDistritoOptions(provincia);
            }
        },
        methods: {
            loadUserData() {
                const userData = JSON.parse(localStorage.getItem('usuarioActivo'));
                if (userData && userData.estado) {
                    Distritos.htmlElements.selectProvincia.value = userData.estado;
                    Distritos.methods.updateDistritoOptions(userData.estado, userData.distrito);
                }
            },
            updateDistritoOptions(provincia, selectedDistrito = '') {
                const distritosSelect = Distritos.htmlElements.selectDistrito;
                distritosSelect.innerHTML = '';

                let distritos = [];
                switch (provincia) {
                    case 'Bocas del Toro':
                        distritos = ['Bocas del Toro', 'Changuinola', 'Chiriquí Grande', 'Almirante'];
                        break;
                    case 'Coclé':
                        distritos = ['Aguadulce', 'Antón', 'La Pintada', 'Natá', 'Olá', 'Penonomé'];
                        break;
                    case 'Colón':
                        distritos = ['Colón', 'Chagres', 'Donoso', 'Portobelo', 'Santa Isabel'];
                        break;
                    case 'Chiriquí':
                        distritos = ['Alanje', 'Barú', 'Boquerón', 'Boquete', 'Bugaba', 'David', 'Dolega', 'Gualaca', 'Remedios', 'Renacimiento', 'San Félix', 'San Lorenzo', 'Tolé', 'Tierras Altas'];
                        break;
                    case 'Darién':
                        distritos = ['Chepigana', 'Pinogana', 'Santa Fe'];
                        break;
                    case 'Herrera':
                        distritos = ['Chitré', 'Las Minas', 'Los Pozos', 'Ocú', 'Parita', 'Pesé', 'Santa María'];
                        break;
                    case 'Los Santos':
                        distritos = ['Guararé', 'Las Tablas', 'Los Santos', 'Macaracas', 'Pedasí', 'Pocrí', 'Tonosí'];
                        break;
                    case 'Panamá':
                        distritos = ['Balboa', 'Chepo', 'Chimán', 'Panamá', 'San Miguelito', 'Taboga'];
                        break;
                    case 'Panamá Oeste':
                        distritos = ['Arraiján', 'Capira', 'Chame', 'La Chorrera', 'San Carlos'];
                        break;
                    case 'Veraguas':
                        distritos = ['Atalaya', 'Calobre', 'Cañazas', 'La Mesa', 'Las Palmas', 'Montijo', 'Río de Jesús', 'San Francisco', 'Santa Fé', 'Santiago', 'Soná', 'Mariato'];
                        break;
                    case 'Guna Yala':
                        distritos = ['Ailigandí', 'Cartí Sugdup', 'Narganá'];
                        break;
                    case 'Emberá':
                        distritos = ['Cémaco', 'Sambú'];
                        break;
                    case 'Ngäbe-Buglé':
                        distritos = ['Besiko', 'Kankintú', 'Kusapín', 'Müna', 'Ñürüm', 'Nole Duima', 'Jirondai'];
                        break;
                    default:
                        distritos = [];
                        break;
                }

                distritos.forEach(distrito => {
                    const option = document.createElement('option');
                    option.value = distrito;
                    option.textContent = distrito;
                    if (distrito === selectedDistrito) {
                        option.selected = true;
                    }
                    distritosSelect.appendChild(option);
                });

                distritosSelect.disabled = distritos.length === 1 && distritos[0] === 'Seleccione provincia';
            }
        }
    };

    Distritos.init();
})();

