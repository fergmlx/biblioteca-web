package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Ejemplar;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;

public final class EjemplarDao {
    private static final String WHERE_KEY = " WHERE id_libro = ? AND num_ejemplar = ?";

    public List<Ejemplar> findAll() throws SQLException {
        List<Ejemplar> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.ejemplar");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Ejemplar> findById(String... keys) throws SQLException {
        if (keys.length != 2) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.ejemplar" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Ejemplar insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.ejemplar (" + fields.columns()
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
        String sql = "UPDATE public.ejemplar SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.ejemplar" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
        ps.setObject(start + 1, Short.valueOf(keys[1]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting) {
            fields.add("id_libro", "idLibro", UUID.class);
        }
        if (inserting) {
            fields.add("num_ejemplar", "numEjemplar", Short.class);
        }
        fields.add("codigo_inventario", "codigoInventario", String.class);
        fields.add("ubicacion", "ubicacion", String.class);
        fields.add("id_condicion_ejemplar", "idCondicionEjemplar", Short.class);
        return fields;
    }

    private static Ejemplar map(ResultSet rs) throws SQLException {
        Ejemplar row = new Ejemplar();
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setNumEjemplar(rs.getObject("num_ejemplar", Short.class));
        row.setCodigoInventario(rs.getString("codigo_inventario"));
        row.setUbicacion(rs.getString("ubicacion"));
        row.setIdCondicionEjemplar(rs.getObject("id_condicion_ejemplar", Short.class));
        return row;
    }
}
