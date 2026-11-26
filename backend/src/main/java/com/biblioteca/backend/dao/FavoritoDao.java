package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Favorito;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class FavoritoDao {
    private static final String WHERE_KEY = " WHERE id_usuario = ? AND id_libro = ?";

    public List<Favorito> findAll() throws SQLException {
        List<Favorito> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.favorito");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Favorito> findById(String... keys) throws SQLException {
        if (keys.length != 2) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.favorito" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Favorito insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.favorito (" + fields.columns()
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
        String sql = "UPDATE public.favorito SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.favorito" + WHERE_KEY)) {
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
        fields.add("fecha_agregado", "fechaAgregado", OffsetDateTime.class);
        return fields;
    }

    private static Favorito map(ResultSet rs) throws SQLException {
        Favorito row = new Favorito();
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setFechaAgregado(rs.getObject("fecha_agregado", OffsetDateTime.class));
        return row;
    }
}
