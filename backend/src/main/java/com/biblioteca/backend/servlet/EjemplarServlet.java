package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.EjemplarDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/ejemplares", "/api/ejemplares/*"})
public class EjemplarServlet extends BaseCrudServlet {
    public EjemplarServlet() { super(new EjemplarDao()); }
}
