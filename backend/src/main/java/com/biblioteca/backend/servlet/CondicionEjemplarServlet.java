package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.CondicionEjemplarDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/condiciones-ejemplar", "/api/condiciones-ejemplar/*"})
public class CondicionEjemplarServlet extends BaseCrudServlet {
    public CondicionEjemplarServlet() { super(new CondicionEjemplarDao()); }
}
