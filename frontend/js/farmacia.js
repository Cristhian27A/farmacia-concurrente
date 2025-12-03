if (typeof appState === 'undefined') {
    console.log('⚠️ appState no definida, creando versión local');
    window.appState = {
        usuario: null,
        carrito: []
    };
}

// 2. Asegurar que medicamentosPrueba existe
if (typeof medicamentosPrueba === 'undefined') {
    console.log('⚠️ medicamentosPrueba no definida, creando versión mínima');
    window.medicamentosPrueba = [
        {
            id: 1,
            nombre: "Paracetamol 500mg",
            precio: 0.5,
            stock: 100,
            categoria: "Analgésico", 
            imagen: "paracetamol.jpg",
            descripcion: "Alivia el dolor y reduce la fiebre"
        },
        {
            id: 2,
            nombre: "Amoxicilina 250mg",
            precio: 1.2,
            stock: 50,
            categoria: "Antibiótico",
            imagen: "amoxicilina.jpg", 
            descripcion: "Antibiótico para infecciones bacterianas"
        },
        {
            id: 3,
            nombre: "Ibuprofeno 400mg", 
            precio: 0.75,
            stock: 80,
            categoria: "Antiinflamatorio",
            imagen: "ibuprofeno.jpg",
            descripcion: "Alivia dolor, inflamación y fiebre"
        },
        {
            id: 4,
            nombre: "Loratadina 10mg",
            precio: 0.9,
            stock: 60,
            categoria: "Antialérgico",
            imagen: "loratadina.jpg",
            descripcion: "Alivia síntomas de alergia"
        },
        {
            id: 5,
            nombre: "Omeprazol 20mg",
            precio: 1.1,
            stock: 75,
            categoria: "Digestivo",
            imagen: "omeprazol.jpg",
            descripcion: "Reduce la producción de ácido estomacal"
        }
    ];
}

// 3. Definir enviarMensaje si no existe
if (typeof enviarMensaje === 'undefined') {
    console.log('⚠️ enviarMensaje no definida, creando versión local');
    window.enviarMensaje = function(mensaje, callback) {
        console.log('📤 Modo local - Enviando:', mensaje);
        
        // Simular respuestas del servidor
        setTimeout(() => {
            if (mensaje.startsWith('LISTAR_MEDICAMENTOS')) {
                if (callback) callback('FIN_LISTA|5 medicamentos encontrados');
            } else if (mensaje.startsWith('BUSCAR_MEDICAMENTOS')) {
                if (callback) callback('FIN_BUSQUEDA|0 resultados');
            } else if (mensaje.startsWith('PROCESAR_COMPRA')) {
                if (callback) callback('COMPRA_EXITOSA|0.00|GRATIS (Jubilado)|Usuario de prueba|Compra simulada');
            } else {
                if (callback) callback('OK|Modo local activado');
            }
        }, 300);
    };
}

// 4. Definir funciones del carrito si no existen
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
            const totalItems = (appState.carrito || []).reduce((total, item) => total + (item.cantidad || 1), 0);
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

let medicamentosCargados = [];

// Función SIMPLIFICADA que NO usa enviarMensaje
function listarTodosMedicamentos() {
    console.log('📋 Listando todos los medicamentos (modo local)');
    mostrarLoading();
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('stockFilter').value = '';
    
    // Usar datos locales directamente
    setTimeout(() => {
        mostrarMedicamentos(medicamentosPrueba);
        medicamentosCargados = medicamentosPrueba;
        ocultarLoading();
        if (document.getElementById('resultsInfo')) {
            document.getElementById('resultsInfo').textContent = `Mostrando ${medicamentosPrueba.length} medicamentos disponibles`;
        }
    }, 100);
}

// Función SIMPLIFICADA que NO usa enviarMensaje
function buscarMedicamentos() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        console.log('🔍 Buscando medicamentos para:', query);
        mostrarLoading();
        
        // Buscar localmente
        const resultados = medicamentosPrueba.filter(med => 
            med.nombre.toLowerCase().includes(query.toLowerCase()) ||
            (med.descripcion && med.descripcion.toLowerCase().includes(query.toLowerCase())) ||
            (med.categoria && med.categoria.toLowerCase().includes(query.toLowerCase()))
        );
        
        setTimeout(() => {
            mostrarMedicamentos(resultados);
            medicamentosCargados = resultados;
            ocultarLoading();
            
            const resultsInfo = document.getElementById('resultsInfo');
            if (resultsInfo) {
                resultsInfo.textContent = resultados.length > 0 
                    ? `Encontrados ${resultados.length} medicamentos para "${query}"`
                    : `No se encontraron medicamentos para "${query}"`;
            }
        }, 100);
    } else {
        listarTodosMedicamentos();
    }
}

