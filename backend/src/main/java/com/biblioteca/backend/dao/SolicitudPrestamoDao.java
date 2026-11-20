package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.SolicitudPrestamo;

public class SolicitudPrestamoDao extends JdbcDao<SolicitudPrestamo> {
    public SolicitudPrestamoDao() {
        super(SolicitudPrestamo.class, "solicitud_prestamo", new String[]{"id_solicitud"});
    }
}
