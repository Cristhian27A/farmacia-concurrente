package farmacia;

import farmacia.models.Medicamento;
import farmacia.models.Usuario;
import java.sql.Connection; //API JDBC para conexión con bases de datos
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;


//Gestor único de base de datos que implementa el patrón Singleton para asegurar una sola conexión en toda la aplicación. 
// Maneja toda la persistencia de datos usando H2 Database embebida.
public class DatabaseManager {
   // Singleton instance - solo una instancia en toda la aplicación
   private static DatabaseManager instance;
   
   // Conexión única a la base de datos
   private Connection connection;
   
   // Configuración de conexión a H2 Database
   private final String URL = "jdbc:h2:./database/farmacia";
   private final String USER = "sa";
   private final String PASSWORD = "";

   // Constructor privado - parte del patrón Singleton
   private DatabaseManager() {
      this.inicializarBaseDatos();
   }

   // Método estático sincronizado para obtener la instancia única (Singleton thread-safe)
   public static synchronized DatabaseManager getInstance() {
      if (instance == null) {
         instance = new DatabaseManager();
      }
      return instance;
   }

   // Inicializa la base de datos: carga driver, crea conexión, crea tablas, inserta datos
   private void inicializarBaseDatos() {
      try {
         // Cargar el driver JDBC de H2
         Class.forName("org.h2.Driver");
         
         // Establecer conexión a la base de datos H2 (archivo embebido)
         this.connection = DriverManager.getConnection("jdbc:h2:./database/farmacia", "sa", "");
         System.out.println("✅ Conexión exitosa a H2 Database");
         
         // Crear tablas si no existen
         this.crearTablas();
         
         // Insertar datos de ejemplo si las tablas están vacías
         this.insertarDatosEjemplo();
         
      } catch (Exception var2) {
         System.err.println("❌ Error al inicializar base de datos: " + var2.getMessage());
         var2.printStackTrace();
      }
   }

   // Crea las tablas 'medicamentos' y 'usuarios' si no existen
   private void crearTablas() {
      String var1 = "CREATE TABLE IF NOT EXISTS medicamentos (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    nombre VARCHAR(255) NOT NULL,\n    precio DOUBLE NOT NULL,\n    stock INT NOT NULL,\n    imagen VARCHAR(255),\n    categoria VARCHAR(100),\n    descripcion TEXT\n)\n";
      String var2 = "CREATE TABLE IF NOT EXISTS usuarios (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    nombre VARCHAR(255) NOT NULL,\n    tipo VARCHAR(50) NOT NULL,\n    identificacion VARCHAR(100) UNIQUE\n)\n";

      try {
         Statement var3 = this.connection.createStatement();

         try {
            // Ejecutar sentencias SQL para crear tablas
            var3.execute(var1);
            var3.execute(var2);
            System.out.println("✅ Tablas creadas/verificadas correctamente");
         } catch (Throwable var7) {
            if (var3 != null) {
               try {
                  var3.close();
               } catch (Throwable var6) {
                  var7.addSuppressed(var6);
               }
            }
            throw var7;
         }

         if (var3 != null) {
            var3.close();
         }
      } catch (SQLException var8) {
         System.err.println("❌ Error creando tablas: " + var8.getMessage());
      }
   }

   // Inserta datos de ejemplo solo si la tabla medicamentos está vacía
   private void insertarDatosEjemplo() {
      String var1 = "SELECT COUNT(*) FROM medicamentos";

      try {
         Statement var2 = this.connection.createStatement();

         try {
            ResultSet var3 = var2.executeQuery(var1);

            try {
               // Verificar si la tabla está vacía
               if (var3.next() && var3.getInt(1) == 0) {
                  // SQL para insertar medicamentos de ejemplo
                  String var4 = "INSERT INTO medicamentos (nombre, precio, stock, imagen, categoria, descripcion) VALUES\n('Paracetamol 500mg', 0.50, 100, 'paracetamol.jpg', 'Analgésico', 'Alivio del dolor y fiebre'),\n('Amoxicilina 250mg', 1.20, 50, 'amoxicilina.jpg', 'Antibiótico', 'Para infecciones bacterianas'),\n('Ibuprofeno 400mg', 0.75, 80, 'ibuprofeno.jpg', 'Antiinflamatorio', 'Alivia dolor e inflamación'),\n('Loratadina 10mg', 0.90, 60, 'loratadina.jpg', 'Antialérgico', 'Para alergias estacionales'),\n('Omeprazol 20mg', 1.10, 75, 'omeprazol.jpg', 'Digestivo', 'Protector gástrico')\n";
                  
                  // SQL para insertar usuarios de ejemplo
                  String var5 = "INSERT INTO usuarios (nombre, tipo, identificacion) VALUES\n('Juan Pérez', 'jubilado', '8-123-456'),\n('María García', 'regular', '2-987-654')\n";
                  
                  // Ejecutar inserciones
                  var2.executeUpdate(var4);
                  var2.executeUpdate(var5);
                  System.out.println("✅ Datos de ejemplo insertados correctamente");
               }
            } catch (Throwable var8) {
               if (var3 != null) {
                  try {
                     var3.close();
                  } catch (Throwable var7) {
                     var8.addSuppressed(var7);
                  }
               }
               throw var8;
            }

            if (var3 != null) {
               var3.close();
            }
         } catch (Throwable var9) {
            if (var2 != null) {
               try {
                  var2.close();
               } catch (Throwable var6) {
                  var9.addSuppressed(var6);
               }
            }
            throw var9;
         }

         if (var2 != null) {
            var2.close();
         }
      } catch (SQLException var10) {
         System.err.println("❌ Error insertando datos: " + var10.getMessage());
      }
   }

