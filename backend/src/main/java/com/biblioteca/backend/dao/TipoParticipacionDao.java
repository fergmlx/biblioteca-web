package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.TipoParticipacion;

public class TipoParticipacionDao extends JdbcDao<TipoParticipacion> {
    public TipoParticipacionDao() {
        super(TipoParticipacion.class, "tipo_participacion", new String[]{"id_tipo_participacion"});
    }
}
