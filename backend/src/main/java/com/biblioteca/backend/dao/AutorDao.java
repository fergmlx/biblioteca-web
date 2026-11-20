package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Autor;

public class AutorDao extends JdbcDao<Autor> {
    public AutorDao() {
        super(Autor.class, "autor", new String[]{"id_autor"});
    }
}
