package farmacia;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

/**
 * Cliente de prueba para demostrar la concurrencia del servidor
 * Se pueden ejecutar múltiples instancias de esta clase para simular varios clientes
 */
public class ClientePrueba {
    private Socket socket;
    private BufferedReader reader;
    private PrintWriter writer;
    private String nombreCliente;

    public ClientePrueba(String nombre) {
        this.nombreCliente = nombre;
    }

    public void conectar() {
        try {
            // Conectar al servidor local
            socket = new Socket("localhost", 12345);
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            writer = new PrintWriter(socket.getOutputStream(), true);
            
            System.out.println("🔗 [" + nombreCliente + "] Conectado al servidor");
            
            // Escuchar mensajes del servidor en un hilo separado
            Thread listenerThread = new Thread(this::escucharServidor);
            listenerThread.start();
            
            // Enviar comandos de prueba
            enviarComandosPrueba();
            
        } catch (IOException e) {
            System.err.println("❌ [" + nombreCliente + "] Error conectando: " + e.getMessage());
        }
    }

    private void escucharServidor() {
        try {
            String mensaje;
            while ((mensaje = reader.readLine()) != null) {
                System.out.println("📨 [" + nombreCliente + "] Servidor: " + mensaje);
            }
        } catch (IOException e) {
            System.out.println("🔌 [" + nombreCliente + "] Desconectado del servidor");
        }
    }

    private void enviarComandosPrueba() {
        try {
            // Pequeña pausa para sincronización
            Thread.sleep(1000);
            
            // Secuencia de comandos de prueba
            writer.println("SALUDO|");
            Thread.sleep(500);
            
            writer.println("LISTAR_MEDICAMENTOS|");
            Thread.sleep(1000);
            
            writer.println("BUSCAR_MEDICAMENTOS|para");
            Thread.sleep(800);
            
            writer.println("CONSULTAR_USUARIO|8-123-456");
            Thread.sleep(600);
            
            writer.println("CALCULAR_PRECIO|8-123-456|1,2,3");
            
            // Mantener conexión abierta por un tiempo
            Thread.sleep(3000);
            
            System.out.println("✅ [" + nombreCliente + "] Prueba completada");
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            desconectar();
        }
    }

    private void desconectar() {
        try {
            if (reader != null) reader.close();
            if (writer != null) writer.close();
            if (socket != null) socket.close();
        } catch (IOException e) {
            System.err.println("❌ Error desconectando: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Crear múltiples clientes para probar concurrencia
        if (args.length > 0 && args[0].equals("multiple")) {
            System.out.println("🧪 INICIANDO PRUEBA DE CONCURRENCIA CON 3 CLIENTES");
            
            for (int i = 1; i <= 3; i++) {
                String nombreCliente = "Cliente-" + i;
                new Thread(() -> {
                    ClientePrueba cliente = new ClientePrueba(nombreCliente);
                    cliente.conectar();
                }).start();
                
                // Pequeño delay entre clientes
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        } else {
            // Cliente individual
            ClientePrueba cliente = new ClientePrueba("Cliente-Unico");
            cliente.conectar();
        }
    }
}
