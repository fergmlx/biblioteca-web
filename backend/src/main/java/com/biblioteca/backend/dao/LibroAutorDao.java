package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.LibroAutor;

public class LibroAutorDao extends JdbcDao<LibroAutor> {
    public LibroAutorDao() {
        super(LibroAutor.class, "libro_autor", new String[]{"id_libro","id_autor","id_tipo_participacion"});
    }
}
