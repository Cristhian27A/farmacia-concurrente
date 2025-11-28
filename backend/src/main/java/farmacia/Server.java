package farmacia;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Servidor principal que acepta múltiples conexiones concurrentes
 * Usa ExecutorService para manejar un pool de hilos y evitar crear hilos ilimitados
 * Esto es PROGRAMACIÓN CONCURRENTE en acción
 */
public class Server {
    private static final int PORT = 12345;
    private static final int MAX_THREADS = 10; // Máximo de clientes simultáneos
    private ServerSocket serverSocket;
    private ExecutorService threadPool;
    private boolean isRunning;

    /**
     * Constructor - inicializa el servidor
     */
    public Server() {
        this.threadPool = Executors.newFixedThreadPool(MAX_THREADS);
        this.isRunning = false;
    }

    /**
     * Inicia el servidor y comienza a aceptar conexiones
     */
    public void start() {
        try {
            serverSocket = new ServerSocket(PORT);
            isRunning = true;
            
            System.out.println("🚀 SERVIDOR INICIADO - Programación Concurrente");
            System.out.println("📍 Puerto: " + PORT);
            System.out.println("🎯 Máximo clientes simultáneos: " + MAX_THREADS);
            System.out.println("📡 Esperando conexiones de clientes...");
            System.out.println("===============================================");

            // Aceptar conexiones continuamente
            while (isRunning) {
                try {
                    // Esperar por una nueva conexión (esto BLOQUEA el hilo hasta que llega un cliente)
                    Socket clientSocket = serverSocket.accept();
                    
                    System.out.println("✅ Nueva conexión entrante: " + 
                                     clientSocket.getInetAddress().getHostAddress());
                    
                    // Crear un manejador para el cliente y ejecutarlo en un hilo del pool
                    ClientHandler clientHandler = new ClientHandler(clientSocket);
                    threadPool.execute(clientHandler);
                    
                } catch (IOException e) {
                    if (isRunning) {
                        System.err.println("❌ Error aceptando conexión: " + e.getMessage());
                    }
                }
            }
            
        } catch (IOException e) {
            System.err.println("❌ No se pudo iniciar el servidor en puerto " + PORT);
            e.printStackTrace();
        } finally {
            stop();
        }
    }

    /**
     * Detiene el servidor de forma controlada
     */
    public void stop() {
        isRunning = false;
        
        try {
            if (serverSocket != null && !serverSocket.isClosed()) {
                serverSocket.close();
            }
        } catch (IOException e) {
            System.err.println("❌ Error cerrando server socket: " + e.getMessage());
        }
        
        // Cerrar el pool de hilos de forma ordenada
        if (threadPool != null && !threadPool.isShutdown()) {
            threadPool.shutdown();
            System.out.println("🛑 Pool de hilos cerrado");
        }
        
        // Cerrar conexión a base de datos
        DatabaseManager.getInstance().cerrarConexion();
        
        System.out.println("🛑 Servidor detenido");
    }

    /**
     * Método principal - punto de entrada de la aplicación servidor
     */
    public static void main(String[] args) {
        Server server = new Server();
        
        // Agregar shutdown hook para detener servidor gracefulmente con Ctrl+C
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n⚠️  Recibida señal de apagado...");
            server.stop();
        }));
        
        // Iniciar servidor
        server.start();
    }
}
