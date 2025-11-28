package farmacia.models;

/**
 * Clase que representa un usuario del sistema
 * Puede ser jubilado (no paga) o regular (paga precio completo)
 */
public class Usuario {
    // Atributos
    private int id;
    private String nombre;
    private String tipo; // "jubilado" o "regular"
    private String identificacion;

    // Constructores
    public Usuario() {
    }

    public Usuario(int id, String nombre, String tipo, String identificacion) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.identificacion = identificacion;
    }

    // ========== GETTERS Y SETTERS ==========
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getIdentificacion() {
        return identificacion;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    // ========== MÉTODOS DE UTILIDAD ==========

    /**
     * Verifica si el usuario es jubilado
     * @return true si es jubilado, false si es regular
     */
    public boolean esJubilado() {
        return "jubilado".equalsIgnoreCase(this.tipo);
    }

    /**
     * Representación en String del usuario
     */
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", tipo='" + tipo + '\'' +
                ", identificacion='" + identificacion + '\'' +
                '}';
    }

    /**
     * Obtiene una descripción amigable del tipo de usuario
     * @return "Jubilado" o "Regular"
     */
    public String getTipoDescripcion() {
        if (esJubilado()) {
            return "Jubilado";
        } else {
            return "Regular";
        }
    }
}
