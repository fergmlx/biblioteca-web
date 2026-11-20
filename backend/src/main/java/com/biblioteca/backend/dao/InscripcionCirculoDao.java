package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.InscripcionCirculo;

public class InscripcionCirculoDao extends JdbcDao<InscripcionCirculo> {
    public InscripcionCirculoDao() {
        super(InscripcionCirculo.class, "inscripcion_circulo", new String[]{"id_inscripcion"});
    }
}
