package farmacia;

import farmacia.models.Medicamento;
import farmacia.models.Usuario;
import java.io.*;
import java.net.Socket;
import java.util.List;

/**
 * Maneja la comunicación con un cliente específico
 * Cada cliente conectado tiene su propio ClientHandler en un hilo separado
 * Esto permite multiple clientes simultáneamente (CONCURRENCIA)
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
        this.db = DatabaseManager.getInstance();
        
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

    private void buscarMedicamentos(String nombre) {
        List<Medicamento> medicamentos = db.buscarMedicamentos(nombre);
        
        if (medicamentos.isEmpty()) {
            writer.println("BUSQUEDA_RESULTADOS|No se encontraron medicamentos para: " + nombre);
            return;
        }

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

    /**
     * Cierra la conexión con el cliente
     */
    private void cerrarConexion() {
        try {
            if (reader != null) reader.close();
            if (writer != null) writer.close();
            if (clientSocket != null) clientSocket.close();
            
            System.out.println("�� Conexión con cliente cerrada - Hilo: " + Thread.currentThread().getName());
            
        } catch (IOException e) {
            System.err.println("❌ Error cerrando conexión: " + e.getMessage());
        }
    }
}
