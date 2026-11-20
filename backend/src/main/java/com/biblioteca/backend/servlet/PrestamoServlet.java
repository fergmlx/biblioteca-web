package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.PrestamoDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/prestamos", "/api/prestamos/*"})
public class PrestamoServlet extends BaseCrudServlet {
    public PrestamoServlet() { super(new PrestamoDao()); }
}
