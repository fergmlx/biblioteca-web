package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.AutorDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/autores", "/api/autores/*"})
public class AutorServlet extends BaseCrudServlet {
    public AutorServlet() { super(new AutorDao()); }
}
