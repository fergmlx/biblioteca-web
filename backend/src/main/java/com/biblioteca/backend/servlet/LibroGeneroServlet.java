package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.LibroGeneroDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/libros-generos", "/api/libros-generos/*"})
public class LibroGeneroServlet extends BaseCrudServlet {
    public LibroGeneroServlet() { super(new LibroGeneroDao()); }
}
