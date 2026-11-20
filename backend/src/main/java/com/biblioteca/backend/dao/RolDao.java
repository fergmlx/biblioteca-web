package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.Rol;

public class RolDao extends JdbcDao<Rol> {
    public RolDao() {
        super(Rol.class, "rol", new String[]{"id_rol"});
    }
}
