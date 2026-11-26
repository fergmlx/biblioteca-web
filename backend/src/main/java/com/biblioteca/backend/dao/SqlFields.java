package com.biblioteca.backend.dao;

import com.fasterxml.jackson.databind.JsonNode;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.*;
import java.util.*;

/** Columnas permitidas por el DAO. Un campo ausente conserva el valor por defecto de PostgreSQL. */
final class SqlFields {
    private final JsonNode body;
    private final Map<String, Object> values = new LinkedHashMap<>();

    SqlFields(JsonNode body) { this.body = body; }

    void add(String column, String property, Class<?> type) {
        JsonNode value = body.has(column) ? body.get(column) : body.get(property);
        if (value == null) return;
        if (value.isNull()) {
            put(column, null);
            return;
        }
        String text = value.asText();
        try {
            Object parsed;
            if (type == UUID.class) parsed = UUID.fromString(text);
            else if (type == Short.class) parsed = Short.valueOf(text);
            else if (type == Boolean.class) {
                if (!text.equalsIgnoreCase("true") && !text.equalsIgnoreCase("false")) {
                    throw new IllegalArgumentException();
                }
                parsed = Boolean.valueOf(text);
            }
            else if (type == LocalDate.class) parsed = LocalDate.parse(text);
            else if (type == LocalTime.class) parsed = LocalTime.parse(text);
            else if (type == OffsetDateTime.class) parsed = OffsetDateTime.parse(text);
            else parsed = text;
            put(column, parsed);
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Valor inválido para " + column, e);
        }
    }

    void put(String column, Object value) { values.put(column, value); }
    boolean isEmpty() { return values.isEmpty(); }
    String columns() { return String.join(", ", values.keySet()); }
    String placeholders() { return String.join(", ", Collections.nCopies(values.size(), "?")); }
    String assignments() { return String.join(" = ?, ", values.keySet()) + " = ?"; }

    int bind(PreparedStatement statement) throws SQLException {
        int index = 1;
        for (Object value : values.values()) statement.setObject(index++, value);
        return index;
    }
}
