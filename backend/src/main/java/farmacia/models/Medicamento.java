package farmacia.models;

/**
 * Clase que representa un medicamento en el sistema
 * Contiene todos los atributos de un medicamento y métodos para acceder a ellos
 */
public class Medicamento {
    // Atributos de la clase - representan las columnas de la base de datos
    private int id;
    private String nombre;
    private double precio;
    private int stock;
    private String imagen;
    private String categoria;
    private String descripcion;

    // Constructor vacío - necesario para algunas operaciones
    public Medicamento() {
        // Constructor por defecto
    }

    // Constructor con parámetros - para crear objetos fácilmente
    public Medicamento(int id, String nombre, double precio, int stock, 
                      String imagen, String categoria, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
        this.categoria = categoria;
        this.descripcion = descripcion;
    }

    // ========== MÉTODOS GETTER Y SETTER ==========
    // Permiten acceder y modificar los atributos de forma controlada

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

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    /**
     * Método toString - representa el objeto como String
     * Útil para debugging y mostrar información
     */
    @Override
    public String toString() {
        return "Medicamento{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", stock=" + stock +
                ", categoria='" + categoria + '\'' +
                '}';
    }

    /**
     * Método para verificar si el medicamento está disponible
     * @return true si hay stock, false si está agotado
     */
    public boolean estaDisponible() {
        return stock > 0;
    }

    /**
     * Método para calcular el precio con descuento para jubilados
     * @param esJubilado true si el usuario es jubilado
     * @return precio final (0 para jubilados, precio normal para otros)
     */
    public double calcularPrecioFinal(boolean esJubilado) {
        if (esJubilado) {
            return 0.0; // Jubilados no pagan
        }
        return this.precio;
    }
}
