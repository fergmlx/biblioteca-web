package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Usuario {
    private UUID idUsuario;
    private String numeroSocio;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    @JsonIgnore
    private String contrasenaHash;
    private String telefono;
    private Boolean membresiaActiva;
    private OffsetDateTime fechaRegistro;
    private Short idRol;
    @JsonProperty("contrasena")
    private String plainPassword;

    public Usuario() {}

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public String getNumeroSocio() { return numeroSocio; }
    public void setNumeroSocio(String numeroSocio) { this.numeroSocio = numeroSocio; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidoPaterno() { return apellidoPaterno; }
    public void setApellidoPaterno(String apellidoPaterno) { this.apellidoPaterno = apellidoPaterno; }

    public String getApellidoMaterno() { return apellidoMaterno; }
    public void setApellidoMaterno(String apellidoMaterno) { this.apellidoMaterno = apellidoMaterno; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasenaHash() { return contrasenaHash; }
    public void setContrasenaHash(String contrasenaHash) { this.contrasenaHash = contrasenaHash; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Boolean isMembresiaActiva() { return membresiaActiva; }
    public void setMembresiaActiva(Boolean membresiaActiva) { this.membresiaActiva = membresiaActiva; }

    public OffsetDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(OffsetDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Short getIdRol() { return idRol; }
    public void setIdRol(Short idRol) { this.idRol = idRol; }

    public String getPlainPassword() { return plainPassword; }
    public void setPlainPassword(String plainPassword) { this.plainPassword = plainPassword; }

}