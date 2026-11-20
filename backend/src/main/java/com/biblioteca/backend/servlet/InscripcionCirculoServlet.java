package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.InscripcionCirculoDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/inscripciones-circulo", "/api/inscripciones-circulo/*"})
public class InscripcionCirculoServlet extends BaseCrudServlet {
    public InscripcionCirculoServlet() { super(new InscripcionCirculoDao()); }
}
