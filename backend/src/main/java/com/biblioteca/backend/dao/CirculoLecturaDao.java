package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.CirculoLectura;

public class CirculoLecturaDao extends JdbcDao<CirculoLectura> {
    public CirculoLecturaDao() {
        super(CirculoLectura.class, "circulo_lectura", new String[]{"id_circulo"});
    }
}
