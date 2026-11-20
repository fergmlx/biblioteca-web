package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Favorito {
    private UUID idUsuario;
    private UUID idLibro;
    private OffsetDateTime fechaAgregado;

    public Favorito() {}

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public OffsetDateTime getFechaAgregado() { return fechaAgregado; }
    public void setFechaAgregado(OffsetDateTime fechaAgregado) { this.fechaAgregado = fechaAgregado; }

}