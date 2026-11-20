package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.EstadoPrestamoDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/estados-prestamo", "/api/estados-prestamo/*"})
public class EstadoPrestamoServlet extends BaseCrudServlet {
    public EstadoPrestamoServlet() { super(new EstadoPrestamoDao()); }
}
