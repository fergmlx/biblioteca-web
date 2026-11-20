package com.biblioteca.backend.dao;

import com.biblioteca.backend.model.TokenRecuperacion;

public class TokenRecuperacionDao extends JdbcDao<TokenRecuperacion> {
    public TokenRecuperacionDao() {
        super(TokenRecuperacion.class, "token_recuperacion", new String[]{"id_token"});
    }
}
