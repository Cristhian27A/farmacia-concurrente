// Funciones específicas para la página de farmacia
let medicamentosCargados = [];

function listarTodosMedicamentos() {
    mostrarLoading();
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('stockFilter').value = '';
    enviarMensaje('LISTAR_MEDICAMENTOS');
}

function buscarMedicamentos() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        mostrarLoading();
        enviarMensaje('BUSCAR_MEDICAMENTOS', query);
    } else {
        listarTodosMedicamentos();
    }
}

function filtrarPorCategoria() {
    aplicarFiltros();
}

function filtrarPorStock() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const categoria = document.getElementById('categoryFilter').value;
    const stock = document.getElementById('stockFilter').value;
    
    let medicamentosFiltrados = [...medicamentosCargados];
    
    // Filtrar por categoría
    if (categoria) {
        medicamentosFiltrados = medicamentosFiltrados.filter(med => 
            med.categoria.toLowerCase() === categoria.toLowerCase()
        );
    }
    
    // Filtrar por stock
    if (stock === 'disponible') {
        medicamentosFiltrados = medicamentosFiltrados.filter(med => med.stock > 0);
    } else if (stock === 'agotado') {
        medicamentosFiltrados = medicamentosFiltrados.filter(med => med.stock === 0);
    }
    
    mostrarMedicamentos(medicamentosFiltrados);
}

function agregarMedicamentoALista(datos) {
    const [id, nombre, precio, stock, categoria, imagen, descripcion] = datos;
    
    const medicamento = {
        id: parseInt(id),
        nombre: nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria: categoria,
        imagen: imagen,
        descripcion: descripcion
    };
    
    medicamentosCargados.push(medicamento);
}

function mostrarTotalMedicamentos(info) {
    setTimeout(() => {
        ocultarLoading();
        mostrarMedicamentos(medicamentosCargados);
        document.getElementById('resultsInfo').textContent = info;
    }, 500);
}

function mostrarMedicamentos(medicamentos) {
    const grid = document.getElementById('medicamentosGrid');
    const noResults = document.getElementById('noResults');
    
    if (medicamentos.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    grid.innerHTML = medicamentos.map(medicamento => `
        <div class="medicamento-card" data-id="${medicamento.id}">
        <div class="medicamento-image">
            <img src="images/${medicamento.imagen}" alt="${medicamento.nombre}" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <i class="fas fa-pills fallback-icon"></i>
        </div>
            <div class="medicamento-info">
                <h3 class="medicamento-name">${medicamento.nombre}</h3>
                <p class="medicamento-desc">${medicamento.descripcion}</p>
                <div class="medicamento-meta">
                    <span class="medicamento-category">${medicamento.categoria}</span>
                    <span class="medicamento-stock ${medicamento.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${medicamento.stock > 0 ? `📦 ${medicamento.stock} disponibles` : '❌ Agotado'}
                    </span>
                </div>
                <div class="medicamento-price">
                    <span class="price">$${medicamento.precio.toFixed(2)}</span>
                    ${appState.usuario && appState.usuario.tipo === 'jubilado' ? 
                      '<span class="discount">🎖️ GRATIS</span>' : ''}
                </div>
            </div>
            <div class="medicamento-actions">
                <button class="btn-add-cart" 
                        onclick="agregarAlCarrito(${JSON.stringify(medicamento).replace(/"/g, '&quot;')})"
                        ${medicamento.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                    Agregar
                </button>
                <button class="btn-info" onclick="mostrarDetalleMedicamento(${medicamento.id})">
                    <i class="fas fa-info-circle"></i>
                    Detalles
                </button>
            </div>
        </div>
    `).join('');
}

function mostrarLoading() {
    document.getElementById('loadingMessage').style.display = 'flex';
    document.getElementById('medicamentosGrid').innerHTML = '';
    document.getElementById('noResults').style.display = 'none';
    medicamentosCargados = [];
}

function ocultarLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
}

function mostrarDetalleMedicamento(id) {
    const medicamento = medicamentosCargados.find(med => med.id === id);
    if (medicamento) {
        const precioFinal = appState.usuario && appState.usuario.tipo === 'jubilado' ? 
                          0 : medicamento.precio;
        
        alert(`💊 ${medicamento.nombre}\n\n` +
              `📝 ${medicamento.descripcion}\n\n` +
              `🏷️ Categoría: ${medicamento.categoria}\n` +
              `📦 Stock: ${medicamento.stock} unidades\n` +
              `💰 Precio: $${medicamento.precio.toFixed(2)}\n` +
              `${appState.usuario ? `🎯 Precio para usted: $${precioFinal.toFixed(2)}` : ''}`);
    }
}

// Buscar al presionar Enter
document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarMedicamentos();
    }
});

// Cargar todos los medicamentos al entrar a la página
document.addEventListener('DOMContentLoaded', function() {
    listarTodosMedicamentos();
    
    // Actualizar nombre de usuario si está logueado
    if (appState.usuario) {
        document.getElementById('user-name').textContent = appState.usuario.nombre;
    }
});