package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.SolicitudPrestamo;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class SolicitudPrestamoDao {
    private static final String WHERE_KEY = " WHERE id_solicitud = ?";

    public List<SolicitudPrestamo> findAll() throws SQLException {
        List<SolicitudPrestamo> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.solicitud_prestamo");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<SolicitudPrestamo> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.solicitud_prestamo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public SolicitudPrestamo insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.solicitud_prestamo (" + fields.columns()
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
        String sql = "UPDATE public.solicitud_prestamo SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.solicitud_prestamo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_solicitud") || body.hasNonNull("idSolicitud"))) {
            fields.add("id_solicitud", "idSolicitud", UUID.class);
        }
        fields.add("id_usuario", "idUsuario", UUID.class);
        fields.add("id_libro", "idLibro", UUID.class);
        fields.add("fecha_solicitud", "fechaSolicitud", OffsetDateTime.class);
        fields.add("fecha_respuesta", "fechaRespuesta", OffsetDateTime.class);
        fields.add("estado", "estado", String.class);
        fields.add("observaciones", "observaciones", String.class);
        return fields;
    }

    private static SolicitudPrestamo map(ResultSet rs) throws SQLException {
        SolicitudPrestamo row = new SolicitudPrestamo();
        row.setIdSolicitud(rs.getObject("id_solicitud", UUID.class));
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setIdLibro(rs.getObject("id_libro", UUID.class));
        row.setFechaSolicitud(rs.getObject("fecha_solicitud", OffsetDateTime.class));
        row.setFechaRespuesta(rs.getObject("fecha_respuesta", OffsetDateTime.class));
        row.setEstado(rs.getString("estado"));
        row.setObservaciones(rs.getString("observaciones"));
        return row;
    }
}
