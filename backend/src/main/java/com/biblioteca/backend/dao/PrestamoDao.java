package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Prestamo;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class PrestamoDao {
    private static final String WHERE_KEY = " WHERE id_prestamo = ?";

    public List<Prestamo> findAll() throws SQLException {
        List<Prestamo> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.prestamo");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Prestamo> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.prestamo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Prestamo insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.prestamo (" + fields.columns()
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
        String sql = "UPDATE public.prestamo SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.prestamo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_prestamo") || body.hasNonNull("idPrestamo"))) {
            fields.add("id_prestamo", "idPrestamo", UUID.class);
        }
        fields.add("id_solicitud", "idSolicitud", UUID.class);
        fields.add("fecha_prestamo", "fechaPrestamo", OffsetDateTime.class);
        fields.add("fecha_limite", "fechaLimite", OffsetDateTime.class);
        fields.add("fecha_devolucion", "fechaDevolucion", OffsetDateTime.class);
        fields.add("id_estado_prestamo", "idEstadoPrestamo", Short.class);
        fields.add("id_usuario", "idUsuario", UUID.class);
        fields.add("id_libro", "idLibro", UUID.class);
        fields.add("num_ejemplar", "numEjemplar", Short.class);
        return fields;
    }

    private static Prestamo map(ResultSet rs) throws SQLException {
        Prestamo row = new Prestamo();
        row.setIdPrestamo(rs.getObject("id_prestamo", UUID.class));
        row.setIdSolicitud(rs.getObject("id_solicitud", UUID.class));
        row.setFechaPrestamo(rs.getObject("fecha_prestamo", OffsetDateTime.class));
        row.setFechaLimite(rs.getObject("fecha_limite", OffsetDateTime.class));
        row.setFechaDevolucion(rs.getObject("fecha_devolucion", OffsetDateTime.class));
        row.setIdEstadoPrestamo(rs.getObject("id_estado_prestamo", Short.class));
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setNumEjemplar(rs.getObject("num_ejemplar", Short.class));
        return row;
    }
}
