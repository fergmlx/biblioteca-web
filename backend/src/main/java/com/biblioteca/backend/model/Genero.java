package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Genero {
    private Short idGenero;
    private String nombre;

    public Genero() {}

    public Short getIdGenero() { return idGenero; }
    public void setIdGenero(Short idGenero) { this.idGenero = idGenero; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}