package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.RolDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/roles", "/api/roles/*"})
public class RolServlet extends BaseCrudServlet {
    public RolServlet() { super(new RolDao()); }
}
