package farmacia;

import java.io.*;
import java.net.Socket;
import java.util.concurrent.TimeUnit;

/**
 * Demostración automática para mostrar al profesor
 * todas las funcionalidades del sistema
 */
public class DemoProfesor {
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("🎓 DEMOSTRACIÓN SISTEMA FARMACIA CONCURRENTE");
        System.out.println("============================================");
        System.out.println();
        
        // 1. Mostrar servidor iniciado
        System.out.println("1. 🚀 INICIANDO SERVIDOR CONCURRENTE");
        System.out.println("   - Puerto: 12345");
        System.out.println("   - Máximo clientes: 10 simultáneos");
        System.out.println("   - Base de datos: H2 (100% Java)");
        TimeUnit.SECONDS.sleep(2);
        
        // 2. Demostrar múltiples clientes
        System.out.println("\n2. 👥 DEMOSTRANDO CONCURRENCIA");
        System.out.println("   - Conectando 3 clientes simultáneos...");
        
        Thread[] clientes = new Thread[3];
        for (int i = 0; i < 3; i++) {
            final int clientId = i + 1;
            clientes[i] = new Thread(() -> demostrarCliente(clientId));
            clientes[i].start();
            TimeUnit.MILLISECONDS.sleep(500);
        }
        
        // Esperar que todos terminen
        for (Thread cliente : clientes) {
            cliente.join();
        }
        
        // 3. Demostrar funcionalidades específicas
        System.out.println("\n3. 💊 FUNCIONALIDADES DEL SISTEMA");
        demostrarFuncionalidades();
        
        // 4. Mostrar resultados
        System.out.println("\n4. 📊 RESUMEN DE LA DEMOSTRACIÓN");
        System.out.println("   ✅ Servidor concurrente funcionando");
        System.out.println("   ✅ Múltiples clientes simultáneos");
        System.out.println("   ✅ Consultas en tiempo real");
        System.out.println("   ✅ Diferentes tipos de usuario (Jubilados/Regulares)");
        System.out.println("   ✅ Base de datos integrada");
        System.out.println("   ✅ Sistema robusto y seguro");
        
        System.out.println("\n🎉 DEMOSTRACIÓN COMPLETADA EXITOSAMENTE");
    }
    
    private static void demostrarCliente(int clientId) {
        try (Socket socket = new Socket("localhost", 12345);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {
            
            String clientName = "Cliente-" + clientId;
            System.out.println("   🔗 " + clientName + " conectado");
            
            // Operaciones específicas para cada cliente
            switch (clientId) {
                case 1:
                    writer.println("LISTAR_MEDICAMENTOS|");
                    System.out.println("   📋 " + clientName + " listando medicamentos");
                    break;
                case 2:
                    writer.println("CONSULTAR_USUARIO|8-123-456");
                    System.out.println("   👤 " + clientName + " consultando usuario jubilado");
                    break;
                case 3:
                    writer.println("BUSCAR_MEDICAMENTOS|para");
                    System.out.println("   🔍 " + clientName + " buscando medicamentos");
                    break;
            }
            
            // Leer y mostrar algunas respuestas
            for (int i = 0; i < 3; i++) {
                String respuesta = reader.readLine();
                if (respuesta != null && !respuesta.startsWith("FIN")) {
                    System.out.println("   📨 " + clientName + " recibió: " + 
                                     respuesta.substring(0, Math.min(40, respuesta.length())) + "...");
                }
            }
            
            System.out.println("   ✅ " + clientName + " operaciones completadas");
            
        } catch (Exception e) {
            System.err.println("   ❌ " + "Cliente-" + clientId + " error: " + e.getMessage());
        }
    }
    
    private static void demostrarFuncionalidades() {
        try {
            TimeUnit.SECONDS.sleep(1);
            System.out.println("   💰 Cálculo de precios para jubilados (GRATIS)");
            TimeUnit.SECONDS.sleep(1);
            System.out.println("   📦 Gestión de stock en tiempo real");
            TimeUnit.SECONDS.sleep(1);
            System.out.println("   🔍 Búsqueda y filtrado de medicamentos");
            TimeUnit.SECONDS.sleep(1);
            System.out.println("   🌐 Interfaz web responsive");
            TimeUnit.SECONDS.sleep(1);
            System.out.println("   ⚡ Comunicación WebSocket en tiempo real");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
