package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.LibroDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/libros", "/api/libros/*"})
public class LibroServlet extends BaseCrudServlet {
    public LibroServlet() { super(new LibroDao()); }
}
