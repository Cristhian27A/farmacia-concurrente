// Estado global de la aplicación
const appState = {
    usuario: null,
    carrito: [],
};

// DATOS DE PRUEBA ESTÁTICOS
const medicamentosPrueba = [
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
    },
    {
        id: 6,
        nombre: "Aspirina 500mg",
        precio: 0.45,
        stock: 85,
        categoria: "Analgésico",
        imagen: "aspirina.jpg",
        descripcion: "Alivia dolor y reduce inflamación"
    },
    {
        id: 7,
        nombre: "Naproxeno 250mg",
        precio: 0.95,
        stock: 70,
        categoria: "Analgésico",
        imagen: "naproxeno.jpg",
        descripcion: "Para dolor e inflamación"
    },
    {
        id: 8,
        nombre: "Tramadol 50mg",
        precio: 1.25,
        stock: 45,
        categoria: "Analgésico",
        imagen: "tramadol.jpg",
        descripcion: "Alivia dolor moderado a severo"
    },
    {
        id: 9,
        nombre: "Diclofenaco 50mg",
        precio: 0.8,
        stock: 90,
        categoria: "Analgésico",
        imagen: "diclofenaco.jpg",
        descripcion: "Reduce dolor e inflamación"
    },
    {
        id: 10,
        nombre: "Codeína 30mg",
        precio: 1.5,
        stock: 35,
        categoria: "Analgésico",
        imagen: "codeina.jpg",
        descripcion: "Para el alivio del dolor"
    },
    {
        id: 11,
        nombre: "Metamizol 500mg",
        precio: 0.6,
        stock: 95,
        categoria: "Analgésico",
        imagen: "metamizol.jpg",
        descripcion: "Dolor intenso y fiebre"
    },
    {
        id: 12,
        nombre: "Ketorolaco 10mg",
        precio: 1.1,
        stock: 60,
        categoria: "Analgésico",
        imagen: "ketorolaco.jpg",
        descripcion: "Dolor postoperatorio agudo"
    },
    {
        id: 13,
        nombre: "Celecoxib 200mg",
        precio: 1.75,
        stock: 50,
        categoria: "Analgésico",
        imagen: "celecoxib.jpg",
        descripcion: "Artritis, dolor menstrual"
    },
    {
        id: 14,
        nombre: "Pregabalina 75mg",
        precio: 2.25,
        stock: 40,
        categoria: "Analgésico",
        imagen: "pregabalina.jpg",
        descripcion: "Dolor neuropático (nervios)"
    },
    {
        id: 15,
        nombre: "Penicilina 400mg",
        precio: 1.35,
        stock: 55,
        categoria: "Antibiótico",
        imagen: "penicilina.jpg",
        descripcion: "Infecciones generales"
    },
    {
        id: 16,
        nombre: "Cefalexina 500mg",
        precio: 1.45,
        stock: 65,
        categoria: "Antibiótico",
        imagen: "cefalexina.jpg",
        descripcion: "Infecciones respiratorias/piel"
    },
    {
        id: 17,
        nombre: "Azitromicina 250mg",
        precio: 1.65,
        stock: 45,
        categoria: "Antibiótico",
        imagen: "azitromicina.jpg",
        descripcion: "Infecciones respiratorias/ETS"
    },
    {
        id: 18,
        nombre: "Ciprofloxacino 500mg",
        precio: 1.55,
        stock: 60,
        categoria: "Antibiótico",
        imagen: "ciprofloxacino.jpg",
        descripcion: "Infecciones urinarias/intestinales"
    },
    {
        id: 19,
        nombre: "Doxiciclina 100mg",
        precio: 1.3,
        stock: 70,
        categoria: "Antibiótico",
        imagen: "doxiciclina.jpg",
        descripcion: "Acné, malaria, infecciones"
    },
    {
        id: 20,
        nombre: "Eritromicina 250mg",
        precio: 1.25,
        stock: 50,
        categoria: "Antibiótico",
        imagen: "eritromicina.jpg",
        descripcion: "Infecciones cutáneas/respiratorias"
    },
    {
        id: 21,
        nombre: "Levofloxacino 500mg",
        precio: 1.8,
        stock: 40,
        categoria: "Antibiótico",
        imagen: "levofloxacino.jpg",
        descripcion: "Neumonía, infecciones urinarias"
    },
    {
        id: 22,
        nombre: "Clindamicina 300mg",
        precio: 1.7,
        stock: 35,
        categoria: "Antibiótico",
        imagen: "clindamicina.jpg",
        descripcion: "Infecciones dentales/óseas"
    },
    {
        id: 23,
        nombre: "Vancomicina 500mg",
        precio: 2.5,
        stock: 25,
        categoria: "Antibiótico",
        imagen: "vancomicina.jpg",
        descripcion: "Infecciones graves/resistentes"
    },
    {
        id: 24,
        nombre: "Dexketoprofeno 25mg",
        precio: 1.05,
        stock: 75,
        categoria: "Antiinflamatorio",
        imagen: "dexketoprofeno.jpg",
        descripcion: "Dolor agudo e inflamación"
    },
    {
        id: 25,
        nombre: "Meloxicam 15mg",
        precio: 0.95,
        stock: 80,
        categoria: "Antiinflamatorio",
        imagen: "meloxicam.jpg",
        descripcion: "Artritis, osteoartritis"
    },
    {
        id: 26,
        nombre: "Piroxicam 20mg",
        precio: 0.85,
        stock: 70,
        categoria: "Antiinflamatorio",
        imagen: "piroxicam.jpg",
        descripcion: "Artritis, dolor muscular"
    },
    {
        id: 27,
        nombre: "Nimesulida 100mg",
        precio: 1.15,
        stock: 65,
        categoria: "Antiinflamatorio",
        imagen: "nimesulida.jpg",
        descripcion: "Dolor e inflamación aguda"
    },
    {
        id: 28,
        nombre: "Tenoxicam 20mg",
        precio: 1.2,
        stock: 55,
        categoria: "Antiinflamatorio",
        imagen: "tenoxicam.jpg",
        descripcion: "Artritis reumatoide"
    },
    {
        id: 29,
        nombre: "Etoricoxib 90mg",
        precio: 1.65,
        stock: 45,
        categoria: "Antiinflamatorio",
        imagen: "etoricoxib.jpg",
        descripcion: "Artritis, dolor agudo"
    },
    {
        id: 30,
        nombre: "Indometacina 25mg",
        precio: 0.75,
        stock: 85,
        categoria: "Antiinflamatorio",
        imagen: "indometacina.jpg",
        descripcion: "Gota, artritis"
    },
    {
        id: 31,
        nombre: "Sulindac 200mg",
        precio: 1.35,
        stock: 60,
        categoria: "Antiinflamatorio",
        imagen: "sulindac.jpg",
        descripcion: "Artritis, dolor"
    },
    {
        id: 32,
        nombre: "Nabumetona 500mg",
        precio: 1.45,
        stock: 50,
        categoria: "Antiinflamatorio",
        imagen: "nabumetona.jpg",
        descripcion: "Osteoartritis, dolor"
    },
    {
        id: 33,
        nombre: "Cetirizina 10mg",
        precio: 0.85,
        stock: 95,
        categoria: "Antialérgico",
        imagen: "cetirizina.jpg",
        descripcion: "Alergias estacionales"
    },
    {
        id: 34,
        nombre: "Fexofenadina 120mg",
        precio: 1.25,
        stock: 70,
        categoria: "Antialérgico",
        imagen: "fexofenadina.jpg",
        descripcion: "Rinitis alérgica"
    },
    {
        id: 35,
        nombre: "Desloratadina 5mg",
        precio: 1.15,
        stock: 65,
        categoria: "Antialérgico",
        imagen: "desloratadina.jpg",
        descripcion: "Rinitis alérgica crónica"
    },
    {
        id: 36,
        nombre: "Levocetirizina 5mg",
        precio: 1.05,
        stock: 75,
        categoria: "Antialérgico",
        imagen: "levocetirizina.jpg",
        descripcion: "Urticaria, alergias"
    },
    {
        id: 37,
        nombre: "Ebastina 10mg",
        precio: 0.95,
        stock: 80,
        categoria: "Antialérgico",
        imagen: "ebastina.jpg",
        descripcion: "Rinitis alérgica"
    },
    {
        id: 38,
        nombre: "Rupatadina 10mg",
        precio: 1.35,
        stock: 55,
        categoria: "Antialérgico",
        imagen: "rupatadina.jpg",
        descripcion: "Rinitis y urticaria"
    },
    {
        id: 39,
        nombre: "Bilastina 20mg",
        precio: 1.45,
        stock: 50,
        categoria: "Antialérgico",
        imagen: "bilastina.jpg",
        descripcion: "Rinitis alérgica"
    },
    {
        id: 40,
        nombre: "Azelastina 0.5mg",
        precio: 1.65,
        stock: 40,
        categoria: "Antialérgico",
        imagen: "azelastina.jpg",
        descripcion: "Rinitis alérgica (spray nasal)"
    },
    {
        id: 41,
        nombre: "Olopatadina 0.1%",
        precio: 1.75,
        stock: 35,
        categoria: "Antialérgico",
        imagen: "olopatadina.jpg",
        descripcion: "Conjuntivitis alérgica (gotas)"
    },
    {
        id: 42,
        nombre: "Lansoprazol 30mg",
        precio: 1.2,
        stock: 80,
        categoria: "Digestivo",
        imagen: "lansoprazol.jpg",
        descripcion: "Acidez, úlceras"
    },
    {
        id: 43,
        nombre: "Pantoprazol 40mg",
        precio: 1.3,
        stock: 75,
        categoria: "Digestivo",
        imagen: "pantoprazol.jpg",
        descripcion: "Acidez, esofagitis"
    },
    {
        id: 44,
        nombre: "Ranitidina 150mg",
        precio: 0.65,
        stock: 90,
        categoria: "Digestivo",
        imagen: "ranitidina.jpg",
        descripcion: "Úlceras gástricas"
    },
    {
        id: 45,
        nombre: "Domperidona 10mg",
        precio: 0.75,
        stock: 85,
        categoria: "Digestivo",
        imagen: "domperidona.jpg",
        descripcion: "Náuseas, vómitos"
    },
    {
        id: 46,
        nombre: "Metoclopramida 10mg",
        precio: 0.55,
        stock: 95,
        categoria: "Digestivo",
        imagen: "metoclopramida.jpg",
        descripcion: "Náuseas, reflujo"
    },
    {
        id: 47,
        nombre: "Simeticona 125mg",
        precio: 0.45,
        stock: 100,
        categoria: "Digestivo",
        imagen: "simeticona.jpg",
        descripcion: "Gases, flatulencia"
    },
    {
        id: 48,
        nombre: "Sales de Frutas",
        precio: 0.35,
        stock: 120,
        categoria: "Digestivo",
        imagen: "sales_frutas.jpg",
        descripcion: "Acidez estomacal"
    },
    {
        id: 49,
        nombre: "Almagato 500mg",
        precio: 0.85,
        stock: 70,
        categoria: "Digestivo",
        imagen: "almagato.jpg",
        descripcion: "Acidez, protección gástrica"
    },
    {
        id: 50,
        nombre: "Sucralfato 1g",
        precio: 1.15,
        stock: 60,
        categoria: "Digestivo",
        imagen: "sucralfato.jpg",
        descripcion: "Úlceras, protección mucosa"
    }
];

