package com.biblioteca.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CirculoLectura {
    private UUID idCirculo;
    private String nombre;
    private String descripcion;
    private String tema;
    private String diaSemana;
    private LocalTime hora;
    private Short cupoMaximo;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private UUID idLibro;

    public CirculoLectura() {}

    public UUID getIdCirculo() { return idCirculo; }
    public void setIdCirculo(UUID idCirculo) { this.idCirculo = idCirculo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }

    public Short getCupoMaximo() { return cupoMaximo; }
    public void setCupoMaximo(Short cupoMaximo) { this.cupoMaximo = cupoMaximo; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

}