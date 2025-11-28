// Funciones específicas para la página del carrito
function cargarCarrito() {
    const carrito = appState.carrito;
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    
    mostrarCarritoConItems();
    renderizarItemsCarrito();
    calcularTotales();
}

function mostrarCarritoVacio() {
    document.getElementById('emptyCart').style.display = 'block';
    document.getElementById('cartWithItems').style.display = 'none';
}

function mostrarCarritoConItems() {
    document.getElementById('emptyCart').style.display = 'none';
    document.getElementById('cartWithItems').style.display = 'block';
}

function renderizarItemsCarrito() {
    const cartItemsList = document.getElementById('cartItemsList');
    const carrito = appState.carrito;
    
    cartItemsList.innerHTML = carrito.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="item-info">
                <div class="item-image">
                   <img src="images/${item.imagen}" alt="${item.nombre}"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <i class="fas fa-pills fallback-icon"></i>
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.nombre}</h4>
                    <p class="item-desc">${item.descripcion}</p>
                    <span class="item-category">${item.categoria}</span>
                </div>
            </div>
            <div class="item-price">
                $${item.precio.toFixed(2)}
            </div>
            <div class="item-quantity">
                <span class="quantity">1</span>
            </div>
            <div class="item-total">
                $${item.precio.toFixed(2)}
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="removerDelCarrito(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function calcularTotales() {
    const carrito = appState.carrito;
    const subtotal = carrito.reduce((total, item) => total + item.precio, 0);
    
    let descuento = 0;
    let total = subtotal;
    
    // Aplicar descuento de jubilado
    if (appState.usuario && appState.usuario.tipo === 'jubilado') {
        descuento = subtotal; // 100% de descuento
        total = 0;
    }
    
    // Actualizar UI
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${descuento.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Actualizar información del usuario
    actualizarInfoUsuario();
}

function actualizarInfoUsuario() {
    const userTypeInfo = document.getElementById('userTypeInfo');
    
    if (appState.usuario) {
        if (appState.usuario.tipo === 'jubilado') {
            userTypeInfo.innerHTML = `
                <div class="user-benefit">
                    <i class="fas fa-crown"></i>
                    <strong>Beneficio de Jubilado:</strong> Todos los medicamentos son GRATIS
                </div>
            `;
            userTypeInfo.className = 'user-type-info jubilado';
        } else {
            userTypeInfo.innerHTML = `
                <div class="user-benefit">
                    <i class="fas fa-user"></i>
                    <strong>Usuario Regular:</strong> Precios estándar aplican
                </div>
            `;
            userTypeInfo.className = 'user-type-info regular';
        }
    } else {
        userTypeInfo.innerHTML = `
            <div class="user-benefit">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>No identificado:</strong> 
                <a href="javascript:mostrarLogin()">Identifíquese</a> para ver precios especiales
            </div>
        `;
        userTypeInfo.className = 'user-type-info unknown';
    }
}

function removerDelCarrito(index) {
    appState.carrito.splice(index, 1);
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
    if (appState.carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }
    
    if (!appState.usuario) {
        mostrarNotificacion('Por favor identifíquese primero', 'error');
        mostrarLogin();
        return;
    }
    
    // Calcular total final
    const subtotal = appState.carrito.reduce((total, item) => total + item.precio, 0);
    const total = appState.usuario.tipo === 'jubilado' ? 0 : subtotal;
    
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(appState.carrito, total);
}

function mostrarModalConfirmacion(carrito, total) {
    const modal = document.getElementById('confirmationModal');
    const content = document.getElementById('confirmationContent');
    
    content.innerHTML = `
        <div class="confirmation-details">
            <p><strong>Usuario:</strong> ${appState.usuario.nombre}</p>
            <p><strong>Tipo:</strong> ${appState.usuario.tipo === 'jubilado' ? '🎖️ Jubilado' : '👤 Regular'}</p>
            <p><strong>Medicamentos:</strong> ${carrito.length} items</p>
            
            <div class="order-items">
                <h4>Resumen del Pedido:</h4>
                ${carrito.map(item => `
                    <div class="order-item">
                        <span>💊 ${item.nombre}</span>
                        <span>$${item.precio.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                <h3>Total a Pagar: $${total.toFixed(2)}</h3>
                ${appState.usuario.tipo === 'jubilado' ? 
                  '<p class="gratis">🎉 ¡Todos los medicamentos son GRATIS para jubilados!</p>' : ''}
            </div>
            
            <div class="order-info">
                <p><i class="fas fa-info-circle"></i> Presente esta confirmación en la farmacia</p>
                <p><i class="fas fa-clock"></i> Pedido #${Date.now().toString().slice(-6)}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function cerrarConfirmacion() {
    document.getElementById('confirmationModal').style.display = 'none';
}

function irAFarmacia() {
    window.location.href = 'farmacia.html';
}

// Inicializar carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    
    // Actualizar nombre de usuario si está logueado
    if (appState.usuario) {
        document.getElementById('user-name').textContent = appState.usuario.nombre;
    }
    
    // Escuchar cambios en el estado del usuario
    setInterval(() => {
        if (appState.usuario) {
            calcularTotales(); // Recalcular si el usuario se identifica
        }
    }, 1000);
});