// Función para enviar mensajes al servidor
function enviarMensaje(mensaje, callback) {
    console.log('Intentando enviar mensaje:', mensaje);
    
    // Si no hay servidor, usar modo simulado
    if (!window.socket || window.socket.readyState !== WebSocket.OPEN) {
        console.log('Modo local - Simulando respuesta del servidor');
        console.log('Mensaje recibido:', mensaje);
        
        setTimeout(() => {
            // SOLO llamar callback si es una función
            if (typeof callback === 'function') {
                const [comando, ...parametros] = mensaje.split('|');
                
                switch (comando) {
                    case 'LISTAR_MEDICAMENTOS':
                        // Simular medicamentos de ejemplo (más de los 5 iniciales)
                        callback('MEDICAMENTO|1|Paracetamol 500mg|0.50|100|Analgésico|paracetamol.jpg|Alivio del dolor y fiebre');
                        callback('MEDICAMENTO|2|Amoxicilina 250mg|1.20|50|Antibiótico|amoxicilina.jpg|Para infecciones bacterianas');
                        callback('MEDICAMENTO|3|Ibuprofeno 400mg|0.75|80|Antiinflamatorio|ibuprofeno.jpg|Alivia dolor e inflamación');
                        callback('MEDICAMENTO|4|Loratadina 10mg|0.90|60|Antialérgico|loratadina.jpg|Para alergias estacionales');
                        callback('MEDICAMENTO|5|Omeprazol 20mg|1.10|75|Digestivo|omeprazol.jpg|Protector gástrico');
                        callback('MEDICAMENTO|6|Aspirina 500mg|0.45|85|Analgésico|aspirina.jpg|Alivia dolor y reduce inflamación');
                        callback('MEDICAMENTO|7|Naproxeno 250mg|0.95|70|Analgésico|naproxeno.jpg|Para dolor e inflamación');
                        callback('MEDICAMENTO|8|Tramadol 50mg|1.25|45|Analgésico|tramadol.jpg|Alivia dolor moderado a severo');
                        callback('MEDICAMENTO|9|Diclofenaco 50mg|0.80|90|Analgésico|diclofenaco.jpg|Reduce dolor e inflamación');
                        callback('MEDICAMENTO|10|Codeína 30mg|1.50|35|Analgésico|codeina.jpg|Para el alivio del dolor');
                        callback('FIN_LISTA|10 medicamentos encontrados');
                        break;
                        
                    case 'BUSCAR_MEDICAMENTOS':
                        const busqueda = parametros[0] || '';
                        if (busqueda.toLowerCase().includes('para')) {
                            callback('MEDICAMENTO|1|Paracetamol 500mg|0.50|100|Analgésico|paracetamol.jpg|Alivio del dolor y fiebre');
                            callback('FIN_BUSQUEDA|1 resultado para: ' + busqueda);
                        } else if (busqueda.toLowerCase().includes('amo')) {
                            callback('MEDICAMENTO|2|Amoxicilina 250mg|1.20|50|Antibiótico|amoxicilina.jpg|Para infecciones bacterianas');
                            callback('FIN_BUSQUEDA|1 resultado para: ' + busqueda);
                        } else {
                            callback('FIN_BUSQUEDA|0 resultados para: ' + busqueda);
                        }
                        break;
                        
                    case 'CONSULTAR_USUARIO':
                        const identificacion = parametros[0] || '';
                        
                        // Base de datos simulada de usuarios
                        const usuariosSimulados = {
                            '2-753-1690': {
                                id: 1,
                                nombre: 'Cristhian Alonso',
                                tipo: 'regular',
                                identificacion: '2-753-1690'
                            },
                            '2-753-919': {
                                id: 2,
                                nombre: 'Jesús Moreno',
                                tipo: 'regular',
                                identificacion: '2-753-919'
                            },
                            '2-752-163': {
                                id: 3,
                                nombre: 'Nidia Rojas',
                                tipo: 'jubilado', 
                                identificacion: '2-752-163'
                            }
                        };
                        
                        const usuario = usuariosSimulados[identificacion];
                        if (usuario) {
                            callback(`USUARIO_ENCONTRADO|${usuario.id}|${usuario.nombre}|${usuario.tipo}|${usuario.identificacion}`);
                        } else {
                            callback('USUARIO_NO_ENCONTRADO|No se encontró usuario con identificación: ' + identificacion);
                        }
                        break;
                        
                    case 'CALCULAR_PRECIO':
                        const idUsuarioCalculo = parametros[0] || '';
                        const idsMedicamentos = (parametros[1] || '').split(',');
                        
                        // Simular cálculo de precio con los 50 medicamentos
                        const medicamentosSimulados = {
                            1: { nombre: 'Paracetamol 500mg', precio: 0.50 },
                            2: { nombre: 'Amoxicilina 250mg', precio: 1.20 },
                            3: { nombre: 'Ibuprofeno 400mg', precio: 0.75 },
                            4: { nombre: 'Loratadina 10mg', precio: 0.90 },
                            5: { nombre: 'Omeprazol 20mg', precio: 1.10 },
                            6: { nombre: 'Aspirina 500mg', precio: 0.45 },
                            7: { nombre: 'Naproxeno 250mg', precio: 0.95 },
                            8: { nombre: 'Tramadol 50mg', precio: 1.25 },
                            9: { nombre: 'Diclofenaco 50mg', precio: 0.80 },
                            10: { nombre: 'Codeína 30mg', precio: 1.50 },
                            11: { nombre: 'Metamizol 500mg', precio: 0.60 },
                            12: { nombre: 'Ketorolaco 10mg', precio: 1.10 },
                            13: { nombre: 'Celecoxib 200mg', precio: 1.75 },
                            14: { nombre: 'Pregabalina 75mg', precio: 2.25 },
                            15: { nombre: 'Penicilina 400mg', precio: 1.35 },
                            16: { nombre: 'Cefalexina 500mg', precio: 1.45 },
                            17: { nombre: 'Azitromicina 250mg', precio: 1.65 },
                            18: { nombre: 'Ciprofloxacino 500mg', precio: 1.55 },
                            19: { nombre: 'Doxiciclina 100mg', precio: 1.30 },
                            20: { nombre: 'Eritromicina 250mg', precio: 1.25 },
                            21: { nombre: 'Levofloxacino 500mg', precio: 1.80 },
                            22: { nombre: 'Clindamicina 300mg', precio: 1.70 },
                            23: { nombre: 'Vancomicina 500mg', precio: 2.50 },
                            24: { nombre: 'Dexketoprofeno 25mg', precio: 1.05 },
                            25: { nombre: 'Meloxicam 15mg', precio: 0.95 },
                            26: { nombre: 'Piroxicam 20mg', precio: 0.85 },
                            27: { nombre: 'Nimesulida 100mg', precio: 1.15 },
                            28: { nombre: 'Tenoxicam 20mg', precio: 1.20 },
                            29: { nombre: 'Etoricoxib 90mg', precio: 1.65 },
                            30: { nombre: 'Indometacina 25mg', precio: 0.75 },
                            31: { nombre: 'Sulindac 200mg', precio: 1.35 },
                            32: { nombre: 'Nabumetona 500mg', precio: 1.45 },
                            33: { nombre: 'Cetirizina 10mg', precio: 0.85 },
                            34: { nombre: 'Fexofenadina 120mg', precio: 1.25 },
                            35: { nombre: 'Desloratadina 5mg', precio: 1.15 },
                            36: { nombre: 'Levocetirizina 5mg', precio: 1.05 },
                            37: { nombre: 'Ebastina 10mg', precio: 0.95 },
                            38: { nombre: 'Rupatadina 10mg', precio: 1.35 },
                            39: { nombre: 'Bilastina 20mg', precio: 1.45 },
                            40: { nombre: 'Azelastina 0.5mg', precio: 1.65 },
                            41: { nombre: 'Olopatadina 0.1%', precio: 1.75 },
                            42: { nombre: 'Lansoprazol 30mg', precio: 1.20 },
                            43: { nombre: 'Pantoprazol 40mg', precio: 1.30 },
                            44: { nombre: 'Ranitidina 150mg', precio: 0.65 },
                            45: { nombre: 'Domperidona 10mg', precio: 0.75 },
                            46: { nombre: 'Metoclopramida 10mg', precio: 0.55 },
                            47: { nombre: 'Simeticona 125mg', precio: 0.45 },
                            48: { nombre: 'Sales de Frutas', precio: 0.35 },
                            49: { nombre: 'Almagato 500mg', precio: 0.85 },
                            50: { nombre: 'Sucralfato 1g', precio: 1.15 }
                        };
                        
                        // Determinar si es jubilado (Nidia Rojas es jubilada)
                        const esJubilado = ['2-732-1293'].includes(idUsuarioCalculo);
                        let total = 0;
                        
                        idsMedicamentos.forEach(id => {
                            const med = medicamentosSimulados[parseInt(id)];
                            if (med) {
                                total += esJubilado ? 0 : med.precio;
                            }
                        });
                        
                        const tipoPago = esJubilado ? 'GRATIS (Jubilado)' : 'PAGO';
                        const nombreUsuario = idUsuarioCalculo === '2-753-1690' ? 'Cristhian Alonso' : 
                                              idUsuarioCalculo === '2-753-919' ? 'Jesús Moreno' :
                                              idUsuarioCalculo === '2-752-163' ? 'Nidia Rojas' : 'Usuario';
                        
                        callback(`PRECIO_TOTAL|${total.toFixed(2)}|${tipoPago}|${nombreUsuario}`);
                        break;
                        
                    case 'PROCESAR_COMPRA':
                        const [idUsuarioCompra, itemsStr] = parametros;
                        const items = itemsStr.split(',').map(item => {
                            const [id, cantidad] = item.split(':');
                            return { id: parseInt(id), cantidad: parseInt(cantidad) };
                        });
                        
                        // Verificar usuarios simulados (ACTUALIZADO)
                        const usuariosCompra = {
                            '2-753-1690': { nombre: 'Cristhian Alonso', tipo: 'regular' },
                            '2-753-919': { nombre: 'Jesús Moreno', tipo: 'regular' },
                            '2-752-163': { nombre: 'Nidia Rojas', tipo: 'jubilado' }
                        };
                        
                        const usuarioCompra = usuariosCompra[idUsuarioCompra];
                        
                        if (!usuarioCompra) {
                            callback('ERROR_COMPRA|Usuario no encontrado: ' + idUsuarioCompra);
                            break;
                        }
                        
                        // Medicamentos simulados para cálculo con los 50 medicamentos
                        const medicamentosCompra = {
                            1: { nombre: 'Paracetamol 500mg', precio: 0.50 },
                            2: { nombre: 'Amoxicilina 250mg', precio: 1.20 },
                            3: { nombre: 'Ibuprofeno 400mg', precio: 0.75 },
                            4: { nombre: 'Loratadina 10mg', precio: 0.90 },
                            5: { nombre: 'Omeprazol 20mg', precio: 1.10 },
                            6: { nombre: 'Aspirina 500mg', precio: 0.45 },
                            7: { nombre: 'Naproxeno 250mg', precio: 0.95 },
                            8: { nombre: 'Tramadol 50mg', precio: 1.25 },
                            9: { nombre: 'Diclofenaco 50mg', precio: 0.80 },
                            10: { nombre: 'Codeína 30mg', precio: 1.50 },
                            11: { nombre: 'Metamizol 500mg', precio: 0.60 },
                            12: { nombre: 'Ketorolaco 10mg', precio: 1.10 },
                            13: { nombre: 'Celecoxib 200mg', precio: 1.75 },
                            14: { nombre: 'Pregabalina 75mg', precio: 2.25 },
                            15: { nombre: 'Penicilina 400mg', precio: 1.35 },
                            16: { nombre: 'Cefalexina 500mg', precio: 1.45 },
                            17: { nombre: 'Azitromicina 250mg', precio: 1.65 },
                            18: { nombre: 'Ciprofloxacino 500mg', precio: 1.55 },
                            19: { nombre: 'Doxiciclina 100mg', precio: 1.30 },
                            20: { nombre: 'Eritromicina 250mg', precio: 1.25 },
                            21: { nombre: 'Levofloxacino 500mg', precio: 1.80 },
                            22: { nombre: 'Clindamicina 300mg', precio: 1.70 },
                            23: { nombre: 'Vancomicina 500mg', precio: 2.50 },
                            24: { nombre: 'Dexketoprofeno 25mg', precio: 1.05 },
                            25: { nombre: 'Meloxicam 15mg', precio: 0.95 },
                            26: { nombre: 'Piroxicam 20mg', precio: 0.85 },
                            27: { nombre: 'Nimesulida 100mg', precio: 1.15 },
                            28: { nombre: 'Tenoxicam 20mg', precio: 1.20 },
                            29: { nombre: 'Etoricoxib 90mg', precio: 1.65 },
                            30: { nombre: 'Indometacina 25mg', precio: 0.75 },
                            31: { nombre: 'Sulindac 200mg', precio: 1.35 },
                            32: { nombre: 'Nabumetona 500mg', precio: 1.45 },
                            33: { nombre: 'Cetirizina 10mg', precio: 0.85 },
                            34: { nombre: 'Fexofenadina 120mg', precio: 1.25 },
                            35: { nombre: 'Desloratadina 5mg', precio: 1.15 },
                            36: { nombre: 'Levocetirizina 5mg', precio: 1.05 },
                            37: { nombre: 'Ebastina 10mg', precio: 0.95 },
                            38: { nombre: 'Rupatadina 10mg', precio: 1.35 },
                            39: { nombre: 'Bilastina 20mg', precio: 1.45 },
                            40: { nombre: 'Azelastina 0.5mg', precio: 1.65 },
                            41: { nombre: 'Olopatadina 0.1%', precio: 1.75 },
                            42: { nombre: 'Lansoprazol 30mg', precio: 1.20 },
                            43: { nombre: 'Pantoprazol 40mg', precio: 1.30 },
                            44: { nombre: 'Ranitidina 150mg', precio: 0.65 },
                            45: { nombre: 'Domperidona 10mg', precio: 0.75 },
                            46: { nombre: 'Metoclopramida 10mg', precio: 0.55 },
                            47: { nombre: 'Simeticona 125mg', precio: 0.45 },
                            48: { nombre: 'Sales de Frutas', precio: 0.35 },
                            49: { nombre: 'Almagato 500mg', precio: 0.85 },
                            50: { nombre: 'Sucralfato 1g', precio: 1.15 }
                        };
                        
                        const esJubiladoCompra = usuarioCompra.tipo === 'jubilado';
                        let totalCompra = 0;
                        const detallesItems = [];
                        
                        items.forEach(item => {
                            const med = medicamentosCompra[item.id];
                            if (med) {
                                const subtotal = esJubiladoCompra ? 0 : (med.precio * item.cantidad);
                                totalCompra += subtotal;
                                detallesItems.push(`${med.nombre} x${item.cantidad} = $${subtotal.toFixed(2)}`);
                            }
                        });
                        
                        const tipoPagoCompra = esJubiladoCompra ? 'GRATIS (Jubilado)' : 'PAGO';
                        callback(`COMPRA_EXITOSA|${totalCompra.toFixed(2)}|${tipoPagoCompra}|${usuarioCompra.nombre}|${detallesItems.join('; ')}`);
                        break;
                        
                    case 'SALUDO':
                        callback('HOLA|Servidor Farmacia Concurrente - Modo Local');
                        break;
                        
                    default:
                        callback('OK|Modo local activado - Comando reconocido: ' + comando);
                }
            }
        }, 300);
        return;
    }
    
    // Código real para WebSocket (si lo implementas después)
    try {
        window.socket.send(mensaje);
        if (callback) {
            // Guardar callback para cuando llegue la respuesta
            window.pendingCallbacks = window.pendingCallbacks || {};
            window.pendingCallbacks[mensaje] = callback;
        }
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        if (callback) callback('ERROR|No se pudo conectar al servidor');
    }
}

