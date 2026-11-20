package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.CirculoLecturaDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/circulos-lectura", "/api/circulos-lectura/*"})
public class CirculoLecturaServlet extends BaseCrudServlet {
    public CirculoLecturaServlet() { super(new CirculoLecturaDao()); }
}
