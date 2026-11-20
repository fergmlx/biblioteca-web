package com.biblioteca.backend.servlet;

import com.biblioteca.backend.dao.TipoParticipacionDao;
import jakarta.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/api/tipos-participacion", "/api/tipos-participacion/*"})
public class TipoParticipacionServlet extends BaseCrudServlet {
    public TipoParticipacionServlet() { super(new TipoParticipacionDao()); }
}
