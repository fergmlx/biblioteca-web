package com.biblioteca.backend.model;

import java.time.OffsetDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenRecuperacion {
    private UUID idToken;
    private UUID idUsuario;
    private String tokenHash;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaExpiracion;
    private OffsetDateTime fechaUso;

    public TokenRecuperacion() {}

    public UUID getIdToken() { return idToken; }
    public void setIdToken(UUID idToken) { this.idToken = idToken; }

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public OffsetDateTime getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(OffsetDateTime fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public OffsetDateTime getFechaUso() { return fechaUso; }
    public void setFechaUso(OffsetDateTime fechaUso) { this.fechaUso = fechaUso; }

}