package com.biblioteca.backend.dao;

import com.biblioteca.backend.config.Database;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.*;
import java.time.*;
import java.util.*;
import org.postgresql.util.PGobject;

public abstract class JdbcDao<T> {
    protected final Class<T> type;
    protected final String table;
    protected final String[] keys;
    protected final ObjectMapper mapper;

    protected JdbcDao(Class<T> type, String table, String[] keys) {
        this.type = type;
        this.table = table;
        this.keys = keys;
        this.mapper = new ObjectMapper().registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public List<T> findAll() throws SQLException {
        List<T> result = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public." + table);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) result.add(map(rs));
        }
        return result;
    }

    public Optional<T> findById(String... values) throws SQLException {
        if (values.length != keys.length) return Optional.empty();
        String where = String.join(" AND ", Arrays.stream(keys).map(k -> k + " = ?").toList());
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM public." + table + " WHERE " + where)) {
            bindKeys(ps, values);
            try (ResultSet rs = ps.executeQuery()) { return rs.next() ? Optional.of(map(rs)) : Optional.empty(); }
        }
    }

    public Object insert(JsonNode node) throws SQLException {
        List<String> columns = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        for (Field f : type.getDeclaredFields()) {
            String column = snake(f.getName());
            if (f.getName().equals("plainPassword") || f.getName().equals("contrasenaHash") && !node.has(column)) continue;
            if (isGeneratedKey(column) && (!node.has(column) || node.get(column).isNull())) continue;
            if (node.has(column)) {
                columns.add(column); values.add(convert(node.get(column), f.getType()));
            }
        }
        if (columns.isEmpty()) throw new SQLException("No insert fields supplied");
        String placeholders = String.join(",", Collections.nCopies(columns.size(), "?"));
        String sql = "INSERT INTO public." + table + " (" + String.join(",", columns) + ") VALUES (" + placeholders + ") RETURNING *";
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            for (int i = 0; i < values.size(); i++) ps.setObject(i + 1, values.get(i));
            try (ResultSet rs = ps.executeQuery()) { if (rs.next()) return map(rs); }
        }
        throw new SQLException("Insert returned no row");
    }

    public boolean patch(JsonNode node, String... values) throws SQLException {
        if (values.length != keys.length) return false;
        List<String> set = new ArrayList<>();
        List<Object> params = new ArrayList<>();
        for (Field f : type.getDeclaredFields()) {
            String column = snake(f.getName());
            if (Arrays.asList(keys).contains(column) || f.getName().equals("plainPassword") || f.getName().equals("contrasenaHash")) continue;
            if (node.has(column) || node.has(f.getName())) {
                JsonNode v = node.has(column) ? node.get(column) : node.get(f.getName());
                set.add(column + " = ?");
                params.add(v.isNull() ? null : convert(v, f.getType()));
            }
        }
        if (set.isEmpty()) return false;
        String where = String.join(" AND ", Arrays.stream(keys).map(k -> k + " = ?").toList());
        String sql = "UPDATE public." + table + " SET " + String.join(",", set) + " WHERE " + where;
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            int i = 1;
            for (Object v : params) { ps.setObject(i++, v); }
            bindKeys(ps, values, i);
            return ps.executeUpdate() == 1;
        }
    }

    public boolean update(JsonNode node, String... values) throws SQLException {
        return patch(node, values);
    }

    public boolean delete(String... values) throws SQLException {
        if (values.length != keys.length) return false;
        String where = String.join(" AND ", Arrays.stream(keys).map(k -> k + " = ?").toList());
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM public." + table + " WHERE " + where)) {
            bindKeys(ps, values);
            return ps.executeUpdate() == 1;
        }
    }

    protected boolean isGeneratedKey(String column) {
        return (Arrays.asList(keys).contains(column) && !table.equals("libro_autor") && !table.equals("libro_genero")
            && !table.equals("ejemplar") && !table.equals("favorito") && !table.equals("resena"));
    }

    protected Object convert(JsonNode node, Class<?> javaType) {
        if (node.isNull()) return null;
        if (javaType == UUID.class) return UUID.fromString(node.asText());
        if (javaType == Short.class) return (short)node.asInt();
        if (javaType == Boolean.class) return node.asBoolean();
        if (javaType == Integer.class) return node.asInt();
        if (javaType == Long.class) return node.asLong();
        if (javaType == Double.class) return node.asDouble();
        if (javaType == LocalDate.class) return LocalDate.parse(node.asText());
        if (javaType == LocalTime.class) return LocalTime.parse(node.asText());
        if (javaType == OffsetDateTime.class) return OffsetDateTime.parse(node.asText());
        return node.asText();
    }

    protected void bindKeys(PreparedStatement ps, String[] values) throws SQLException { bindKeys(ps, values, 1); }
    protected void bindKeys(PreparedStatement ps, String[] values, int start) throws SQLException {
        for (int i = 0; i < values.length; i++) {
            String key = keys[i];
            boolean uuidKey = key.equals("id_usuario") || key.equals("id_libro")
                || key.equals("id_circulo") || key.equals("id_solicitud")
                || key.equals("id_prestamo") || key.equals("id_inscripcion")
                || key.equals("id_autor") || key.equals("id_token");
            Object v = uuidKey ? UUID.fromString(values[i]) : Short.valueOf(values[i]);
            ps.setObject(start + i, v);
        }
    }

    protected String snake(String name) {
        return name.replaceAll("([a-z0-9])([A-Z])", "$1_$2").toLowerCase();
    }

    protected T map(ResultSet rs) throws SQLException {
        try {
            T bean = type.getDeclaredConstructor().newInstance();
            ResultSetMetaData md = rs.getMetaData();
            for (int i = 1; i <= md.getColumnCount(); i++) {
                String column = md.getColumnLabel(i).toLowerCase();
                String fieldName = camel(column);
                try {
                    Field f = type.getDeclaredField(fieldName);
                    f.setAccessible(true);
                    Object v = rs.getObject(i);
                    f.set(bean, normalize(v, f.getType()));
                } catch (NoSuchFieldException ignored) {
                }
            }
            return bean;
        } catch (ReflectiveOperationException e) { throw new SQLException("Cannot map " + type.getSimpleName(), e); }
    }

    protected Object normalize(Object v, Class<?> javaType) {
        if (v == null) return null;
        if (v instanceof PGobject pgObject) {
            String value = pgObject.getValue();
            if (javaType == String.class) return value;
            if (javaType == UUID.class && value != null) return UUID.fromString(value);
            if (javaType == Short.class && value != null) return Short.valueOf(value);
            if (javaType == Boolean.class && value != null) return Boolean.valueOf(value);
            if (javaType == LocalDate.class && value != null) return LocalDate.parse(value);
            if (javaType == LocalTime.class && value != null) return LocalTime.parse(value);
            if (javaType == OffsetDateTime.class && value != null) return OffsetDateTime.parse(value);
            return value;
        }
        if (javaType == OffsetDateTime.class && v instanceof java.time.OffsetDateTime od) return od;
        if (javaType == OffsetDateTime.class && v instanceof java.time.Instant inst) return inst.atOffset(ZoneOffset.UTC);
        if (javaType == OffsetDateTime.class && v instanceof java.sql.Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        if (javaType == LocalDate.class && v instanceof java.sql.Date d) return d.toLocalDate();
        if (javaType == LocalTime.class && v instanceof java.sql.Time t) return t.toLocalTime();
        if (javaType == Short.class && v instanceof Number n) return n.shortValue();
        if (javaType == UUID.class && v instanceof String s) return UUID.fromString(s);
        return v;
    }

    protected String camel(String column) {
        StringBuilder out = new StringBuilder();
        boolean upper = false;
        for (char c : column.toCharArray()) {
            if (c == '_') upper = true;
            else { out.append(upper ? Character.toUpperCase(c) : c); upper = false; }
        }
        return out.toString();
    }
}