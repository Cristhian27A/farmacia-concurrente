// Estado global de la aplicación
const appState = {
    socket: null,
    usuario: null,
    carrito: [],
    conexionActiva: false
};

// Conexión WebSocket al servidor Java
function conectarServidor() {
    try {
        appState.socket = new WebSocket('ws://localhost:12345');
        
        appState.socket.onopen = function(event) {
            console.log('✅ Conectado al servidor WebSocket');
            appState.conexionActiva = true;
            mostrarNotificacion('Conectado al servidor', 'success');
        };
        
        appState.socket.onmessage = function(event) {
            console.log('📨 Mensaje del servidor:', event.data);
            procesarMensajeServidor(event.data);
        };
        
        appState.socket.onclose = function(event) {
            console.log('🔌 Conexión cerrada');
            appState.conexionActiva = false;
            mostrarNotificacion('Conexión perdida', 'error');
            
            // Intentar reconectar después de 5 segundos
            setTimeout(conectarServidor, 5000);
        };
        
        appState.socket.onerror = function(error) {
            console.error('❌ Error WebSocket:', error);
            mostrarNotificacion('Error de conexión', 'error');
        };
        
    } catch (error) {
        console.error('❌ Error conectando al servidor:', error);
        mostrarNotificacion('No se pudo conectar al servidor', 'error');
    }
}

// Procesar mensajes recibidos del servidor
function procesarMensajeServidor(mensaje) {
    const [comando, ...datos] = mensaje.split('|');
    
    switch (comando) {
        case 'HOLA':
            console.log('Servidor dice:', datos[0]);
            break;
            
        case 'MEDICAMENTO':
            if (window.location.pathname.includes('farmacia.html')) {
                agregarMedicamentoALista(datos);
            }
            break;
            
        case 'FIN_LISTA':
            if (window.location.pathname.includes('farmacia.html')) {
                mostrarTotalMedicamentos(datos[0]);
            }
            break;
            
        case 'USUARIO_ENCONTRADO':
            manejarUsuarioEncontrado(datos);
            break;
            
        case 'USUARIO_NO_ENCONTRADO':
            manejarUsuarioNoEncontrado(datos[0]);
            break;
            
        case 'PRECIO_TOTAL':
            mostrarPrecioTotal(datos);
            break;
            
        case 'ERROR':
            mostrarNotificacion(datos[0], 'error');
            break;
            
        default:
            console.log('Comando no manejado:', comando, datos);
    }
}

// Enviar mensaje al servidor
function enviarMensaje(comando, datos = '') {
    if (appState.socket && appState.conexionActiva) {
        const mensaje = `${comando}|${datos}`;
        appState.socket.send(mensaje);
        console.log('📤 Enviado:', mensaje);
    } else {
        mostrarNotificacion('No hay conexión con el servidor', 'error');
    }
}

// Funciones de la interfaz
function mostrarLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function cerrarLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginResult').innerHTML = '';
    document.getElementById('loginResult').className = 'result-message';
}

function irAFarmacia() {
    window.location.href = 'farmacia.html';
}

function mostrarInfo() {
    alert('Sistema de consulta concurrente de medicamentos:\n\n• Consulta en tiempo real\n• Múltiples usuarios simultáneos\n• Precios especiales para jubilados\n• Integración con centros de salud');
}

// Manejo del formulario de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const identificacion = document.getElementById('identificacion').value.trim();
    
    if (!identificacion) {
        mostrarNotificacion('Por favor ingrese su identificación', 'error');
        return;
    }
    
    enviarMensaje('CONSULTAR_USUARIO', identificacion);
});

// Manejar respuesta de usuario encontrado
function manejarUsuarioEncontrado(datos) {
    const [id, nombre, tipo, identificacion] = datos;
    
    appState.usuario = {
        id: parseInt(id),
        nombre: nombre,
        tipo: tipo,
        identificacion: identificacion
    };
    
    const resultDiv = document.getElementById('loginResult');
    resultDiv.innerHTML = `
        <div class="user-info">
            <h4>✅ Usuario Identificado</h4>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Tipo:</strong> ${tipo === 'jubilado' ? '🎖️ Jubilado (Medicamentos Gratis)' : '👤 Regular'}</p>
            <p><strong>ID:</strong> ${identificacion}</p>
        </div>
    `;
    resultDiv.className = 'result-message result-success';
    
    // Actualizar interfaz
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${nombre}`;
    }
    
    // Cerrar modal después de 3 segundos
    setTimeout(() => {
        cerrarLogin();
        mostrarNotificacion(`Bienvenido ${nombre}`, 'success');
    }, 3000);
}

function manejarUsuarioNoEncontrado(mensaje) {
    const resultDiv = document.getElementById('loginResult');
    resultDiv.innerHTML = `❌ ${mensaje}`;
    resultDiv.className = 'result-message result-error';
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${tipo === 'error' ? '#ef4444' : tipo === 'success' ? '#06d6a0' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notificacion button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Farmacia Concurrente');
    conectarServidor();
    
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carritoFarmacia');
    if (carritoGuardado) {
        appState.carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
});

// Funciones del carrito
function agregarAlCarrito(medicamento) {
    appState.carrito.push(medicamento);
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion(`✅ ${medicamento.nombre} agregado al carrito`, 'success');
}

function guardarCarrito() {
    localStorage.setItem('carritoFarmacia', JSON.stringify(appState.carrito));
}

function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = appState.carrito.length;
    }
}

// Prevenir que el modal se cierre al hacer clic dentro
document.querySelector('.modal-content')?.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(e) {
    const modal = document.getElementById('loginModal');
    if (e.target === modal) {
        cerrarLogin();
    }
});