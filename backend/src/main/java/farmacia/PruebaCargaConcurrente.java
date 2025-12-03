package farmacia;

import java.io.*;
import java.net.Socket;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simula múltiples clientes conectándose simultáneamente al servidor
 * para probar la concurrencia del sistema
 */
public class PruebaCargaConcurrente {
    private static final int NUM_CLIENTES = 10;
    private static final AtomicInteger clientesExitosos = new AtomicInteger(0);
    private static final AtomicInteger totalOperaciones = new AtomicInteger(0);
    private static final AtomicInteger comprasExitosas = new AtomicInteger(0);
    private static final AtomicInteger erroresStock = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        System.out.println("🧪 INICIANDO PRUEBA DE CONCURRENCIA");
        System.out.println("====================================");
        System.out.println("Clientes simulados: " + NUM_CLIENTES);
        System.out.println("Servidor: localhost:12345");
        System.out.println();

        CountDownLatch latch = new CountDownLatch(NUM_CLIENTES);
        long startTime = System.currentTimeMillis();

        // Crear y ejecutar múltiples clientes simultáneamente
        for (int i = 1; i <= NUM_CLIENTES; i++) {
            final int clientId = i;
            new Thread(() -> {
                try {
                    simularCliente(clientId);
                    clientesExitosos.incrementAndGet();
                } catch (Exception e) {
                    System.err.println("❌ Cliente " + clientId + " falló: " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            }).start();

            // Pequeño delay entre creación de clientes para simular conexiones escalonadas
            Thread.sleep(100);
        }

        // Esperar a que todos los clientes terminen
        latch.await();

        long endTime = System.currentTimeMillis();
        long duracionTotal = endTime - startTime;

        // Mostrar resultados
        System.out.println("\n📊 RESULTADOS DE LA PRUEBA");
        System.out.println("==========================");
        System.out.println("Tiempo total: " + duracionTotal + " ms");
        System.out.println("Clientes exitosos: " + clientesExitosos.get() + "/" + NUM_CLIENTES);
        System.out.println("Operaciones realizadas: " + totalOperaciones.get());
        System.out.println("Compras exitosas: " + comprasExitosas.get());
        System.out.println("Errores de stock: " + erroresStock.get());
        System.out.println("Tiempo promedio por cliente: " + (duracionTotal / NUM_CLIENTES) + " ms");
        System.out.println("Operaciones por segundo: " + (totalOperaciones.get() * 1000L / duracionTotal));

        if (clientesExitosos.get() == NUM_CLIENTES) {
            System.out.println("✅ PRUEBA EXITOSA - El sistema maneja la carga concurrente correctamente");
        } else {
            System.out.println("⚠️  PRUEBA CON ADVERTENCIAS - Algunos clientes fallaron");
        }
    }

    private static void simularCliente(int clientId) {
        try (Socket socket = new Socket("localhost", 12345);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter writer = new PrintWriter(socket.getOutputStream(), true)) {

            String clientName = "Cliente-" + clientId;
            System.out.println("🔗 " + clientName + " conectado");

            // Secuencia de operaciones típicas de un cliente
            String[] operaciones = {
                "SALUDO|",
                "LISTAR_MEDICAMENTOS|",
                "BUSCAR_MEDICAMENTOS|para",
                "CONSULTAR_USUARIO|8-123-456",
                "CALCULAR_PRECIO|8-123-456|1,2",
                "PROCESAR_COMPRA|8-123-456|1:1,2:2"  // NUEVO: Probar compra
            };

            for (String operacion : operaciones) {
                writer.println(operacion);
                totalOperaciones.incrementAndGet();
                
                // Leer respuesta y procesar según el tipo
                String respuesta = reader.readLine();
                if (respuesta != null) {
                    if (respuesta.startsWith("ERROR")) {
                        System.err.println("❌ " + clientName + " - Error en operación: " + respuesta);
                        
                        // Contabilizar errores de stock específicos
                        if (respuesta.contains("STOCK") || respuesta.contains("stock")) {
                            erroresStock.incrementAndGet();
                        }
                    } else if (respuesta.startsWith("COMPRA_EXITOSA")) {
                        comprasExitosas.incrementAndGet();
                        System.out.println("✅ " + clientName + " - Compra exitosa: " + respuesta);
                    } else if (respuesta.startsWith("HOLA")) {
                        System.out.println("👋 " + clientName + " - " + respuesta);
                    } else if (respuesta.startsWith("USUARIO_ENCONTRADO")) {
                        System.out.println("👤 " + clientName + " - Usuario verificado");
                    } else if (respuesta.startsWith("PRECIO_TOTAL")) {
                        System.out.println("💰 " + clientName + " - Precio calculado: " + respuesta);
                    } else if (respuesta.startsWith("FIN_LISTA") || respuesta.startsWith("FIN_BUSQUEDA")) {
                        System.out.println("📦 " + clientName + " - " + respuesta);
                    }
                }
                
                // Pequeña pausa entre operaciones
                Thread.sleep(200);
            }

            System.out.println("✅ " + clientName + " completó todas las operaciones");

        } catch (Exception e) {
            System.err.println("❌ Error en " + "Cliente-" + clientId + ": " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}