   // Obtiene todos los medicamentos de la base de datos, ordenados por nombre
   public List<Medicamento> obtenerTodosMedicamentos() {
      ArrayList var1 = new ArrayList();
      String var2 = "SELECT * FROM medicamentos ORDER BY nombre";

      try {
         Statement var3 = this.connection.createStatement();

         try {
            ResultSet var4 = var3.executeQuery(var2);

            try {
               // Recorrer todos los resultados y crear objetos Medicamento
               while(var4.next()) {
                  Medicamento var5 = new Medicamento(var4.getInt("id"), var4.getString("nombre"), var4.getDouble("precio"), var4.getInt("stock"), var4.getString("imagen"), var4.getString("categoria"), var4.getString("descripcion"));
                  var1.add(var5);
               }
            } catch (Throwable var9) {
               if (var4 != null) {
                  try {
                     var4.close();
                  } catch (Throwable var8) {
                     var9.addSuppressed(var8);
                  }
               }
               throw var9;
            }

            if (var4 != null) {
               var4.close();
            }
         } catch (Throwable var10) {
            if (var3 != null) {
               try {
                  var3.close();
               } catch (Throwable var7) {
                  var10.addSuppressed(var7);
               }
            }
            throw var10;
         }

         if (var3 != null) {
            var3.close();
         }
      } catch (SQLException var11) {
         System.err.println("❌ Error obteniendo medicamentos: " + var11.getMessage());
      }

      return var1;
   }

   // Busca medicamentos por nombre (búsqueda parcial con LIKE)
   public List<Medicamento> buscarMedicamentos(String var1) {
      ArrayList var2 = new ArrayList();
      String var3 = "SELECT * FROM medicamentos WHERE nombre LIKE ? ORDER BY nombre";

      try {
         PreparedStatement var4 = this.connection.prepareStatement(var3);

         try {
            // Configurar parámetro de búsqueda con comodines
            var4.setString(1, "%" + var1 + "%");
            ResultSet var5 = var4.executeQuery();

            try {
               // Recorrer resultados y crear objetos Medicamento
               while(var5.next()) {
                  Medicamento var6 = new Medicamento(var5.getInt("id"), var5.getString("nombre"), var5.getDouble("precio"), var5.getInt("stock"), var5.getString("imagen"), var5.getString("categoria"), var5.getString("descripcion"));
                  var2.add(var6);
               }
            } catch (Throwable var10) {
               if (var5 != null) {
                  try {
                     var5.close();
                  } catch (Throwable var9) {
                     var10.addSuppressed(var9);
                  }
               }
               throw var10;
            }

            if (var5 != null) {
               var5.close();
            }
         } catch (Throwable var11) {
            if (var4 != null) {
               try {
                  var4.close();
               } catch (Throwable var8) {
                  var11.addSuppressed(var8);
               }
            }
            throw var11;
         }

         if (var4 != null) {
            var4.close();
         }
      } catch (SQLException var12) {
         System.err.println("❌ Error buscando medicamentos: " + var12.getMessage());
      }

      return var2;
   }

   // MÉTODO NUEVO: Obtener medicamento por ID
   public Medicamento obtenerMedicamentoPorId(int id) {
      String sql = "SELECT * FROM medicamentos WHERE id = ?";
      try (PreparedStatement pstmt = this.connection.prepareStatement(sql)) {
         pstmt.setInt(1, id);
         ResultSet rs = pstmt.executeQuery();
         if (rs.next()) {
            return new Medicamento(
               rs.getInt("id"),
               rs.getString("nombre"),
               rs.getDouble("precio"),
               rs.getInt("stock"),
               rs.getString("imagen"),
               rs.getString("categoria"),
               rs.getString("descripcion")
            );
         }
      } catch (SQLException e) {
         System.err.println("❌ Error obteniendo medicamento por ID: " + e.getMessage());
      }
      return null;
   }

