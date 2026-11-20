package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Libro;

public class LibroDao extends JdbcDao<Libro> {
    public LibroDao() {
        super(Libro.class, "libro", new String[]{"id_libro"});
    }
}
