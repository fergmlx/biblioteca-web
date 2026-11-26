package com.biblioteca.backend.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Set;

@WebFilter("/api/*")
public final class DemoAccessFilter implements Filter {
    private static final Set<String> CATALOG = Set.of(
        "/api/libros", "/api/autores", "/api/generos", "/api/paises",
        "/api/libros-autores", "/api/libros-generos"
    );
    private String key;

    @Override
    public void init(FilterConfig config) throws ServletException {
        key = System.getenv("DEMO_API_KEY");
        if ("true".equals(System.getenv("RENDER")) && (key == null || key.isBlank())) {
            throw new ServletException("Configura DEMO_API_KEY para el servicio de Render.");
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        boolean catalogRead = "GET".equals(req.getMethod()) && CATALOG.contains(req.getServletPath());
        if (key == null || key.isBlank() || catalogRead) {
            chain.doFilter(req, res);
            return;
        }
        String provided = req.getHeader("X-Demo-Key");
        if (provided != null && MessageDigest.isEqual(key.getBytes(StandardCharsets.UTF_8),
                provided.getBytes(StandardCharsets.UTF_8))) {
            chain.doFilter(req, res);
        } else {
            ServletJson.error(res, 401, "Se requiere la clave del equipo.");
        }
    }
}
