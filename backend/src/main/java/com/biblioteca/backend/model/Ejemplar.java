package com.biblioteca.backend.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Ejemplar {
    private UUID idLibro;
    private Short numEjemplar;
    private String codigoInventario;
    private String ubicacion;
    private Short idCondicionEjemplar;

    public Ejemplar() {}

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public Short getNumEjemplar() { return numEjemplar; }
    public void setNumEjemplar(Short numEjemplar) { this.numEjemplar = numEjemplar; }

    public String getCodigoInventario() { return codigoInventario; }
    public void setCodigoInventario(String codigoInventario) { this.codigoInventario = codigoInventario; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public Short getIdCondicionEjemplar() { return idCondicionEjemplar; }
    public void setIdCondicionEjemplar(Short idCondicionEjemplar) { this.idCondicionEjemplar = idCondicionEjemplar; }

}