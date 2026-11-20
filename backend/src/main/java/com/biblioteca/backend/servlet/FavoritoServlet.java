package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.FavoritoDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/favoritos", "/api/favoritos/*"})
public class FavoritoServlet extends BaseCrudServlet {
    public FavoritoServlet() { super(new FavoritoDao()); }
}
