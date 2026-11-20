package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CondicionEjemplar {
    private Short idCondicionEjemplar;
    private String nombre;
    private Boolean permitePrestamo;

    public CondicionEjemplar() {}

    public Short getIdCondicionEjemplar() { return idCondicionEjemplar; }
    public void setIdCondicionEjemplar(Short idCondicionEjemplar) { this.idCondicionEjemplar = idCondicionEjemplar; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Boolean isPermitePrestamo() { return permitePrestamo; }
    public void setPermitePrestamo(Boolean permitePrestamo) { this.permitePrestamo = permitePrestamo; }

}