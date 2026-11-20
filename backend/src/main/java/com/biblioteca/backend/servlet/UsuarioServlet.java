package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.UsuarioDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/usuarios", "/api/usuarios/*"})
public class UsuarioServlet extends BaseCrudServlet {
    public UsuarioServlet() { super(new UsuarioDao()); }
}