function mostrarMedicamentos(medicamentos) {
    const grid = document.getElementById('medicamentosGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    if (medicamentos.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    grid.innerHTML = medicamentos.map(medicamento => `
        <div class="medicamento-card" data-id="${medicamento.id}">
            <div class="medicamento-image">
                <img src="images/${medicamento.imagen}" alt="${medicamento.nombre}" 
                     onerror="this.src='images/paracetamol.jpg'">
                <i class="fas fa-pills fallback-icon"></i>
            </div>
            <div class="medicamento-info">
                <h3>${medicamento.nombre}</h3>
                <p>${medicamento.descripcion || ''}</p>
                <div>
                    <span>${medicamento.categoria}</span>
                    <span>📦 ${medicamento.stock} disponibles</span>
                </div>
                <div>
                    <span>$${medicamento.precio.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="cantidad-selector">
                <button onclick="cambiarCantidad(${medicamento.id}, -1)" ${medicamento.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <input type="number" id="cantidad-${medicamento.id}" value="1" min="1" max="${medicamento.stock}" 
                       ${medicamento.stock === 0 ? 'disabled' : ''}>
                <button onclick="cambiarCantidad(${medicamento.id}, 1)" ${medicamento.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            
            <div>
                <button onclick="agregarAlCarrito(${JSON.stringify(medicamento).replace(/"/g, '&quot;')})"
                        ${medicamento.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        </div>
    `).join('');
}

function cambiarCantidad(medicamentoId, cambio) {
    const input = document.getElementById(`cantidad-${medicamentoId}`);
    if (!input) return;
    
    let nuevaCantidad = parseInt(input.value) + cambio;
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    input.value = nuevaCantidad;
}

function agregarAlCarrito(medicamento) {
    console.log('Agregando al carrito:', medicamento);
    
    const inputCantidad = document.getElementById(`cantidad-${medicamento.id}`);
    let cantidad = 1;
    
    if (inputCantidad) {
        cantidad = parseInt(inputCantidad.value);
        if (isNaN(cantidad) || cantidad < 1) {
            cantidad = 1;
        }
    }
    
    // Verificar stock disponible
    if (cantidad > medicamento.stock) {
        mostrarNotificacion(`No hay suficiente stock de ${medicamento.nombre}. Stock disponible: ${medicamento.stock}`, 'error');
        return;
    }
    
    // Buscar si el medicamento ya está en el carrito
    const itemExistenteIndex = appState.carrito.findIndex(item => item.id === medicamento.id);
    
    if (itemExistenteIndex !== -1) {
        // Verificar que la nueva cantidad total no exceda el stock
        const nuevaCantidadTotal = appState.carrito[itemExistenteIndex].cantidad + cantidad;
        if (nuevaCantidadTotal > medicamento.stock) {
            mostrarNotificacion(`No puedes agregar más de ${medicamento.stock} unidades de ${medicamento.nombre}`, 'warning');
            return;
        }
        // Actualizar cantidad existente
        appState.carrito[itemExistenteIndex].cantidad = nuevaCantidadTotal;
    } else {
        // Agregar nuevo item al carrito
        appState.carrito.push({
            id: medicamento.id,
            nombre: medicamento.nombre,
            precio: medicamento.precio,
            cantidad: cantidad,
            stock: medicamento.stock,
            imagen: medicamento.imagen,
            categoria: medicamento.categoria,
            descripcion: medicamento.descripcion
        });
    }
    
    // Resetear la cantidad a 1 después de agregar
    if (inputCantidad) {
        inputCantidad.value = 1;
    }
    
    // CORREGIDO: Usar guardarCarrito y actualizarContadorCarrito directamente
    guardarCarrito();
    actualizarContadorCarrito();
    
    mostrarNotificacion(`✅ ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de ${medicamento.nombre} agregada${cantidad === 1 ? '' : 's'} al carrito`, 'success');
    
    console.log('Carrito después de agregar:', appState.carrito);
    
    // Animación de agregado al carrito
    const card = document.querySelector(`[data-id="${medicamento.id}"]`);
    if (card) {
        card.classList.add('added-to-cart');
        setTimeout(() => {
            card.classList.remove('added-to-cart');
        }, 1000);
    }
}

function mostrarLoading() {
    const loading = document.getElementById('loadingMessage');
    if (loading) loading.style.display = 'flex';
}

function ocultarLoading() {
    const loading = document.getElementById('loadingMessage');
    if (loading) loading.style.display = 'none';
}
