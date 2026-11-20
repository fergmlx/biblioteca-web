package com.biblioteca.backend.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Libro {
    private UUID idLibro;
    private String isbn;
    private String titulo;
    private String editorial;
    private Short anioPublicacion;
    private String idioma;
    private String sinopsis;
    private String rutaPortada;

    public Libro() {}

    public UUID getIdLibro() { return idLibro; }
    public void setIdLibro(UUID idLibro) { this.idLibro = idLibro; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getEditorial() { return editorial; }
    public void setEditorial(String editorial) { this.editorial = editorial; }

    public Short getAnioPublicacion() { return anioPublicacion; }
    public void setAnioPublicacion(Short anioPublicacion) { this.anioPublicacion = anioPublicacion; }

    public String getIdioma() { return idioma; }
    public void setIdioma(String idioma) { this.idioma = idioma; }

    public String getSinopsis() { return sinopsis; }
    public void setSinopsis(String sinopsis) { this.sinopsis = sinopsis; }

    public String getRutaPortada() { return rutaPortada; }
    public void setRutaPortada(String rutaPortada) { this.rutaPortada = rutaPortada; }

}