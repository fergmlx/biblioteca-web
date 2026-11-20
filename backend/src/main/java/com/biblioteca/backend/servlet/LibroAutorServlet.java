package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.LibroAutorDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/libros-autores", "/api/libros-autores/*"})
public class LibroAutorServlet extends BaseCrudServlet {
    public LibroAutorServlet() { super(new LibroAutorDao()); }
}
