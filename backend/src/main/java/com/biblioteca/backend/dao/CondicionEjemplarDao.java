package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.CondicionEjemplar;

public class CondicionEjemplarDao extends JdbcDao<CondicionEjemplar> {
    public CondicionEjemplarDao() {
        super(CondicionEjemplar.class, "condicion_ejemplar", new String[]{"id_condicion_ejemplar"});
    }
}
