package com.biblioteca.backend.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LibroAutor {
    private UUID idLibro;
    private UUID idAutor;
    private Short idTipoParticipacion;

    public LibroAutor() {}

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public UUID getIdAutor() { return idAutor; }
    public void setIdAutor(UUID idAutor) { this.idAutor = idAutor; }

    public Short getIdTipoParticipacion() { return idTipoParticipacion; }
    public void setIdTipoParticipacion(Short idTipoParticipacion) { this.idTipoParticipacion = idTipoParticipacion; }

}