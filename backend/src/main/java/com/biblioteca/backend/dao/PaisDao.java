package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Pais;

public class PaisDao extends JdbcDao<Pais> {
    public PaisDao() {
        super(Pais.class, "pais", new String[]{"id_pais"});
    }
}
