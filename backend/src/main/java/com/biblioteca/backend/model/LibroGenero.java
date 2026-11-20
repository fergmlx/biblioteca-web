package com.biblioteca.backend.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LibroGenero {
    private UUID idLibro;
    private Short idGenero;

    public LibroGenero() {}

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public Short getIdGenero() { return idGenero; }
    public void setIdGenero(Short idGenero) { this.idGenero = idGenero; }

}