   // MÉTODO MEJORADO: Actualizar stock con control de concurrencia y validación
   // synchronized previene que múltiples hilos actualicen stock simultáneamente
   public synchronized boolean actualizarStock(int medicamentoId, int cambioStock) {
      // Primero verificar el stock actual
      String selectSql = "SELECT stock FROM medicamentos WHERE id = ?";
      String updateSql = "UPDATE medicamentos SET stock = stock + ? WHERE id = ? AND stock + ? >= 0";
      
      try {
         // Verificar que el medicamento existe y tiene stock suficiente
         Medicamento medicamento = obtenerMedicamentoPorId(medicamentoId);
         if (medicamento == null) {
            return false;
         }
         
         int nuevoStock = medicamento.getStock() + cambioStock;
         if (nuevoStock < 0) {
            System.out.println("❌ Stock insuficiente: " + medicamento.getStock() + ", cambio: " + cambioStock);
            return false;
         }
         
         // Actualizar con condición WHERE para evitar race conditions a nivel de BD
         try (PreparedStatement updateStmt = this.connection.prepareStatement(updateSql)) {
            updateStmt.setInt(1, cambioStock);
            updateStmt.setInt(2, medicamentoId);
            updateStmt.setInt(3, cambioStock);
            
            int affectedRows = updateStmt.executeUpdate();
            boolean exito = affectedRows > 0;
            
            if (exito) {
               System.out.println("✅ Stock actualizado: ID " + medicamentoId + " cambio: " + cambioStock + ", nuevo stock: " + nuevoStock);
            } else {
               System.out.println("❌ No se pudo actualizar stock - posible condición de carrera");
            }
            
            return exito;
         }
      } catch (SQLException e) {
         System.err.println("❌ Error actualizando stock: " + e.getMessage());
         return false;
      }
   }

   // MÉTODO NUEVO: Verificar stock sin modificarlo
   // synchronized para lectura consistente en entorno concurrente
   public synchronized boolean verificarStockSuficiente(int medicamentoId, int cantidadRequerida) {
      String sql = "SELECT stock FROM medicamentos WHERE id = ?";
      try (PreparedStatement pstmt = this.connection.prepareStatement(sql)) {
         pstmt.setInt(1, medicamentoId);
         ResultSet rs = pstmt.executeQuery();
         if (rs.next()) {
            int stockActual = rs.getInt("stock");
            return stockActual >= cantidadRequerida;
         }
      } catch (SQLException e) {
         System.err.println("❌ Error verificando stock: " + e.getMessage());
      }
      return false;
   }

   // Busca un usuario por su identificación
   public Usuario buscarUsuario(String var1) {
      String var2 = "SELECT * FROM usuarios WHERE identificacion = ?";

      try {
         PreparedStatement var3 = this.connection.prepareStatement(var2);

         label78: {
            Usuario var5;
            try {
               var3.setString(1, var1);
               ResultSet var4 = var3.executeQuery();

               label80: {
                  try {
                     if (var4.next()) {
                        var5 = new Usuario(var4.getInt("id"), var4.getString("nombre"), var4.getString("tipo"), var4.getString("identificacion"));
                        break label80;
                     }
                  } catch (Throwable var9) {
                     if (var4 != null) {
                        try {
                           var4.close();
                        } catch (Throwable var8) {
                           var9.addSuppressed(var8);
                        }
                     }
                     throw var9;
                  }

                  if (var4 != null) {
                     var4.close();
                  }
                  break label78;
               }

               if (var4 != null) {
                  var4.close();
               }
            } catch (Throwable var10) {
               if (var3 != null) {
                  try {
                     var3.close();
                  } catch (Throwable var7) {
                     var10.addSuppressed(var7);
                  }
               }
               throw var10;
            }

            if (var3 != null) {
               var3.close();
            }
            return var5;
         }

         if (var3 != null) {
            var3.close();
         }
      } catch (SQLException var11) {
         System.err.println("❌ Error buscando usuario: " + var11.getMessage());
      }

      return null;
   }

   // Cierra la conexión a la base de datos
   public void cerrarConexion() {
      try {
         if (this.connection != null && !this.connection.isClosed()) {
            this.connection.close();
            System.out.println("✅ Conexión a base de datos cerrada");
         }
      } catch (SQLException var2) {
         System.err.println("❌ Error cerrando conexión: " + var2.getMessage());
      }
   }
}
