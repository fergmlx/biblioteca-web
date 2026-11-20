package com.biblioteca.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Pais {
    private Short idPais;
    private String nombre;
    private String codigoIso;

    public Pais() {}

    public Short getIdPais() { return idPais; }
    public void setIdPais(Short idPais) { this.idPais = idPais; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigoIso() { return codigoIso; }
    public void setCodigoIso(String codigoIso) { this.codigoIso = codigoIso; }

}