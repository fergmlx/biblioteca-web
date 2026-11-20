package com.biblioteca.backend.model;

import java.time.LocalDate;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Autor {
    private UUID idAutor;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Short idPais;
    private String rutaImagen;
    private LocalDate fechaNacimiento;
    private LocalDate fechaFallecimiento;
    private String biografia;

    public Autor() {}

    public UUID getIdAutor() { return idAutor; }
    public void setIdAutor(UUID idAutor) { this.idAutor = idAutor; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidoPaterno() { return apellidoPaterno; }
    public void setApellidoPaterno(String apellidoPaterno) { this.apellidoPaterno = apellidoPaterno; }

    public String getApellidoMaterno() { return apellidoMaterno; }
    public void setApellidoMaterno(String apellidoMaterno) { this.apellidoMaterno = apellidoMaterno; }

    public Short getIdPais() { return idPais; }
    public void setIdPais(Short idPais) { this.idPais = idPais; }

    public String getRutaImagen() { return rutaImagen; }
    public void setRutaImagen(String rutaImagen) { this.rutaImagen = rutaImagen; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public LocalDate getFechaFallecimiento() { return fechaFallecimiento; }
    public void setFechaFallecimiento(LocalDate fechaFallecimiento) { this.fechaFallecimiento = fechaFallecimiento; }

    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }

}