// CONSULTAR USUARIO LOCALMENTE
function consultarUsuarioLocal(identificacion) {
    console.log('🔍 Consultando usuario localmente:', identificacion);
    
    // Usar directamente el modo simulado para todas las identificaciones
    enviarMensaje(`CONSULTAR_USUARIO|${identificacion}`, function(respuesta) {
        const [tipoRespuesta, ...datos] = respuesta.split('|');
        if (tipoRespuesta === 'USUARIO_ENCONTRADO') {
            manejarUsuarioEncontrado(datos);
        } else {
            manejarUsuarioNoEncontrado(datos.join('|'));
        }
    });
}

// BUSCAR MEDICAMENTOS LOCALMENTE
function buscarMedicamentosLocal(query) {
    console.log('🔍 Buscando medicamentos localmente:', query);
    
    const resultados = medicamentosPrueba.filter(med => 
        med.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (med.descripcion && med.descripcion.toLowerCase().includes(query.toLowerCase())) ||
        (med.categoria && med.categoria.toLowerCase().includes(query.toLowerCase()))
    );
    
    if (typeof mostrarMedicamentos === 'function') {
        mostrarMedicamentos(resultados);
    }
    
    // Actualizar info de resultados
    const resultsInfo = document.getElementById('resultsInfo');
    if (resultsInfo) {
        resultsInfo.textContent = `Encontrados ${resultados.length} medicamentos para "${query}"`;
    }
}

