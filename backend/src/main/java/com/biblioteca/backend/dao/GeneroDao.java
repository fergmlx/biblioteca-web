package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Genero;

public class GeneroDao extends JdbcDao<Genero> {
    public GeneroDao() {
        super(Genero.class, "genero", new String[]{"id_genero"});
    }
}
