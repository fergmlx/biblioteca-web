package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Resenia;

public class ReseniaDao extends JdbcDao<Resenia> {
    public ReseniaDao() {
        super(Resenia.class, "resena", new String[]{"id_usuario","id_libro"});
    }
}
