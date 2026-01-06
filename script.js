// Variables globales
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

// Función para cambiar de página (ahora es global)
function navigateTo(pageName) {
    console.log('Navegando a:', pageName);
    
    // Ocultar todas las páginas
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostrar la página seleccionada
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Página activada:', pageName);
    } else {
        console.error('Página no encontrada:', pageName);
    }
    
    // Actualizar botones activos en TODAS las barras de navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
    
    // Scroll al inicio de la página
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script cargado correctamente');
    
    // Verificar si el usuario está logueado
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (isLoggedIn !== 'true') {
        // Si no está logueado, redirigir al login
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Botones encontrados:', navButtons.length);
    console.log('Páginas encontradas:', pages.length);
    
    // Agregar event listeners a todos los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.dataset.page;
            console.log('Click en botón:', targetPage);
            navigateTo(targetPage);
        });
    });

    // Botones de áreas en página de inicio
    const areaButtons = document.querySelectorAll('.area-btn');
    areaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const area = this.dataset.area;
            console.log('Click en área:', area);
            
            // Navegar directamente a la página del área específica
            if (area === 'legal') {
                navigateTo('area-legal');
            } else if (area === 'extra') {
                navigateTo('area-extra');
            } else if (area === 'escritura') {
                navigateTo('area-escritura');
            }
        });
    });
    
    // Mostrar la página de inicio al cargar
    navigateTo('home');
});

// Base de datos de requisitos
const requisitos = {
    escrituras: {
        titulo: "✍️ Escrituras Públicas",
        secciones: [
            {
                titulo: "Documentos Generales",
                items: [
                    "DNI original y copia del vendedor y comprador",
                    "Partida de nacimiento actualizada (no mayor a 3 meses)",
                    "Certificado de soltería o partida de matrimonio",
                    "Recibo de servicio público (luz, agua o teléfono)"
                ]
            },
            {
                titulo: "Documentos del Inmueble",
                items: [
                    "Título de propiedad o escritura anterior",
                    "Certificado de búsqueda catastral",
                    "Autoevalúo del año en curso",
                    "Certificado de gravámenes (Registros Públicos)"
                ]
            }
        ],
        nota: "Todos los documentos deben estar vigentes y en buen estado. Los certificados no deben tener más de 30 días de antigüedad."
    },
    poderes: {
        titulo: "📄 Poderes y Testamentos",
        secciones: [
            {
                titulo: "Para Poderes",
                items: [
                    "DNI vigente del otorgante y apoderado",
                    "Datos completos del apoderado (nombre completo, DNI, domicilio)",
                    "Especificar las facultades que se otorgan",
                    "Certificado de salud mental (en algunos casos)"
                ]
            },
            {
                titulo: "Para Testamentos",
                items: [
                    "DNI vigente del testador",
                    "Lista de bienes a testar",
                    "Datos de los herederos designados",
                    "Certificado médico de capacidad mental"
                ]
            }
        ],
        nota: "El testador debe presentarse personalmente ante el notario. No se aceptan representantes."
    },
    sucesiones: {
        titulo: "👨‍👩‍👧‍👦 Sucesiones",
        secciones: [
            {
                titulo: "Documentos del Causante",
                items: [
                    "Partida de defunción original",
                    "DNI del causante",
                    "Testamento (si existe)",
                    "Certificado de bienes registrados"
                ]
            },
            {
                titulo: "Documentos de los Herederos",
                items: [
                    "DNI vigente de todos los herederos",
                    "Partidas de nacimiento que acrediten parentesco",
                    "Declaración jurada de herederos",
                    "Certificado domiciliario"
                ]
            }
        ],
        nota: "El trámite puede demorar entre 30 a 60 días hábiles dependiendo de la complejidad del caso."
    },
    empresas: {
        titulo: "🏢 Constitución de Empresas",
        secciones: [
            {
                titulo: "Documentos de los Socios",
                items: [
                    "DNI vigente de todos los socios",
                    "RUC de cada socio (si lo tienen)",
                    "Certificado domiciliario de cada socio",
                    "Declaración de bienes aportados al capital"
                ]
            },
            {
                titulo: "Documentos de la Empresa",
                items: [
                    "Búsqueda y reserva de nombre en Registros Públicos",
                    "Minuta de constitución",
                    "Descripción de la actividad económica",
                    "Capital social y distribución de acciones"
                ]
            }
        ],
        nota: "Se requiere un mínimo de 2 socios para constituir una sociedad. El capital puede ser en efectivo o bienes."
    },
    certificaciones: {
        titulo: "📋 Certificaciones",
        secciones: [
            {
                titulo: "Copias Certificadas",
                items: [
                    "Documento original a certificar",
                    "DNI del solicitante",
                    "Número de copias requeridas",
                    "Motivo de la certificación (opcional)"
                ]
            },
            {
                titulo: "Legalizaciones",
                items: [
                    "Documento a legalizar en original",
                    "DNI del titular del documento",
                    "Firma del titular en presencia del notario",
                    "Comprobante de pago de derecho notarial"
                ]
            }
        ],
        nota: "Las certificaciones están listas el mismo día. Las legalizaciones requieren firma presencial."
    }
};

// Función para mostrar requisitos
function showRequirements(servicio) {
    const data = requisitos[servicio];
    if (!data) return;
    
    // Actualizar título
    document.getElementById('requirementsTitle').textContent = data.titulo;
    
    // Construir HTML de requisitos
    let html = '';
    
    data.secciones.forEach(seccion => {
        html += `
            <div class="requirement-section">
                <h3>${seccion.titulo}</h3>
                <ul class="requirement-list">
                    ${seccion.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    
    // Agregar nota si existe
    if (data.nota) {
        html += `
            <div class="requirement-note">
                <p><strong>📌 Nota importante:</strong> ${data.nota}</p>
            </div>
        `;
    }
    
    document.getElementById('requirementsContent').innerHTML = html;
    
    // Navegar a la página de requisitos
    navigateTo('requirements');
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}

// Función para toggle del menú hamburguesa
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    sideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Función para instalar la app (PWA)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('Prompt de instalación disponible');
});

function promptInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
            }
            deferredPrompt = null;
        });
    } else {
        // Si no está disponible el prompt, mostrar instrucciones
        alert('Para instalar la app:\n\niPhone: Toca el botón Compartir y selecciona "Agregar a pantalla de inicio"\n\nAndroid: Toca el menú (⋮) y selecciona "Añadir a pantalla de inicio"');
    }
}