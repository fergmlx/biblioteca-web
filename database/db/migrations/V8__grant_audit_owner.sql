-- Permisos del propietario para el trigger de auditoría.

GRANT SELECT, INSERT, UPDATE, DELETE ON
    public.auditoria_general,
    public.usuario_backup,
    public.rol_backup,
    public.autor_backup,
    public.pais_backup,
    public.tipo_participacion_backup,
    public.libro_backup,
    public.ejemplar_backup,
    public.condicion_ejemplar_backup,
    public.prestamo_backup,
    public.estado_prestamo_backup,
    public.genero_backup,
    public.circulo_lectura_backup,
    public.solicitud_prestamo_backup,
    public.token_recuperacion_backup,
    public.libro_autor_backup,
    public.libro_genero_backup,
    public.inscripcion_circulo_backup,
    public.favorito_backup,
    public.resena_backup
TO biblioteca_owner;
