package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TipoParticipacion {
    private Short idTipoParticipacion;
    private String nombre;

    public TipoParticipacion() {}

    public Short getIdTipoParticipacion() { return idTipoParticipacion; }
    public void setIdTipoParticipacion(Short idTipoParticipacion) { this.idTipoParticipacion = idTipoParticipacion; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

}