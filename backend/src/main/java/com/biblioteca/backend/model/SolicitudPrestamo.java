package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SolicitudPrestamo {
    private UUID idSolicitud;
    private UUID idUsuario;
    private UUID idLibro;
    private OffsetDateTime fechaSolicitud;
    private OffsetDateTime fechaRespuesta;
    private String estado;
    private String observaciones;

    public SolicitudPrestamo() {}

    public UUID getIdSolicitud() { return idSolicitud; }
    public void setIdSolicitud(UUID idSolicitud) { this.idSolicitud = idSolicitud; }

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public OffsetDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(OffsetDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public OffsetDateTime getFechaRespuesta() { return fechaRespuesta; }
    public void setFechaRespuesta(OffsetDateTime fechaRespuesta) { this.fechaRespuesta = fechaRespuesta; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

}