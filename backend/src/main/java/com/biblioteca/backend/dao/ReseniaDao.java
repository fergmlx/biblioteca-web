package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Resenia;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class ReseniaDao {
    private static final String WHERE_KEY = " WHERE id_usuario = ? AND id_libro = ?";

    public List<Resenia> findAll() throws SQLException {
        List<Resenia> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.resena");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Resenia> findById(String... keys) throws SQLException {
        if (keys.length != 2) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.resena" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Resenia insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.resena (" + fields.columns()
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
        if (keys.length != 2) return false;
        SqlFields fields = fields(body, false);
        if (fields.isEmpty()) return false;
        String sql = "UPDATE public.resena SET " + fields.assignments() + WHERE_KEY;
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            bindKey(ps, fields.bind(ps), keys);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean update(JsonNode body, String... keys) throws SQLException {
        return patch(body, keys);
    }

    public boolean delete(String... keys) throws SQLException {
        if (keys.length != 2) return false;
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.resena" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
        ps.setObject(start + 1, UUID.fromString(keys[1]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting) {
            fields.add("id_usuario", "idUsuario", UUID.class);
        }
        if (inserting) {
            fields.add("id_libro", "idLibro", UUID.class);
        }
        fields.add("calificacion", "calificacion", Short.class);
        fields.add("comentario", "comentario", String.class);
        fields.add("fecha", "fecha", OffsetDateTime.class);
        return fields;
    }

    private static Resenia map(ResultSet rs) throws SQLException {
        Resenia row = new Resenia();
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setCalificacion(rs.getObject("calificacion", Short.class));
        row.setComentario(rs.getString("comentario"));
        row.setFecha(rs.getObject("fecha", OffsetDateTime.class));
        return row;
    }
}
