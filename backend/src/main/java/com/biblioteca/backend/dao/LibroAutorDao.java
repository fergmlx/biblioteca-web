package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.LibroAutor;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;

public final class LibroAutorDao {
    private static final String WHERE_KEY = " WHERE id_libro = ? AND id_autor = ? AND id_tipo_participacion = ?";

    public List<LibroAutor> findAll() throws SQLException {
        List<LibroAutor> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.libro_autor");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<LibroAutor> findById(String... keys) throws SQLException {
        if (keys.length != 3) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.libro_autor" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public LibroAutor insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.libro_autor (" + fields.columns()
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
        if (keys.length != 3) return false;
        SqlFields fields = fields(body, false);
        if (fields.isEmpty()) return false;
        String sql = "UPDATE public.libro_autor SET " + fields.assignments() + WHERE_KEY;
        try (Connection c = Database.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            bindKey(ps, fields.bind(ps), keys);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean update(JsonNode body, String... keys) throws SQLException {
        return patch(body, keys);
    }

    public boolean delete(String... keys) throws SQLException {
        if (keys.length != 3) return false;
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.libro_autor" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
        ps.setObject(start + 1, UUID.fromString(keys[1]));
        ps.setObject(start + 2, Short.valueOf(keys[2]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting) {
            fields.add("id_libro", "idLibro", UUID.class);
        }
        if (inserting) {
            fields.add("id_autor", "idAutor", UUID.class);
        }
        if (inserting) {
            fields.add("id_tipo_participacion", "idTipoParticipacion", Short.class);
        }
        return fields;
    }

    private static LibroAutor map(ResultSet rs) throws SQLException {
        LibroAutor row = new LibroAutor();
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setIdAutor(rs.getObject("id_autor", UUID.class));
        row.setIdTipoParticipacion(rs.getObject("id_tipo_participacion", Short.class));
        return row;
    }
}
