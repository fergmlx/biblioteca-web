package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.GeneroDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/generos", "/api/generos/*"})
public class GeneroServlet extends BaseCrudServlet {
    public GeneroServlet() { super(new GeneroDao()); }
}
