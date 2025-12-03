if (typeof appState === 'undefined') {
    console.log('⚠️ appState no definida, creando versión local');
    window.appState = {
        usuario: null,
        carrito: []
    };
}

// Definir funciones del carrito si no existen
if (typeof guardarCarrito === 'undefined') {
    console.log('⚠️ guardarCarrito no definida, creando versión local');
    window.guardarCarrito = function() {
        try {
            localStorage.setItem('carritoFarmacia', JSON.stringify(appState.carrito || []));
            console.log('💾 Carrito guardado:', appState.carrito);
        } catch (e) {
            console.error('Error guardando carrito:', e);
        }
    };
}

if (typeof actualizarContadorCarrito === 'undefined') {
    console.log('⚠️ actualizarContadorCarrito no definida, creando versión local');
    window.actualizarContadorCarrito = function() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const carrito = appState.carrito || [];
            const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
            cartCount.textContent = totalItems;
            console.log('🛒 Contador actualizado:', totalItems);
        }
    };
}

if (typeof actualizarCarrito === 'undefined') {
    console.log('⚠️ actualizarCarrito no definida, creando versión local');
    window.actualizarCarrito = function() {
        guardarCarrito();
        actualizarContadorCarrito();
        console.log('✅ Carrito completamente actualizado');
    };
}

function cargarCarrito() {
    console.log('🛒 Cargando carrito...');
    
    // Asegurar que appState.carrito existe
    if (!appState.carrito) {
        appState.carrito = [];
    }
    
    const carrito = appState.carrito;
    
    console.log('Carrito actual:', carrito);
    
    if (!carrito || carrito.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    
    mostrarCarritoConItems();
    renderizarItemsCarrito();
    calcularTotales();
}

function mostrarCarritoVacio() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartWithItems) cartWithItems.style.display = 'none';
}

function mostrarCarritoConItems() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';
}

