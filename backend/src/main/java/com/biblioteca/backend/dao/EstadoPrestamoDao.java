package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.EstadoPrestamo;

public class EstadoPrestamoDao extends JdbcDao<EstadoPrestamo> {
    public EstadoPrestamoDao() {
        super(EstadoPrestamo.class, "estado_prestamo", new String[]{"id_estado_prestamo"});
    }
}
