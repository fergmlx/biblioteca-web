package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.PaisDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/paises", "/api/paises/*"})
public class PaisServlet extends BaseCrudServlet {
    public PaisServlet() { super(new PaisDao()); }
}
