package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.TokenRecuperacionDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/tokens-recuperacion", "/api/tokens-recuperacion/*"})
public class TokenRecuperacionServlet extends BaseCrudServlet {
    public TokenRecuperacionServlet() { super(new TokenRecuperacionDao()); }
}
