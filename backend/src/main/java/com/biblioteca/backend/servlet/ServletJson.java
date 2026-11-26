package com.biblioteca.backend.servlet;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

final class ServletJson {
    private ServletJson() {}
    private static final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    static String[] pathValues(HttpServletRequest req) {
        String path = req.getPathInfo();
        if (path == null || path.equals("/")) return new String[0];
        String[] parts = path.substring(1).split("/");
        return java.util.Arrays.stream(parts).filter(s -> !s.isBlank()).toArray(String[]::new);
    }

    static JsonNode readJson(HttpServletRequest req) throws IOException {
        if (req.getContentLengthLong() == 0) throw new IllegalArgumentException("JSON body is required");
        JsonNode node;
        try {
            node = mapper.readTree(req.getInputStream());
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new IllegalArgumentException("El cuerpo debe ser JSON válido.", e);
        }
        if (node == null || !node.isObject()) throw new IllegalArgumentException("JSON body must be an object");
        return node;
    }

    static void ok(HttpServletResponse res, Object body) throws IOException { send(res, 200, body); }
    static void created(HttpServletResponse res, Object body) throws IOException { send(res, 201, body); }
    static void noContent(HttpServletResponse res) throws IOException { res.setStatus(204); }
    static void send(HttpServletResponse res, int status, Object body) throws IOException {
        res.setCharacterEncoding("UTF-8"); res.setContentType("application/json"); res.setStatus(status);
        try (PrintWriter w = res.getWriter()) { mapper.writeValue(w, body); }
    }
    static void error(HttpServletResponse res, int status, String message) throws IOException {
        send(res, status, java.util.Map.of("error", message));
    }
    static void databaseError(
            HttpServletResponse res,
            SQLException exception)
            throws IOException {

        String sqlState = exception.getSQLState();
        String message = exception.getMessage();
        String diagnostic = message == null ? "" : message.toLowerCase();
        SQLException next = exception.getNextException();

        while (sqlState == null
                && next != null
                && next != exception) {
            sqlState = next.getSQLState();
            if (next.getMessage() != null) {
                diagnostic += " " + next.getMessage().toLowerCase();
            }
            next = next.getNextException();
        }

        int status;

        if ("23505".equals(sqlState)
                || "23503".equals(sqlState)
                || diagnostic.contains("23503")
                || (diagnostic.contains("violates")
                    && diagnostic.contains("foreign key"))
                || (diagnostic.contains("violates")
                    && diagnostic.contains("restrict"))) {
            status = 409;
        } else if ("42501".equals(sqlState)) {
            status = 403;
        } else if ("23502".equals(sqlState)
                || "23514".equals(sqlState)
                || (sqlState != null && sqlState.startsWith("22"))) {
            status = 400;
        } else {
            status = 500;
        }

        String response = switch (status) {
            case 409 -> "El registro tiene una referencia o un valor único en conflicto.";
            case 403 -> "Operación sin permiso.";
            case 400 -> "Los datos no cumplen las restricciones.";
            default -> "Error de base de datos.";
        };
        error(res, status, response);
    }
}
