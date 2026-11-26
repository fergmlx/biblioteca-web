package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Autor;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.LocalDate;

public final class AutorDao {
    private static final String WHERE_KEY = " WHERE id_autor = ?";

    public List<Autor> findAll() throws SQLException {
        List<Autor> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.autor");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Autor> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.autor" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Autor insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.autor (" + fields.columns()
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
        String sql = "UPDATE public.autor SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.autor" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_autor") || body.hasNonNull("idAutor"))) {
            fields.add("id_autor", "idAutor", UUID.class);
        }
        fields.add("nombres", "nombres", String.class);
        fields.add("apellido_paterno", "apellidoPaterno", String.class);
        fields.add("apellido_materno", "apellidoMaterno", String.class);
        fields.add("id_pais", "idPais", Short.class);
        fields.add("ruta_imagen", "rutaImagen", String.class);
        fields.add("fecha_nacimiento", "fechaNacimiento", LocalDate.class);
        fields.add("fecha_fallecimiento", "fechaFallecimiento", LocalDate.class);
        fields.add("biografia", "biografia", String.class);
        return fields;
    }

    private static Autor map(ResultSet rs) throws SQLException {
        Autor row = new Autor();
        row.setIdAutor(rs.getObject("id_autor", UUID.class));
        row.setNombres(rs.getString("nombres"));
        row.setApellidoPaterno(rs.getString("apellido_paterno"));
        row.setApellidoMaterno(rs.getString("apellido_materno"));
        row.setIdPais(rs.getObject("id_pais", Short.class));
        row.setRutaImagen(rs.getString("ruta_imagen"));
        row.setFechaNacimiento(rs.getObject("fecha_nacimiento", LocalDate.class));
        row.setFechaFallecimiento(rs.getObject("fecha_fallecimiento", LocalDate.class));
        row.setBiografia(rs.getString("biografia"));
        return row;
    }
}