function renderizarItemsCarrito() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;
    
    const carrito = appState.carrito || [];
    
    console.log('Renderizando', carrito.length, 'items');
    
    if (carrito.length === 0) {
        cartItemsList.innerHTML = '';
        return;
    }
    
    cartItemsList.innerHTML = carrito.map((item, index) => {
        // Validar y asignar valores por defecto
        const safeItem = {
            id: item.id || 0,
            nombre: item.nombre || 'Medicamento sin nombre',
            precio: item.precio || 0,
            cantidad: item.cantidad || 1,
            stock: item.stock || 0,
            imagen: item.imagen || 'paracetamol.jpg',
            categoria: item.categoria || 'Sin categoría'
        };
        
        return `
        <div class="cart-item" data-index="${index}">
            <div class="item-info">
                <div class="medicamento-image">
                    <img src="images/${safeItem.imagen}" alt="${safeItem.nombre}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <i class="fas fa-pills fallback-icon"></i>
                </div>
                <div class="item-details">
                    <h4 class="item-name">${safeItem.nombre}</h4>
                    <p class="item-category">${safeItem.categoria}</p>
                    <span class="item-stock">Stock disponible: ${safeItem.stock}</span>
                </div>
            </div>
            <div class="item-price">
                $${safeItem.precio.toFixed(2)}
            </div>
            <div class="item-quantity">
                <div class="cantidad-selector">
                    <button class="btn-cantidad" onclick="cambiarCantidadCarrito(${index}, -1)" 
                            ${safeItem.cantidad <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" id="cantidad-carrito-${index}" 
                           value="${safeItem.cantidad}" min="1" max="${safeItem.stock}" 
                           class="input-cantidad" 
                           onchange="actualizarCantidadCarrito(${index})">
                    <button class="btn-cantidad" onclick="cambiarCantidadCarrito(${index}, 1)" 
                            ${safeItem.cantidad >= safeItem.stock ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="item-total">
                $${(safeItem.precio * safeItem.cantidad).toFixed(2)}
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="removerDelCarrito(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function cambiarCantidadCarrito(index, cambio) {
    const carrito = appState.carrito || [];
    if (index < 0 || index >= carrito.length) return;
    
    const item = carrito[index];
    if (!item) return;
    
    const nuevaCantidad = (item.cantidad || 1) + cambio;
    
    if (nuevaCantidad < 1) return;
    if (nuevaCantidad > (item.stock || 0)) {
        mostrarNotificacion(`No hay suficiente stock. Máximo: ${item.stock || 0}`, 'warning');
        return;
    }
    
    item.cantidad = nuevaCantidad;
    guardarCarrito();
    cargarCarrito();
}

function actualizarCantidadCarrito(index) {
    const input = document.getElementById(`cantidad-carrito-${index}`);
    const carrito = appState.carrito || [];
    
    if (!input || index < 0 || index >= carrito.length) return;
    
    const item = carrito[index];
    if (!item) return;
    
    let cantidad = parseInt(input.value);
    
    if (isNaN(cantidad) || cantidad < 1) {
        cantidad = 1;
    } else if (cantidad > (item.stock || 0)) {
        cantidad = item.stock || 0;
        mostrarNotificacion(`Stock máximo: ${item.stock || 0} unidades`, 'warning');
    }
    
    item.cantidad = cantidad;
    input.value = cantidad;
    guardarCarrito();
    cargarCarrito();
}

function calcularTotales() {
    const carrito = appState.carrito || [];
    const subtotal = carrito.reduce((total, item) => {
        const precio = item.precio || 0;
        const cantidad = item.cantidad || 1;
        return total + (precio * cantidad);
    }, 0);
    
    let descuento = 0;
    let total = subtotal;
    
    // Aplicar descuento de jubilado para Nidia Rojas
    if (appState.usuario && appState.usuario.tipo === 'jubilado') {
        descuento = subtotal;
        total = 0;
    }
    
    // Actualizar UI
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${descuento.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    actualizarInfoUsuario();
}

function actualizarInfoUsuario() {
    const userTypeInfo = document.getElementById('userTypeInfo');
    if (!userTypeInfo) return;
    
    if (appState.usuario) {
        // Mostrar información específica según el usuario
        let beneficiosHTML = '';
        let tipoClase = 'regular';
        let icono = 'fas fa-user';
        
        switch(appState.usuario.tipo) {
            case 'jubilado':
                beneficiosHTML = `
                    <div class="user-benefit">
                        <i class="fas fa-crown"></i>
                        <strong>Beneficio de Jubilado:</strong> Todos los medicamentos son GRATIS
                    </div>
                `;
                tipoClase = 'jubilado';
                icono = 'fas fa-crown';
                break;
                
            case 'regular':
            default:
                beneficiosHTML = `
                    <div class="user-benefit">
                        <i class="fas fa-user"></i>
                        <strong>Usuario Regular:</strong> Precios estándar aplican
                    </div>
                `;
                tipoClase = 'regular';
                icono = 'fas fa-user';
                break;
        }
        
        userTypeInfo.innerHTML = `
            <div class="user-header">
                <i class="${icono}"></i>
                <div class="user-details">
                    <strong>${appState.usuario.nombre || 'Usuario'}</strong>
                    <small>ID: ${appState.usuario.identificacion || 'No identificado'}</small>
                </div>
            </div>
            ${beneficiosHTML}
        `;
        userTypeInfo.className = `user-type-info ${tipoClase}`;
    } else {
        userTypeInfo.innerHTML = `
            <div class="user-benefit">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>No identificado:</strong> 
                <a href="javascript:mostrarLogin()">Identifíquese</a> para ver precios especiales
            </div>
            <div class="user-tips">
                <small>Usuarios disponibles:</small>
                <ul class="user-list">
                    <li><strong>Cristhian Alonso:</strong> 2-753-1690 (Regular)</li>
                    <li><strong>Jesús Moreno:</strong> 2-753-919 (Regular)</li>
                    <li><strong>Nidia Rojas:</strong> 2-732-1293 (Jubilada)</li>
                </ul>
            </div>
        `;
        userTypeInfo.className = 'user-type-info unknown';
    }
}

function removerDelCarrito(index) {
    const carrito = appState.carrito || [];
    if (index < 0 || index >= carrito.length) return;
    
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarContadorCarrito();
    cargarCarrito();
    
    mostrarNotificacion('Medicamento removido del carrito', 'info');
}

function vaciarCarrito() {
    if (confirm('¿Está seguro de que desea vaciar el carrito?')) {
        appState.carrito = [];
        guardarCarrito();
        actualizarContadorCarrito();
        cargarCarrito();
        
        mostrarNotificacion('Carrito vaciado', 'info');
    }
}

function procesarPedido() {
    const carrito = appState.carrito || [];
    
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    
    if (!appState.usuario) {
        mostrarNotificacion('Por favor identifíquese primero', 'error');
        mostrarLogin();
        return;
    }
    
    // Preparar datos para enviar al servidor
    const itemsCompra = carrito.map(item => `${item.id || 0}:${item.cantidad || 1}`).join(',');
    const identificacion = appState.usuario.identificacion || '';
    const mensaje = `PROCESAR_COMPRA|${identificacion}|${itemsCompra}`;
    
    console.log('Enviando compra para:', appState.usuario.nombre);
    console.log('Mensaje:', mensaje);
    mostrarNotificacion(`Procesando pedido para ${appState.usuario.nombre}...`, 'info');
    
    // Enviar al servidor
    enviarMensaje(mensaje, function(respuesta) {
        console.log('Respuesta del servidor:', respuesta);
        
        if (respuesta.startsWith('COMPRA_EXITOSA')) {
            const partes = respuesta.split('|');
            mostrarConfirmacionCompraExitosa(
                partes[1] || '0.00',
                partes[2] || 'PAGO',
                partes[3] || appState.usuario.nombre || 'Usuario',
                partes[4] || 'Compra completada'
            );
            
            // Vaciar carrito después de compra exitosa
            appState.carrito = [];
            guardarCarrito();
            actualizarContadorCarrito();
            
        } else if (respuesta.startsWith('ERROR')) {
            const mensajeError = respuesta.split('|')[1] || 'Error desconocido';
            mostrarNotificacion('Error en la compra: ' + mensajeError, 'error');
        }
    });
}

function mostrarConfirmacionCompraExitosa(total, tipoPago, usuario, detalles) {
    const modal = document.getElementById('confirmationModal');
    const content = document.getElementById('confirmationContent');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div class="confirmation-details">
            <div class="success-header">
                <i class="fas fa-check-circle success-icon"></i>
                <h3>¡Compra Exitosa!</h3>
            </div>
            
            <div class="purchase-info">
                <p><strong>Usuario:</strong> ${usuario}</p>
                <p><strong>Tipo de pago:</strong> ${tipoPago}</p>
                <p><strong>Total:</strong> $${total}</p>
                
                <div class="purchase-items">
                    <h4>Detalles de la compra:</h4>
                    <div class="items-list">
                        ${(detalles || '').split('; ').map(item => `
                            <div class="purchase-item">${item}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="purchase-summary">
                <p class="summary-text">
                    ${tipoPago.includes('GRATIS') ? 
                        '🎖️ ¡Gracias por su servicio! Como jubilado, sus medicamentos son totalmente gratuitos.' : 
                        '✅ Su pago ha sido procesado exitosamente.'}
                </p>
            </div>
            
            <div class="confirmation-actions">
                <button class="btn btn-secondary" onclick="cerrarConfirmacion()">
                    Cerrar
                </button>
                <button class="btn btn-primary" onclick="irAFarmacia()">
                    <i class="fas fa-shopping-cart"></i> Continuar Comprando
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function cerrarConfirmacion() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.style.display = 'none';
}

function irAFarmacia() {
    window.location.href = 'farmacia.html';
}

// Función auxiliar para notificaciones si no existe
if (typeof mostrarNotificacion === 'undefined') {
    window.mostrarNotificacion = function(mensaje, tipo = 'info') {
        console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
        alert(mensaje);
    };
}

// Función auxiliar para mostrar login si no existe
if (typeof mostrarLogin === 'undefined') {
    window.mostrarLogin = function() {
        alert('Por favor, ingrese su identificación en la página principal');
        window.location.href = 'index.html';
    };
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ carrito.js - DOM cargado');
    
    // Asegurar que appState.carrito existe
    if (!appState.carrito) {
        appState.carrito = [];
    }
    
    // Verificar si hay usuario en localStorage
    const usuarioGuardado = localStorage.getItem('usuarioFarmacia');
    if (usuarioGuardado && !appState.usuario) {
        try {
            appState.usuario = JSON.parse(usuarioGuardado);
            console.log('👤 Usuario cargado desde localStorage:', appState.usuario);
        } catch (e) {
            console.error('Error cargando usuario:', e);
        }
    }
    
    cargarCarrito();
    
    // Agregar evento para vaciar carrito
    const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }
    
    // Agregar evento para procesar pedido
    const procesarPedidoBtn = document.getElementById('procesarPedido');
    if (procesarPedidoBtn) {
        procesarPedidoBtn.addEventListener('click', procesarPedido);
    }
    
    // Agregar evento para ir a farmacia
    const seguirComprandoBtn = document.getElementById('seguirComprando');
    if (seguirComprandoBtn) {
        seguirComprandoBtn.addEventListener('click', irAFarmacia);
    }
    
    // Estilos adicionales para la UI de usuario
    const style = document.createElement('style');
    style.textContent = `
        .user-type-info {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid;
        }
        
        .user-type-info.jubilado {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        
        .user-type-info.regular {
            background-color: #d1ecf1;
            border-color: #0dcaf0;
            color: #055160;
        }
        
        .user-type-info.unknown {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        
        .user-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }
        
        .user-header i {
            font-size: 1.5rem;
        }
        
        .user-details {
            display: flex;
            flex-direction: column;
        }
        
        .user-benefit {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .user-tips {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px dashed rgba(0,0,0,0.1);
        }
        
        .user-list {
            margin: 0.25rem 0 0 1rem;
            padding: 0;
            font-size: 0.85rem;
        }
        
        .user-list li {
            margin-bottom: 0.25rem;
        }
        
        .purchase-summary {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 0.5rem;
            border-left: 4px solid #198754;
        }
        
        .summary-text {
            margin: 0;
            font-size: 0.95rem;
        }
        
        .confirmation-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
    `;
    document.head.appendChild(style);
});