package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.SolicitudPrestamoDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/solicitudes-prestamo", "/api/solicitudes-prestamo/*"})
public class SolicitudPrestamoServlet extends BaseCrudServlet {
    public SolicitudPrestamoServlet() { super(new SolicitudPrestamoDao()); }
}
