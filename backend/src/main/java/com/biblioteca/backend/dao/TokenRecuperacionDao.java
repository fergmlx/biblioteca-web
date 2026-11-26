package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.TokenRecuperacion;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class TokenRecuperacionDao {
    private static final String WHERE_KEY = " WHERE id_token = ?";

    public List<TokenRecuperacion> findAll() throws SQLException {
        List<TokenRecuperacion> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.token_recuperacion");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<TokenRecuperacion> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.token_recuperacion" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public TokenRecuperacion insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.token_recuperacion (" + fields.columns()
            + ") VALUES (" + fields.placeholders() + ") RETURNING *";
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            fields.bind(ps);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return map(rs);
                throw new SQLException("La inserción no devolvió un registro.");
            }
        }
    }

    public boolean patch(JsonNode body, String... keys) throws SQLException {
        if (keys.length != 1) return false;
        SqlFields fields = fields(body, false);
        if (fields.isEmpty()) return false;
        String sql = "UPDATE public.token_recuperacion SET " + fields.assignments() + WHERE_KEY;
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            bindKey(ps, fields.bind(ps), keys);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean update(JsonNode body, String... keys) throws SQLException {
        return patch(body, keys);
    }

    public boolean delete(String... keys) throws SQLException {
        if (keys.length != 1) return false;
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.token_recuperacion" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_token") || body.hasNonNull("idToken"))) {
            fields.add("id_token", "idToken", UUID.class);
        }
        fields.add("id_usuario", "idUsuario", UUID.class);
        fields.add("token_hash", "tokenHash", String.class);
        fields.add("fecha_creacion", "fechaCreacion", OffsetDateTime.class);
        fields.add("fecha_expiracion", "fechaExpiracion", OffsetDateTime.class);
        fields.add("fecha_uso", "fechaUso", OffsetDateTime.class);
        return fields;
    }

    private static TokenRecuperacion map(ResultSet rs) throws SQLException {
        TokenRecuperacion row = new TokenRecuperacion();
        row.setIdToken(rs.getObject("id_token", UUID.class));
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setTokenHash(rs.getString("token_hash"));
        row.setFechaCreacion(rs.getObject("fecha_creacion", OffsetDateTime.class));
        row.setFechaExpiracion(rs.getObject("fecha_expiracion", OffsetDateTime.class));
        row.setFechaUso(rs.getObject("fecha_uso", OffsetDateTime.class));
        return row;
    }
}
