package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.ReseniaDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/resenas", "/api/resenas/*"})
public class ReseniaServlet extends BaseCrudServlet {
    public ReseniaServlet() { super(new ReseniaDao()); }
}
