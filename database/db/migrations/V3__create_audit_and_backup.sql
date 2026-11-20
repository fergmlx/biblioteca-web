-- Respaldos y auditoría.
-- Se ejecuta como biblioteca_owner.

CREATE TABLE auditoria_general (
    id_auditoria UUID NOT NULL DEFAULT gen_random_uuid(),
    fecha_operacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_bd VARCHAR(100) NOT NULL,
    usuario_aplicacion VARCHAR(100),
    tabla_afectada VARCHAR(100) NOT NULL,
    operacion VARCHAR(10) NOT NULL,
    accion VARCHAR(150),
    detalle JSONB,
    CONSTRAINT pk_auditoria_general PRIMARY KEY (id_auditoria),
    CONSTRAINT ck_auditoria_operacion
        CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);

DO $$
DECLARE
    tablas text[] := ARRAY[
        'usuario','rol','autor','pais','libro','ejemplar',
        'condicion_ejemplar','prestamo','estado_prestamo','genero',
        'circulo_lectura','solicitud_prestamo','token_recuperacion',
        'libro_autor','libro_genero','inscripcion_circulo',
        'favorito','resena','tipo_participacion'
    ];
    tabla text;
BEGIN
    FOREACH tabla IN ARRAY tablas LOOP
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I (
                id_backup UUID NOT NULL DEFAULT gen_random_uuid(),
                fecha_operacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                usuario_bd VARCHAR(100) NOT NULL,
                usuario_aplicacion VARCHAR(100),
                operacion VARCHAR(10) NOT NULL,
                registro JSONB,
                CONSTRAINT %I PRIMARY KEY (id_backup),
                CONSTRAINT %I CHECK (operacion IN (''INSERT'', ''UPDATE'', ''DELETE''))
             )',
            tabla || '_backup',
            'pk_' || tabla || '_backup',
            'ck_' || tabla || '_backup_operacion'
        );
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION fn_registrar_backup_auditoria()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_registro JSONB;
    v_usuario_aplicacion TEXT;
BEGIN
    v_usuario_aplicacion := NULLIF(
        current_setting('app.usuario_aplicacion', TRUE), ''
    );

    IF TG_OP = 'DELETE' THEN
        v_registro := to_jsonb(OLD);
    ELSE
        v_registro := to_jsonb(NEW);
    END IF;

    EXECUTE format(
        'INSERT INTO %I (
            usuario_bd, usuario_aplicacion, operacion, registro
         ) VALUES ($1, $2, $3, $4)',
        TG_TABLE_NAME || '_backup'
    ) USING current_user, v_usuario_aplicacion, TG_OP, v_registro;

    INSERT INTO auditoria_general (
        usuario_bd, usuario_aplicacion, tabla_afectada,
        operacion, accion, detalle
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

DO $$
DECLARE
    tablas text[] := ARRAY[
        'usuario','rol','autor','pais','libro','ejemplar',
        'condicion_ejemplar','prestamo','estado_prestamo','genero',
        'circulo_lectura','solicitud_prestamo','token_recuperacion',
        'libro_autor','libro_genero','inscripcion_circulo',
        'favorito','resena','tipo_participacion'
    ];
    tabla text;
BEGIN
    FOREACH tabla IN ARRAY tablas LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%I_backup ON %I',
            tabla, tabla
        );
        EXECUTE format(
            'CREATE TRIGGER trg_%I_backup
             AFTER INSERT OR UPDATE OR DELETE ON %I
             FOR EACH ROW EXECUTE FUNCTION fn_registrar_backup_auditoria()',
            tabla, tabla
        );
    END LOOP;
END;
$$;

