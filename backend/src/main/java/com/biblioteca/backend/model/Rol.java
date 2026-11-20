package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Rol {
    private Short idRol;
    private String nombre;

    public Rol() {}

    public Short getIdRol() { return idRol; }
    public void setIdRol(Short idRol) { this.idRol = idRol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}