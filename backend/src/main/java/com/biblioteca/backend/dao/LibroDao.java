package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Libro;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;

public final class LibroDao {
    private static final String WHERE_KEY = " WHERE id_libro = ?";

    public List<Libro> findAll() throws SQLException {
        List<Libro> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.libro");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Libro> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.libro" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Libro insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.libro (" + fields.columns()
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
        String sql = "UPDATE public.libro SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.libro" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_libro") || body.hasNonNull("idLibro"))) {
            fields.add("id_libro", "idLibro", UUID.class);
        }
        fields.add("isbn", "isbn", String.class);
        fields.add("titulo", "titulo", String.class);
        fields.add("editorial", "editorial", String.class);
        fields.add("anio_publicacion", "anioPublicacion", Short.class);
        fields.add("idioma", "idioma", String.class);
        fields.add("sinopsis", "sinopsis", String.class);
        fields.add("ruta_portada", "rutaPortada", String.class);
        return fields;
    }

    private static Libro map(ResultSet rs) throws SQLException {
        Libro row = new Libro();
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setIsbn(rs.getString("isbn"));
        row.setTitulo(rs.getString("titulo"));
        row.setEditorial(rs.getString("editorial"));
        row.setAnioPublicacion(rs.getObject("anio_publicacion", Short.class));
        row.setIdioma(rs.getString("idioma"));
        row.setSinopsis(rs.getString("sinopsis"));
        row.setRutaPortada(rs.getString("ruta_portada"));
        return row;
    }
}
