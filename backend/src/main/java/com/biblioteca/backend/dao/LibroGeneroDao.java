package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.LibroGenero;

public class LibroGeneroDao extends JdbcDao<LibroGenero> {
    public LibroGeneroDao() {
        super(LibroGenero.class, "libro_genero", new String[]{"id_libro","id_genero"});
    }
}
