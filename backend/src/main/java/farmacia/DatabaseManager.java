package farmacia;

import farmacia.models.Medicamento;
import farmacia.models.Usuario;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Gestiona todas las operaciones de base de datos usando H2 Database
 * Patrón Singleton: Solo una instancia en toda la aplicación
 */
public class DatabaseManager {
    // Instancia única (Singleton)
    private static DatabaseManager instance;
    
    // Conexión a la base de datos
    private Connection connection;
    
    // Configuración de H2 Database
    private final String URL = "jdbc:h2:./database/farmacia";
    private final String USER = "sa";
    private final String PASSWORD = "";
    
    /**
     * Constructor privado - parte del patrón Singleton
     */
    private DatabaseManager() {
        inicializarBaseDatos();
    }
    
    /**
     * Obtiene la instancia única del DatabaseManager
     * @return instancia de DatabaseManager
     */
    public static synchronized DatabaseManager getInstance() {
        if (instance == null) {
            instance = new DatabaseManager();
        }
        return instance;
    }
    
    /**
     * Inicializa la base de datos y crea las tablas si no existen
     */
    private void inicializarBaseDatos() {
        try {
            // Cargar el driver de H2
            Class.forName("org.h2.Driver");
            
            // Crear conexión
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("✅ Conexión exitosa a H2 Database");
            
            // Crear tablas si no existen
            crearTablas();
            
            // Insertar datos de ejemplo
            insertarDatosEjemplo();
            
        } catch (Exception e) {
            System.err.println("❌ Error al inicializar base de datos: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Crea las tablas en la base de datos si no existen
     */
    private void crearTablas() {
        String crearMedicamentos = """
            CREATE TABLE IF NOT EXISTS medicamentos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                precio DOUBLE NOT NULL,
                stock INT NOT NULL,
                imagen VARCHAR(255),
                categoria VARCHAR(100),
                descripcion TEXT
            )
            """;
            
        String crearUsuarios = """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                identificacion VARCHAR(100) UNIQUE
            )
            """;
        
        try (Statement stmt = connection.createStatement()) {
            stmt.execute(crearMedicamentos);
            stmt.execute(crearUsuarios);
            System.out.println("✅ Tablas creadas/verificadas correctamente");
        } catch (SQLException e) {
            System.err.println("❌ Error creando tablas: " + e.getMessage());
        }
    }
    
    /**
     * Inserta datos de ejemplo en las tablas
     */
    private void insertarDatosEjemplo() {
        // Verificar si ya existen datos
        String contarMedicamentos = "SELECT COUNT(*) FROM medicamentos";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(contarMedicamentos)) {
            
            if (rs.next() && rs.getInt(1) == 0) {
                // Insertar medicamentos de ejemplo
                String insertMedicamentos = """
                    INSERT INTO medicamentos (nombre, precio, stock, imagen, categoria, descripcion) VALUES 
                    ('Paracetamol 500mg', 0.50, 100, 'paracetamol.jpg', 'Analgésico', 'Alivio del dolor y fiebre'),
                    ('Amoxicilina 250mg', 1.20, 50, 'amoxicilina.jpg', 'Antibiótico', 'Para infecciones bacterianas'),
                    ('Ibuprofeno 400mg', 0.75, 80, 'ibuprofeno.jpg', 'Antiinflamatorio', 'Alivia dolor e inflamación'),
                    ('Loratadina 10mg', 0.90, 60, 'loratadina.jpg', 'Antialérgico', 'Para alergias estacionales'),
                    ('Omeprazol 20mg', 1.10, 75, 'omeprazol.jpg', 'Digestivo', 'Protector gástrico')
                    """;
                
                // Insertar usuarios de ejemplo
                String insertUsuarios = """
                    INSERT INTO usuarios (nombre, tipo, identificacion) VALUES 
                    ('Juan Pérez', 'jubilado', '8-123-456'),
                    ('María García', 'regular', '2-987-654')
                    """;
                
                stmt.executeUpdate(insertMedicamentos);
                stmt.executeUpdate(insertUsuarios);
                System.out.println("✅ Datos de ejemplo insertados correctamente");
            }
        } catch (SQLException e) {
            System.err.println("❌ Error insertando datos: " + e.getMessage());
        }
    }
    
    // ========== MÉTODOS PARA MEDICAMENTOS ==========
    
    /**
     * Obtiene todos los medicamentos de la base de datos
     * @return Lista de medicamentos
     */
    public List<Medicamento> obtenerTodosMedicamentos() {
        List<Medicamento> medicamentos = new ArrayList<>();
        String sql = "SELECT * FROM medicamentos ORDER BY nombre";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Medicamento med = new Medicamento(
                    rs.getInt("id"),
                    rs.getString("nombre"),
                    rs.getDouble("precio"),
                    rs.getInt("stock"),
                    rs.getString("imagen"),
                    rs.getString("categoria"),
                    rs.getString("descripcion")
                );
                medicamentos.add(med);
            }
        } catch (SQLException e) {
            System.err.println("❌ Error obteniendo medicamentos: " + e.getMessage());
        }
        
        return medicamentos;
    }
    
    /**
     * Busca medicamentos por nombre
     * @param nombre Nombre o parte del nombre a buscar
     * @return Lista de medicamentos que coinciden
     */
    public List<Medicamento> buscarMedicamentos(String nombre) {
        List<Medicamento> medicamentos = new ArrayList<>();
        String sql = "SELECT * FROM medicamentos WHERE nombre LIKE ? ORDER BY nombre";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, "%" + nombre + "%");
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Medicamento med = new Medicamento(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getDouble("precio"),
                        rs.getInt("stock"),
                        rs.getString("imagen"),
                        rs.getString("categoria"),
                        rs.getString("descripcion")
                    );
                    medicamentos.add(med);
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Error buscando medicamentos: " + e.getMessage());
        }
        
        return medicamentos;
    }
    
    /**
     * Actualiza el stock de un medicamento
     * @param idMedicamento ID del medicamento
     * @param nuevaCantidad Nueva cantidad en stock
     * @return true si se actualizó correctamente
     */
    public boolean actualizarStock(int idMedicamento, int nuevaCantidad) {
        String sql = "UPDATE medicamentos SET stock = ? WHERE id = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, nuevaCantidad);
            pstmt.setInt(2, idMedicamento);
            
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException e) {
            System.err.println("❌ Error actualizando stock: " + e.getMessage());
            return false;
        }
    }
    
    // ========== MÉTODOS PARA USUARIOS ==========
    
    /**
     * Busca un usuario por identificación
     * @param identificacion Número de identificación
     * @return Usuario encontrado o null si no existe
     */
    public Usuario buscarUsuario(String identificacion) {
        String sql = "SELECT * FROM usuarios WHERE identificacion = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, identificacion);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(
                        rs.getInt("id"),
                        rs.getString("nombre"),
                        rs.getString("tipo"),
                        rs.getString("identificacion")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Error buscando usuario: " + e.getMessage());
        }
        
        return null;
    }
    
    /**
     * Cierra la conexión a la base de datos
     */
    public void cerrarConexion() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("�� Conexión a base de datos cerrada");
            }
        } catch (SQLException e) {
            System.err.println("❌ Error cerrando conexión: " + e.getMessage());
        }
    }
}
