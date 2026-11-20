package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InscripcionCirculo {
    private UUID idInscripcion;
    private OffsetDateTime fechaInscripcion;
    private OffsetDateTime fechaBaja;
    private UUID idUsuario;
    private UUID idCirculo;
    private Boolean esExcepcionCupo;
    private String motivoExcepcion;
    private UUID idUsuarioAutoriza;

    public InscripcionCirculo() {}

    public UUID getIdInscripcion() { return idInscripcion; }
    public void setIdInscripcion(UUID idInscripcion) { this.idInscripcion = idInscripcion; }

    public OffsetDateTime getFechaInscripcion() { return fechaInscripcion; }
    public void setFechaInscripcion(OffsetDateTime fechaInscripcion) { this.fechaInscripcion = fechaInscripcion; }

    public OffsetDateTime getFechaBaja() { return fechaBaja; }
    public void setFechaBaja(OffsetDateTime fechaBaja) { this.fechaBaja = fechaBaja; }

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public UUID getIdCirculo() { return idCirculo; }
    public void setIdCirculo(UUID idCirculo) { this.idCirculo = idCirculo; }

    public Boolean isEsExcepcionCupo() { return esExcepcionCupo; }
    public void setEsExcepcionCupo(Boolean esExcepcionCupo) { this.esExcepcionCupo = esExcepcionCupo; }

    public String getMotivoExcepcion() { return motivoExcepcion; }
    public void setMotivoExcepcion(String motivoExcepcion) { this.motivoExcepcion = motivoExcepcion; }

    public UUID getIdUsuarioAutoriza() { return idUsuarioAutoriza; }
    public void setIdUsuarioAutoriza(UUID idUsuarioAutoriza) { this.idUsuarioAutoriza = idUsuarioAutoriza; }

}