package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.CirculoLectura;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.LocalDate;
import java.time.LocalTime;

public final class CirculoLecturaDao {
    private static final String WHERE_KEY = " WHERE id_circulo = ?";

    public List<CirculoLectura> findAll() throws SQLException {
        List<CirculoLectura> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.circulo_lectura");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<CirculoLectura> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.circulo_lectura" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public CirculoLectura insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.circulo_lectura (" + fields.columns()
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
        String sql = "UPDATE public.circulo_lectura SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.circulo_lectura" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_circulo") || body.hasNonNull("idCirculo"))) {
            fields.add("id_circulo", "idCirculo", UUID.class);
        }
        fields.add("nombre", "nombre", String.class);
        fields.add("descripcion", "descripcion", String.class);
        fields.add("tema", "tema", String.class);
        fields.add("dia_semana", "diaSemana", String.class);
        fields.add("hora", "hora", LocalTime.class);
        fields.add("cupo_maximo", "cupoMaximo", Short.class);
        fields.add("fecha_inicio", "fechaInicio", LocalDate.class);
        fields.add("fecha_fin", "fechaFin", LocalDate.class);
        fields.add("id_libro", "idLibro", UUID.class);
        return fields;
    }

    private static CirculoLectura map(ResultSet rs) throws SQLException {
        CirculoLectura row = new CirculoLectura();
        row.setIdCirculo(rs.getObject("id_circulo", UUID.class));
        row.setNombre(rs.getString("nombre"));
        row.setDescripcion(rs.getString("descripcion"));
        row.setTema(rs.getString("tema"));
        row.setDiaSemana(rs.getString("dia_semana"));
        row.setHora(rs.getObject("hora", LocalTime.class));
        row.setCupoMaximo(rs.getObject("cupo_maximo", Short.class));
        row.setFechaInicio(rs.getObject("fecha_inicio", LocalDate.class));
        row.setFechaFin(rs.getObject("fecha_fin", LocalDate.class));
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        return row;
    }
}
