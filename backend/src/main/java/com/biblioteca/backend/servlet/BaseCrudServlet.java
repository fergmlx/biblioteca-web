package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.JdbcDao;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

public abstract class BaseCrudServlet extends HttpServlet {
    protected final ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    protected final JdbcDao<?> dao;

    protected BaseCrudServlet(JdbcDao<?> dao) { this.dao = dao; }

    protected String[] pathValues(HttpServletRequest req) {
        String path = req.getPathInfo();
        if (path == null || path.equals("/")) return new String[0];
        String[] parts = path.substring(1).split("/");
        return java.util.Arrays.stream(parts).filter(s -> !s.isBlank()).toArray(String[]::new);
    }

    protected JsonNode readJson(HttpServletRequest req) throws IOException {
        if (req.getContentLengthLong() == 0) throw new IOException("JSON body is required");
        JsonNode node = mapper.readTree(req.getInputStream());
        if (node == null || !node.isObject()) throw new IOException("JSON body must be an object");
        return node;
    }

    protected void ok(HttpServletResponse res, Object body) throws IOException { send(res, 200, body); }
    protected void created(HttpServletResponse res, Object body) throws IOException { send(res, 201, body); }
    protected void noContent(HttpServletResponse res) throws IOException { res.setStatus(204); }
    protected void send(HttpServletResponse res, int status, Object body) throws IOException {
        res.setCharacterEncoding("UTF-8"); res.setContentType("application/json"); res.setStatus(status);
        try (PrintWriter w = res.getWriter()) { mapper.writeValue(w, body); }
    }
    protected void error(HttpServletResponse res, int status, String message) throws IOException {
        send(res, status, java.util.Map.of("error", message));
    }
    protected void databaseError(
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
                || "22P02".equals(sqlState)) {
            status = 400;
        } else {
            status = 500;
        }

        error(res, status,
            exception.getMessage() == null
                ? "Database operation failed"
                : exception.getMessage());
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            String[] keys = pathValues(req);
            if (keys.length == 0) ok(res, dao.findAll());
            else {
                var item = dao.findById(keys);
                if (item.isPresent()) ok(res, item.get()); else error(res, 404, "Resource not found");
            }
        } catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try { created(res, dao.insert(readJson(req))); }
        catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String[] keys = pathValues(req);
        if (keys.length == 0) { error(res, 400, "An identifier path is required"); return; }
        try {
            JsonNode body = readJson(req);
            boolean found = dao.findById(keys).isPresent();
            if (found) { if (dao.update(body, keys)) ok(res, dao.findById(keys).orElse(null)); else error(res, 404, "Resource not found"); }
            else created(res, dao.insert(body));
        } catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doPatch(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String[] keys = pathValues(req);
        if (keys.length == 0) { error(res, 400, "An identifier path is required"); return; }
        try {
            if (dao.patch(readJson(req), keys)) ok(res, dao.findById(keys).orElse(null));
            else error(res, 404, "Resource not found or no patch fields supplied");
        } catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String[] keys = pathValues(req);
        if (keys.length == 0) { error(res, 400, "An identifier path is required"); return; }
        try { if (dao.delete(keys)) noContent(res); else error(res, 404, "Resource not found"); }
        catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }
}
