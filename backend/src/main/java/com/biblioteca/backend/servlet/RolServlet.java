package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.RolDao;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import static com.biblioteca.backend.servlet.ServletJson.*;

@WebServlet(urlPatterns = {"/api/roles", "/api/roles/*"})
public final class RolServlet extends HttpServlet {
    private final RolDao dao = new RolDao();

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        try {
            String[] keys = pathValues(req);
            if (keys.length == 0) ok(res, dao.findAll());
            else {
                var item = dao.findById(keys);
                if (item.isPresent()) ok(res, item.get());
                else error(res, 404, "Resource not found");
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
        if (keys.length != 1) {
            error(res, 400, "Identificador incompleto o inválido.");
            return;
        }
        try {
            JsonNode body = readJson(req);
            boolean found = dao.findById(keys).isPresent();
            if (found) {
                if (dao.update(body, keys)) ok(res, dao.findById(keys).orElse(null));
                else error(res, 404, "Resource not found");
            } else {
                var record = (com.fasterxml.jackson.databind.node.ObjectNode) body;
                record.put("id_rol", keys[0]);
                created(res, dao.insert(record));
            }
        } catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doPatch(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String[] keys = pathValues(req);
        if (keys.length != 1) {
            error(res, 400, "Identificador incompleto o inválido.");
            return;
        }
        try {
            if (dao.patch(readJson(req), keys)) ok(res, dao.findById(keys).orElse(null));
            else error(res, 404, "Resource not found or no patch fields supplied");
        } catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }

    @Override
    public void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        String[] keys = pathValues(req);
        if (keys.length != 1) {
            error(res, 400, "Identificador incompleto o inválido.");
            return;
        }
        try { if (dao.delete(keys)) noContent(res); else error(res, 404, "Resource not found"); }
        catch (SQLException e) { databaseError(res, e); }
        catch (IllegalArgumentException e) { error(res, 400, e.getMessage()); }
    }
}
