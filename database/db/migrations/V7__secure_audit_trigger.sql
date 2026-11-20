-- El trigger escribe en los respaldos con los permisos del propietario.

ALTER FUNCTION public.fn_registrar_backup_auditoria()
    OWNER TO biblioteca_owner;

SET ROLE biblioteca_owner;

CREATE OR REPLACE FUNCTION public.fn_registrar_backup_auditoria()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_registro JSONB;
    v_usuario_aplicacion TEXT;
BEGIN
    v_usuario_aplicacion := NULLIF(
        current_setting('app.usuario_aplicacion', TRUE),
        ''
    );

    IF TG_OP = 'DELETE' THEN
        v_registro := to_jsonb(OLD);
    ELSE
        v_registro := to_jsonb(NEW);
    END IF;

    EXECUTE format(
        'INSERT INTO %I (
            usuario_bd,
            usuario_aplicacion,
            operacion,
            registro
         ) VALUES ($1, $2, $3, $4)',
        TG_TABLE_NAME || '_backup'
    ) USING current_user, v_usuario_aplicacion, TG_OP, v_registro;

    INSERT INTO public.auditoria_general (
        usuario_bd,
        usuario_aplicacion,
        tabla_afectada,
        operacion,
        accion,
        detalle
    ) VALUES (
        current_user,
        v_usuario_aplicacion,
        TG_TABLE_NAME,
        TG_OP,
        TG_OP || ' sobre ' || TG_TABLE_NAME,
        v_registro
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.fn_registrar_backup_auditoria()
    FROM PUBLIC, biblioteca_app;

RESET ROLE;
