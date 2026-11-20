package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Prestamo;

public class PrestamoDao extends JdbcDao<Prestamo> {
    public PrestamoDao() {
        super(Prestamo.class, "prestamo", new String[]{"id_prestamo"});
    }
}
