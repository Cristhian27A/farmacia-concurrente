package farmacia;

import farmacia.models.Medicamento;//  Modelos de datos (Medicamento, Usuario)
import farmacia.models.Usuario;
import java.io.*;
import java.net.Socket;
//Colecciones (Listas, Mapas) para manejar datos
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
Manejador que procesa las solicitudes de un cliente específico.
Cada cliente tiene su propio handler ejecutándose en un hilo independiente,
permitiendo múltiples conexiones simultáneas (concurrencia).
 */

public class ClientHandler implements Runnable {
    private Socket clientSocket;
    private DatabaseManager db;
    private BufferedReader reader;
    private PrintWriter writer;

    /**
     * Constructor - recibe el socket del cliente conectado
     */
    public ClientHandler(Socket socket) {
        this.clientSocket = socket;
        this.db = DatabaseManager.getInstance();//Obtiene instancia única de DatabaseManager
        
        try {
            // Configurar streams de entrada/salida
            this.reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            this.writer = new PrintWriter(clientSocket.getOutputStream(), true);
            
        } catch (IOException e) {
            System.err.println("❌ Error configurando ClientHandler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Método principal que se ejecuta cuando el hilo inicia
     * Aquí se procesan todas las solicitudes del cliente
     */
    @Override
    public void run() {
        String clientAddress = clientSocket.getInetAddress().getHostAddress();
        System.out.println("🎯 Nuevo cliente conectado: " + clientAddress + " - Hilo: " + Thread.currentThread().getName());
        
        try {
            String mensajeCliente;
            
            // Leer mensajes del cliente hasta que se desconecte
            while ((mensajeCliente = reader.readLine()) != null) {
                System.out.println("📨 Mensaje de " + clientAddress + ": " + mensajeCliente);
                procesarMensaje(mensajeCliente);
            }
            
        } catch (IOException e) {
            System.out.println("🔌 Cliente desconectado: " + clientAddress);
        } finally {
            cerrarConexion();
        }
    }

    /**
     * Procesa los mensajes recibidos del cliente y envía respuestas
     */
    private void procesarMensaje(String mensaje) {
        // Dividir el mensaje en comando y datos: "COMANDO|datos"
        String[] partes = mensaje.split("\\|", 2);
        String comando = partes[0];
        String datos = partes.length > 1 ? partes[1] : "";

        switch (comando) {
            case "LISTAR_MEDICAMENTOS":
                listarMedicamentos();
                break;
                
            case "BUSCAR_MEDICAMENTOS":
                buscarMedicamentos(datos);
                break;
                
            case "CONSULTAR_USUARIO":
                consultarUsuario(datos);
                break;
                
            case "CONSULTAR_STOCK":
                consultarStock(datos);
                break;
                
            case "ACTUALIZAR_STOCK":
                actualizarStock(datos);
                break;
                
            case "CALCULAR_PRECIO":
                calcularPrecioTotal(datos);
                break;
                
            case "PROCESAR_COMPRA":
                procesarCompra(datos);
                break;
                
            case "SALUDO":
                writer.println("HOLA|Servidor Farmacia Concurrente activo - Hilo: " + Thread.currentThread().getName());
                break;
                
            default:
                writer.println("ERROR|Comando no reconocido: " + comando);
                break;
        }
    }

    // ========== MÉTODOS PARA PROCESAR COMANDOS ESPECÍFICOS ==========

    private void listarMedicamentos() {
        List<Medicamento> medicamentos = db.obtenerTodosMedicamentos();
        
        if (medicamentos.isEmpty()) {
            writer.println("LISTA_MEDICAMENTOS|No hay medicamentos disponibles");
            return;
        }

        // Enviar cada medicamento en formato: "MEDICAMENTO|id|nombre|precio|stock|categoria"
        for (Medicamento med : medicamentos) {
            String mensaje = String.format("MEDICAMENTO|%d|%s|%.2f|%d|%s|%s|%s",
                med.getId(),
                med.getNombre(),
                med.getPrecio(),
                med.getStock(),
                med.getCategoria(),
                med.getImagen(),
                med.getDescripcion()
            );
            writer.println(mensaje);
        }
        
        writer.println("FIN_LISTA|" + medicamentos.size() + " medicamentos encontrados");
    }
//funcion buscarMedicamento
    private void buscarMedicamentos(String nombre) {//
        List<Medicamento> medicamentos = db.buscarMedicamentos(nombre);
        
        if (medicamentos.isEmpty()) {
            writer.println("BUSQUEDA_RESULTADOS|No se encontraron medicamentos para: " + nombre);
            return;
        }// Filtra medicamentos por nombre

        for (Medicamento med : medicamentos) {
            String mensaje = String.format("MEDICAMENTO|%d|%s|%.2f|%d|%s|%s|%s",
                med.getId(),
                med.getNombre(),
                med.getPrecio(),
                med.getStock(),
                med.getCategoria(),
                med.getImagen(),
                med.getDescripcion()
            );
            writer.println(mensaje);
        }
        
        writer.println("FIN_BUSQUEDA|" + medicamentos.size() + " resultados para: " + nombre);
    }

    private void consultarUsuario(String identificacion) {
        Usuario usuario = db.buscarUsuario(identificacion);
        //Busca usuario en la base de datos
        if (usuario != null) {
            String mensaje = String.format("USUARIO_ENCONTRADO|%d|%s|%s|%s",
                usuario.getId(),
                usuario.getNombre(),
                usuario.getTipo(),
                usuario.getIdentificacion()
            );
            writer.println(mensaje);
        } else {
            writer.println("USUARIO_NO_ENCONTRADO|No se encontró usuario con identificación: " + identificacion);
        }
    }

    private void consultarStock(String idMedicamento) {
        try {
            int id = Integer.parseInt(idMedicamento);
            List<Medicamento> medicamentos = db.obtenerTodosMedicamentos();
            
            for (Medicamento med : medicamentos) {
                if (med.getId() == id) {
                    writer.println("STOCK|" + id + "|" + med.getStock() + "|" + med.getNombre());
                    return;
                }
            }
            
            writer.println("STOCK_NO_ENCONTRADO|Medicamento con ID " + id + " no encontrado");
            
        } catch (NumberFormatException e) {
            writer.println("ERROR|ID de medicamento inválido: " + idMedicamento);
        }
    }

    private void actualizarStock(String datos) {
        try {
            String[] partes = datos.split("\\|");
            int idMedicamento = Integer.parseInt(partes[0]);
            int nuevaCantidad = Integer.parseInt(partes[1]);
            
            boolean exito = db.actualizarStock(idMedicamento, nuevaCantidad);
            
            if (exito) {
                writer.println("STOCK_ACTUALIZADO|" + idMedicamento + "|" + nuevaCantidad);
            } else {
                writer.println("ERROR_ACTUALIZACION|No se pudo actualizar el stock del medicamento " + idMedicamento);
            }
            
        } catch (Exception e) {
            writer.println("ERROR|Formato inválido para actualizar stock: " + datos);
        }
    }

    private void calcularPrecioTotal(String datos) {
        try {
            String[] partes = datos.split("\\|");
            String identificacion = partes[0];
            String[] idsMedicamentos = partes[1].split(",");
            
            Usuario usuario = db.buscarUsuario(identificacion);
            if (usuario == null) {
                writer.println("ERROR_CALCULO|Usuario no encontrado: " + identificacion);
                return;
            }
            
            double total = 0.0;
            List<Medicamento> todosMedicamentos = db.obtenerTodosMedicamentos();
            
            for (String idStr : idsMedicamentos) {
                int id = Integer.parseInt(idStr.trim());
                for (Medicamento med : todosMedicamentos) {
                    if (med.getId() == id) {
                        total += med.calcularPrecioFinal(usuario.esJubilado());
                        break;
                    }
                }
            }
            
            String tipoPago = usuario.esJubilado() ? "GRATIS (Jubilado)" : "PAGO";
            writer.println("PRECIO_TOTAL|" + String.format("%.2f", total) + "|" + tipoPago + "|" + usuario.getNombre());
            
        } catch (Exception e) {
            writer.println("ERROR|Error calculando precio: " + e.getMessage());
        }
    }

    // MÉTODO Procesar compra completa con validación de stock
    private void procesarCompra(String compraData) {
        try {
            // Formato: "ID_USUARIO|ID1:CANT1,ID2:CANT2,..."
            String[] partes = compraData.split("\\|");
            if (partes.length < 2) {
                writer.println("ERROR_COMPRA|Formato inválido");
                return;
            }
            
            String idUsuario = partes[0];
            String[] items = partes[1].split(",");
            
            // 1. Verificar usuario
            Usuario usuario = db.buscarUsuario(idUsuario);
            if (usuario == null) {
                writer.println("ERROR_COMPRA|Usuario no encontrado: " + idUsuario);
                return;
            }
            
            // 2. Preparar datos de la compra
            Map<Integer, Integer> itemsCompra = new HashMap<>();
            List<String> erroresStock = new ArrayList<>();
            double total = 0.0;
            
            // 3. Verificar stock para todos los items
            for (String item : items) {
                String[] itemData = item.split(":");
                if (itemData.length != 2) {
                    erroresStock.add("Formato inválido: " + item);
                    continue;
                }
                
                try {
                    int idMedicamento = Integer.parseInt(itemData[0]);
                    int cantidad = Integer.parseInt(itemData[1]);
                    
                    if (cantidad <= 0) {
                        erroresStock.add("Cantidad inválida para medicamento ID " + idMedicamento);
                        continue;
                    }
                    
                    // Verificar stock disponible
                    if (!db.verificarStockSuficiente(idMedicamento, cantidad)) {
                        Medicamento med = db.obtenerMedicamentoPorId(idMedicamento);
                        if (med != null) {
                            erroresStock.add(med.getNombre() + " - Stock: " + med.getStock() + ", Solicitado: " + cantidad);
                        } else {
                            erroresStock.add("Medicamento ID " + idMedicamento + " no existe");
                        }
                    } else {
                        itemsCompra.put(idMedicamento, cantidad);
                    }
                } catch (NumberFormatException e) {
                    erroresStock.add("Datos inválidos: " + item);
                }
            }
            
            // 4. Si hay errores de stock, cancelar
            if (!erroresStock.isEmpty()) {
                writer.println("ERROR_STOCK|" + String.join("; ", erroresStock));
                return;
            }
            
            // 5. Procesar la compra - actualizar stock
            List<String> itemsProcesados = new ArrayList<>();
            boolean compraExitosa = true;
            List<String> erroresActualizacion = new ArrayList<>();
            
            for (Map.Entry<Integer, Integer> entry : itemsCompra.entrySet()) {
                int idMedicamento = entry.getKey();
                int cantidad = entry.getValue();
                Medicamento med = db.obtenerMedicamentoPorId(idMedicamento);
                
                if (med == null) {
                    erroresActualizacion.add("Medicamento ID " + idMedicamento + " no encontrado");
                    compraExitosa = false;
                    continue;
                }
                
                // Actualizar stock (restar cantidad)
                boolean stockActualizado = db.actualizarStock(idMedicamento, -cantidad);
                
                if (stockActualizado) {
                    double subtotal = med.calcularPrecioFinal(usuario.esJubilado()) * cantidad;
                    total += subtotal;
                    itemsProcesados.add(med.getNombre() + " x" + cantidad + " = $" + String.format("%.2f", subtotal));
                    System.out.println("✅ Stock actualizado: " + med.getNombre() + " -" + cantidad + " unidades");
                } else {
                    compraExitosa = false;
                    erroresActualizacion.add("Error actualizando stock de " + med.getNombre());
                    break;
                }
            }
            
            // 6. Responder al cliente
            if (compraExitosa && !itemsProcesados.isEmpty()) {
                String tipoPago = usuario.esJubilado() ? "GRATIS (Jubilado)" : "PAGO";
                String respuesta = String.format("COMPRA_EXITOSA|%.2f|%s|%s|%s", 
                    total, tipoPago, usuario.getNombre(), String.join("; ", itemsProcesados));
                writer.println(respuesta);
                System.out.println("🎉 Compra exitosa para usuario: " + usuario.getNombre() + " - Total: $" + total);
            } else {
                String mensajeError = !erroresActualizacion.isEmpty() ? 
                    String.join("; ", erroresActualizacion) : "Error desconocido al procesar compra";
                writer.println("ERROR_COMPRA|" + mensajeError);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            writer.println("ERROR_COMPRA|Error procesando compra: " + e.getMessage());
        }
    }

    /**
     * Cierra la conexión con el cliente
     */
    private void cerrarConexion() {
        try {
            if (reader != null) reader.close();
            if (writer != null) writer.close();
            if (clientSocket != null) clientSocket.close();
            
            System.out.println("✅ Conexión con cliente cerrada - Hilo: " + Thread.currentThread().getName());
            
        } catch (IOException e) {
            System.err.println("❌ Error cerrando conexión: " + e.getMessage());
        }
    }
}
//cada cliente es un nueo usuario, la base de datos es compartida pero thread-safe
// esto nos proporciona múltiples clientes simultáneos y estabilidad