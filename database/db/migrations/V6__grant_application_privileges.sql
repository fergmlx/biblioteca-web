-- Permisos para la aplicación.
-- Se ejecuta como biblioteca_owner.

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO biblioteca_app;
GRANT CONNECT ON DATABASE biblioteca TO biblioteca_app;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM biblioteca_app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM biblioteca_app;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM biblioteca_app;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA public
    TO biblioteca_app;

REVOKE INSERT, UPDATE, DELETE
    ON auditoria_general,
       usuario_backup,
       rol_backup,
       autor_backup,
       pais_backup,
       tipo_participacion_backup,
       libro_backup,
       ejemplar_backup,
       condicion_ejemplar_backup,
       prestamo_backup,
       estado_prestamo_backup,
       genero_backup,
       circulo_lectura_backup,
       solicitud_prestamo_backup,
       token_recuperacion_backup,
       libro_autor_backup,
       libro_genero_backup,
       inscripcion_circulo_backup,
       favorito_backup,
       resena_backup
    FROM biblioteca_app;

GRANT SELECT
    ON auditoria_general,
       usuario_backup,
       rol_backup,
       autor_backup,
       pais_backup,
       tipo_participacion_backup,
       libro_backup,
       ejemplar_backup,
       condicion_ejemplar_backup,
       prestamo_backup,
       estado_prestamo_backup,
       genero_backup,
       circulo_lectura_backup,
       solicitud_prestamo_backup,
       token_recuperacion_backup,
       libro_autor_backup,
       libro_genero_backup,
       inscripcion_circulo_backup,
       favorito_backup,
       resena_backup
    TO biblioteca_app;

GRANT USAGE, SELECT
    ON ALL SEQUENCES IN SCHEMA public
    TO biblioteca_app;

GRANT EXECUTE
    ON ALL FUNCTIONS IN SCHEMA public
    TO biblioteca_app;

ALTER DEFAULT PRIVILEGES FOR ROLE biblioteca_owner IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO biblioteca_app;

ALTER DEFAULT PRIVILEGES FOR ROLE biblioteca_owner IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO biblioteca_app;

ALTER DEFAULT PRIVILEGES FOR ROLE biblioteca_owner IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO biblioteca_app;
