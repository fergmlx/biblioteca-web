package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Prestamo {
    private UUID idPrestamo;
    private UUID idSolicitud;
    private OffsetDateTime fechaPrestamo;
    private OffsetDateTime fechaLimite;
    private OffsetDateTime fechaDevolucion;
    private Short idEstadoPrestamo;
    private UUID idUsuario;
    private UUID idLibro;
    private Short numEjemplar;

    public Prestamo() {}

    public UUID getIdPrestamo() { return idPrestamo; }
    public void setIdPrestamo(UUID idPrestamo) { this.idPrestamo = idPrestamo; }

    public UUID getIdSolicitud() { return idSolicitud; }
    public void setIdSolicitud(UUID idSolicitud) { this.idSolicitud = idSolicitud; }

    public OffsetDateTime getFechaPrestamo() { return fechaPrestamo; }
    public void setFechaPrestamo(OffsetDateTime fechaPrestamo) { this.fechaPrestamo = fechaPrestamo; }

    public OffsetDateTime getFechaLimite() { return fechaLimite; }
    public void setFechaLimite(OffsetDateTime fechaLimite) { this.fechaLimite = fechaLimite; }

    public OffsetDateTime getFechaDevolucion() { return fechaDevolucion; }
    public void setFechaDevolucion(OffsetDateTime fechaDevolucion) { this.fechaDevolucion = fechaDevolucion; }

    public Short getIdEstadoPrestamo() { return idEstadoPrestamo; }
    public void setIdEstadoPrestamo(Short idEstadoPrestamo) { this.idEstadoPrestamo = idEstadoPrestamo; }

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public Short getNumEjemplar() { return numEjemplar; }
    public void setNumEjemplar(Short numEjemplar) { this.numEjemplar = numEjemplar; }

}