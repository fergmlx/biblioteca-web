package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Genero;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;

public final class GeneroDao {
    private static final String WHERE_KEY = " WHERE id_genero = ?";

    public List<Genero> findAll() throws SQLException {
        List<Genero> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.genero");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Genero> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.genero" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Genero insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.genero (" + fields.columns()
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
        String sql = "UPDATE public.genero SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.genero" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, Short.valueOf(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_genero") || body.hasNonNull("idGenero"))) {
            fields.add("id_genero", "idGenero", Short.class);
        }
        fields.add("nombre", "nombre", String.class);
        return fields;
    }

    private static Genero map(ResultSet rs) throws SQLException {
        Genero row = new Genero();
        row.setIdGenero(rs.getObject("id_genero", Short.class));
        row.setNombre(rs.getString("nombre"));
        return row;
    }
}
