package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.biblioteca.backend.model.Usuario;
import com.fasterxml.jackson.databind.JsonNode;
import org.mindrot.jbcrypt.BCrypt;
import java.sql.*;

public class UsuarioDao extends JdbcDao<Usuario> {
    public UsuarioDao() { super(Usuario.class, "usuario", new String[]{"id_usuario"}); }

    @Override
    public Object insert(JsonNode node) throws SQLException {
        JsonNode password = node.get("contrasena");
        if (password == null || password.isNull() || password.asText().isBlank())
            throw new SQLException("contrasena is required for user insert");
        String hash = BCrypt.hashpw(password.asText(), BCrypt.gensalt(12));
        String sql = "INSERT INTO public.usuario (numero_socio,nombres,apellido_paterno,apellido_materno,correo,contrasena_hash,telefono,membresia_activa,id_rol) "
            + "VALUES (?,?,?,?,?,?,?,?,?) RETURNING *";
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setObject(1, node.has("numero_socio") && !node.get("numero_socio").isNull() ? node.get("numero_socio").asText() : null);
            ps.setObject(2, node.get("nombres").asText());
            ps.setObject(3, node.get("apellido_paterno").asText());
            ps.setObject(4, node.has("apellido_materno") && !node.get("apellido_materno").isNull() ? node.get("apellido_materno").asText() : null);
            ps.setObject(5, node.get("correo").asText());
            ps.setObject(6, hash);
            ps.setObject(7, node.has("telefono") && !node.get("telefono").isNull() ? node.get("telefono").asText() : null);
            ps.setObject(8, node.has("membresia_activa") ? node.get("membresia_activa").asBoolean() : true);
            ps.setObject(9, (short)node.get("id_rol").asInt());
            try (ResultSet rs = ps.executeQuery()) { if (rs.next()) return map(rs); }
        }
        throw new SQLException("Insert returned no row");
    }

    @Override
    public boolean patch(JsonNode node, String... values) throws SQLException {
        if (node.has("contrasena") && !node.get("contrasena").isNull()) {
            JsonNode copy = node.deepCopy();
            ((com.fasterxml.jackson.databind.node.ObjectNode)copy).put("contrasena_hash", BCrypt.hashpw(node.get("contrasena").asText(), BCrypt.gensalt(12)));
            com.fasterxml.jackson.databind.node.ObjectNode mutable = (com.fasterxml.jackson.databind.node.ObjectNode)copy;
            mutable.remove("contrasena");
            JsonNode hashOnly = mutable;
            boolean first = super.patch(hashOnly, values);
            if (hashOnly.has("contrasena_hash")) {
                try (Connection c = Database.getConnection();
                     PreparedStatement ps = c.prepareStatement("UPDATE public.usuario SET contrasena_hash = ? WHERE id_usuario = ?")) {
                    ps.setString(1, hashOnly.get("contrasena_hash").asText()); ps.setObject(2, java.util.UUID.fromString(values[0]));
                    if (ps.executeUpdate() == 1) return true;
                }
            }
            return first;
        }
        return super.patch(node, values);
    }
}
