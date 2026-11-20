package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Favorito;

public class FavoritoDao extends JdbcDao<Favorito> {
    public FavoritoDao() {
        super(Favorito.class, "favorito", new String[]{"id_usuario","id_libro"});
    }
}
