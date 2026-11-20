package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EstadoPrestamo {
    private Short idEstadoPrestamo;
    private String nombre;

    public EstadoPrestamo() {}

    public Short getIdEstadoPrestamo() { return idEstadoPrestamo; }
    public void setIdEstadoPrestamo(Short idEstadoPrestamo) { this.idEstadoPrestamo = idEstadoPrestamo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}