package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Ejemplar;

public class EjemplarDao extends JdbcDao<Ejemplar> {
    public EjemplarDao() {
        super(Ejemplar.class, "ejemplar", new String[]{"id_libro","num_ejemplar"});
    }
}