// Función para cargar datos locales en farmacia.html
function cargarDatosLocales() {
    if (window.location.pathname.includes('farmacia.html')) {
        console.log('📦 Cargando datos locales...');
        
        // Simular el comportamiento de la farmacia
        if (typeof mostrarMedicamentos === 'function') {
            setTimeout(() => {
                mostrarMedicamentos(medicamentosPrueba);
            }, 100);
        }
        
        // Actualizar info de resultados
        const resultsInfo = document.getElementById('resultsInfo');
        if (resultsInfo) {
            setTimeout(() => {
                resultsInfo.textContent = `Mostrando ${medicamentosPrueba.length} medicamentos disponibles`;
            }, 200);
        }
        
        // Ocultar loading
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            setTimeout(() => {
                loadingMessage.style.display = 'none';
            }, 300);
        }
        
        console.log('✅ Datos locales cargados correctamente');
    }
}

// Funciones de la interfaz
function mostrarLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'block';
}

function cerrarLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
    
    const resultDiv = document.getElementById('loginResult');
    if (resultDiv) {
        resultDiv.innerHTML = '';
        resultDiv.className = 'result-message';
    }
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
    
    consultarUsuarioLocal(identificacion);
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
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="user-info">
                <h4>✅ Usuario Identificado</h4>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Tipo:</strong> ${tipo === 'jubilado' ? '🎖️ Jubilado (Medicamentos Gratis)' : '👤 Regular'}</p>
                <p><strong>ID:</strong> ${identificacion}</p>
            </div>
        `;
        resultDiv.className = 'result-message result-success';
    }
    
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
    if (resultDiv) {
        resultDiv.innerHTML = `❌ ${mensaje}`;
        resultDiv.className = 'result-message result-error';
    }
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
    console.log('🚀 Inicializando Farmacia Concurrente - Modo Local');
    
    // Cargar datos locales inmediatamente para farmacia.html
    if (window.location.pathname.includes('farmacia.html')) {
        console.log('🏥 Página de farmacia detectada - Cargando datos locales');
        setTimeout(cargarDatosLocales, 500);
    }
    
    // Cargar carrito desde localStorage
    const carritoGuardado = localStorage.getItem('carritoFarmacia');
    if (carritoGuardado) {
        try {
            appState.carrito = JSON.parse(carritoGuardado);
        } catch (e) {
            console.error('Error cargando carrito:', e);
            appState.carrito = [];
        }
    }
    
    // Actualizar contador del carrito
    if (typeof actualizarContadorCarrito === 'function') {
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
    try {
        localStorage.setItem('carritoFarmacia', JSON.stringify(appState.carrito));
    } catch (e) {
        console.error('Error guardando carrito:', e);
    }
}

function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = (appState.carrito || []).reduce((total, item) => total + (item.cantidad || 1), 0);
        cartCount.textContent = totalItems;
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

// Función auxiliar para probar imágenes individualmente
function probarImagen(nombreImagen) {
    const img = new Image();
    img.onload = function() {
        console.log(`✅ Imagen ${nombreImagen} se carga correctamente`);
    };
    img.onerror = function() {
        console.log(`❌ Error cargando imagen ${nombreImagen}`);
    };
    img.src = `images/${nombreImagen}`;
}

// Función para manejar búsquedas en farmacia.html
if (window.location.pathname.includes('farmacia.html')) {
    // Sobrescribir la función de búsqueda global si existe
    window.buscarMedicamentos = function(query) {
        if (!query.trim()) {
            cargarDatosLocales();
            return;
        }
        buscarMedicamentosLocal(query);
    };
    
    // Manejar el formulario de búsqueda
    document.addEventListener('DOMContentLoaded', function() {
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                buscarMedicamentosLocal(query);
            });
        }
    });
}