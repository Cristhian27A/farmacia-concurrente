package farmacia;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Prueba de estrés con 50 clientes simultáneos
 */
public class PruebaEstres {
    private static final int CLIENTES_ESTRES = 50;
    private static final AtomicInteger exitosos = new AtomicInteger(0);
    private static final AtomicInteger fallidos = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        System.out.println("🔥 INICIANDO PRUEBA DE ESTRÉS");
        System.out.println("=============================");
        System.out.println("Clientes: " + CLIENTES_ESTRES);
        System.out.println("Thread Pool: 25 hilos máximo");
        
        ExecutorService executor = Executors.newFixedThreadPool(25);
        long startTime = System.currentTimeMillis();

        for (int i = 1; i <= CLIENTES_ESTRES; i++) {
            final int clientId = i;
            executor.submit(() -> {
                try {
                    Thread.sleep((long) (Math.random() * 1000)); // Conexión aleatoria
                    realizarOperacionesIntensivas(clientId);
                    exitosos.incrementAndGet();
                } catch (Exception e) {
                    fallidos.incrementAndGet();
                    System.err.println("💥 Cliente " + clientId + " falló: " + e.getMessage());
                }
            });
        }

        executor.shutdown();
        executor.awaitTermination(2, TimeUnit.MINUTES);

        long endTime = System.currentTimeMillis();
        
        System.out.println("\n📊 RESULTADOS PRUEBA ESTRÉS");
        System.out.println("==========================");
        System.out.println("Tiempo: " + (endTime - startTime) + " ms");
        System.out.println("✅ Exitosa: " + exitosos.get());
        System.out.println("❌ Fallidas: " + fallidos.get());
        System.out.println("📈 Eficiencia: " + (exitosos.get() * 100 / CLIENTES_ESTRES) + "%");
    }

    private static void realizarOperacionesIntensivas(int clientId) {
        // Simular operaciones más intensivas
        // (En una prueba real aquí iría el código de conexión al servidor)
        try {
            Thread.sleep(1000 + (long) (Math.random() * 2000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
