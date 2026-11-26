package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.InscripcionCirculo;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;

public final class InscripcionCirculoDao {
    private static final String WHERE_KEY = " WHERE id_inscripcion = ?";

    public List<InscripcionCirculo> findAll() throws SQLException {
        List<InscripcionCirculo> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.inscripcion_circulo");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<InscripcionCirculo> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.inscripcion_circulo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public InscripcionCirculo insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.inscripcion_circulo (" + fields.columns()
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
        String sql = "UPDATE public.inscripcion_circulo SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.inscripcion_circulo" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_inscripcion") || body.hasNonNull("idInscripcion"))) {
            fields.add("id_inscripcion", "idInscripcion", UUID.class);
        }
        fields.add("fecha_inscripcion", "fechaInscripcion", OffsetDateTime.class);
        fields.add("fecha_baja", "fechaBaja", OffsetDateTime.class);
        fields.add("id_usuario", "idUsuario", UUID.class);
        fields.add("id_circulo", "idCirculo", UUID.class);
        fields.add("es_excepcion_cupo", "esExcepcionCupo", Boolean.class);
        fields.add("motivo_excepcion", "motivoExcepcion", String.class);
        fields.add("id_usuario_autoriza", "idUsuarioAutoriza", UUID.class);
        return fields;
    }

    private static InscripcionCirculo map(ResultSet rs) throws SQLException {
        InscripcionCirculo row = new InscripcionCirculo();
        row.setIdInscripcion(rs.getObject("id_inscripcion", UUID.class));
        row.setFechaInscripcion(rs.getObject("fecha_inscripcion", OffsetDateTime.class));
        row.setFechaBaja(rs.getObject("fecha_baja", OffsetDateTime.class));
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setIdCirculo(rs.getObject("id_circulo", UUID.class));
        row.setEsExcepcionCupo(rs.getObject("es_excepcion_cupo", Boolean.class));
        row.setMotivoExcepcion(rs.getString("motivo_excepcion"));
        row.setIdUsuarioAutoriza(rs.getObject("id_usuario_autoriza", UUID.class));
        return row;
    }
}
