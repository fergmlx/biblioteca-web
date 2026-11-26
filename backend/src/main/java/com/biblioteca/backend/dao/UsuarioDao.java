package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Usuario;
import com.fasterxml.jackson.databind.JsonNode;
import java.sql.*;
import java.util.*;
import java.time.OffsetDateTime;
import com.biblioteca.backend.security.PasswordHash;

public final class UsuarioDao {
    private static final String WHERE_KEY = " WHERE id_usuario = ?";

    public List<Usuario> findAll() throws SQLException {
        List<Usuario> rows = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.usuario");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) rows.add(map(rs));
        }
        return rows;
    }

    public Optional<Usuario> findById(String... keys) throws SQLException {
        if (keys.length != 1) return Optional.empty();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public.usuario" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public Usuario insert(JsonNode body) throws SQLException {
        SqlFields fields = fields(body, true);
        if (fields.isEmpty()) throw new IllegalArgumentException("Se requieren campos para crear el registro.");
        String sql = "INSERT INTO public.usuario (" + fields.columns()
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
        String sql = "UPDATE public.usuario SET " + fields.assignments() + WHERE_KEY;
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
             PreparedStatement ps = c.prepareStatement("DELETE FROM public.usuario" + WHERE_KEY)) {
            bindKey(ps, 1, keys);
            return ps.executeUpdate() == 1;
        }
    }

    private static void bindKey(PreparedStatement ps, int start, String[] keys) throws SQLException {
        ps.setObject(start, UUID.fromString(keys[0]));
    }

    private static SqlFields fields(JsonNode body, boolean inserting) {
        SqlFields fields = new SqlFields(body);
        if (inserting && (body.hasNonNull("id_usuario") || body.hasNonNull("idUsuario"))) {
            fields.add("id_usuario", "idUsuario", UUID.class);
        }
        fields.add("numero_socio", "numeroSocio", String.class);
        fields.add("nombres", "nombres", String.class);
        fields.add("apellido_paterno", "apellidoPaterno", String.class);
        fields.add("apellido_materno", "apellidoMaterno", String.class);
        fields.add("correo", "correo", String.class);
        fields.add("telefono", "telefono", String.class);
        fields.add("membresia_activa", "membresiaActiva", Boolean.class);
        fields.add("fecha_registro", "fechaRegistro", OffsetDateTime.class);
        fields.add("id_rol", "idRol", Short.class);
        if (inserting || body.has("contrasena")) {
            JsonNode password = body.get("contrasena");
            if (password == null || !password.isTextual()) {
                throw new IllegalArgumentException("Se requiere una contraseña.");
            }
            fields.put("contrasena_hash", PasswordHash.create(password.textValue()));
        }
        return fields;
    }

    private static Usuario map(ResultSet rs) throws SQLException {
        Usuario row = new Usuario();
        row.setIdUsuario(rs.getObject("id_usuario", UUID.class));
        row.setNumeroSocio(rs.getString("numero_socio"));
        row.setNombres(rs.getString("nombres"));
        row.setApellidoPaterno(rs.getString("apellido_paterno"));
        row.setApellidoMaterno(rs.getString("apellido_materno"));
        row.setCorreo(rs.getString("correo"));
        row.setTelefono(rs.getString("telefono"));
        row.setMembresiaActiva(rs.getObject("membresia_activa", Boolean.class));
        row.setFechaRegistro(rs.getObject("fecha_registro", OffsetDateTime.class));
        row.setIdRol(rs.getObject("id_rol", Short.class));
        return row;
    }
}
