-- Funciones para gestionar préstamos.
-- Se ejecuta como biblioteca_owner.

CREATE OR REPLACE FUNCTION fn_solicitar_prestamo(
    p_id_usuario UUID,
    p_id_libro UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_solicitud UUID;
    v_membresia BOOLEAN;
    v_disponible BOOLEAN;
BEGIN
    SELECT membresia_activa
    INTO v_membresia
    FROM usuario
    WHERE id_usuario = p_id_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    IF v_membresia = FALSE THEN
        RAISE EXCEPTION 'La membresia del usuario esta inactiva';
    END IF;

    SELECT disponible
    INTO v_disponible
    FROM v_libro_disponibilidad
    WHERE id_libro = p_id_libro;

    IF COALESCE(v_disponible, FALSE) = FALSE THEN
        RAISE EXCEPTION 'El libro no tiene ejemplares disponibles';
    END IF;

    IF EXISTS (
        SELECT 1 FROM solicitud_prestamo
        WHERE id_usuario = p_id_usuario
          AND id_libro = p_id_libro
          AND estado = 'PENDIENTE'
    ) THEN
        RAISE EXCEPTION 'Ya existe una solicitud pendiente';
    END IF;

    IF EXISTS (
        SELECT 1 FROM prestamo
        WHERE id_usuario = p_id_usuario
          AND id_libro = p_id_libro
          AND fecha_devolucion IS NULL
    ) THEN
        RAISE EXCEPTION 'El usuario ya tiene el libro prestado';
    END IF;

    INSERT INTO solicitud_prestamo (id_usuario, id_libro, estado)
    VALUES (p_id_usuario, p_id_libro, 'PENDIENTE')
    RETURNING id_solicitud INTO v_id_solicitud;

    RETURN v_id_solicitud;
END;
$$;

CREATE OR REPLACE FUNCTION fn_atender_solicitud(
    p_id_solicitud UUID,
    p_id_usuario_admin UUID,
    p_num_ejemplar SMALLINT,
    p_fecha_limite TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_prestamo UUID;
    v_estado VARCHAR(20);
    v_usuario UUID;
    v_libro UUID;
    v_es_admin BOOLEAN;
    v_estado_activo SMALLINT;
    v_permite_prestamo BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM usuario u
        JOIN rol r ON r.id_rol = u.id_rol
        WHERE u.id_usuario = p_id_usuario_admin
          AND u.membresia_activa = TRUE
          AND r.nombre = 'ADMINISTRADOR'
    ) INTO v_es_admin;

    IF v_es_admin = FALSE THEN
        RAISE EXCEPTION 'El usuario no tiene permisos de administrador';
    END IF;

    SELECT estado, id_usuario, id_libro
    INTO v_estado, v_usuario, v_libro
    FROM solicitud_prestamo
    WHERE id_solicitud = p_id_solicitud
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La solicitud no existe';
    END IF;

    IF v_estado <> 'PENDIENTE' THEN
        RAISE EXCEPTION 'La solicitud ya no esta pendiente';
    END IF;

    SELECT ce.permite_prestamo
    INTO v_permite_prestamo
    FROM ejemplar e
    JOIN condicion_ejemplar ce
      ON ce.id_condicion_ejemplar = e.id_condicion_ejemplar
    WHERE e.id_libro = v_libro
      AND e.num_ejemplar = p_num_ejemplar
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El ejemplar no existe';
    END IF;

    IF v_permite_prestamo = FALSE THEN
        RAISE EXCEPTION 'La condicion del ejemplar no permite prestarlo';
    END IF;

    IF EXISTS (
        SELECT 1 FROM prestamo
        WHERE id_libro = v_libro
          AND num_ejemplar = p_num_ejemplar
          AND fecha_devolucion IS NULL
    ) THEN
        RAISE EXCEPTION 'El ejemplar ya tiene un prestamo activo';
    END IF;

    IF p_fecha_limite <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'La fecha limite debe ser posterior a la actual';
    END IF;

    SELECT id_estado_prestamo
    INTO v_estado_activo
    FROM estado_prestamo
    WHERE nombre = 'ACTIVO';

    INSERT INTO prestamo (
        id_solicitud, fecha_limite, id_estado_prestamo,
        id_usuario, id_libro, num_ejemplar
    )
    VALUES (
        p_id_solicitud, p_fecha_limite, v_estado_activo,
        v_usuario, v_libro, p_num_ejemplar
    )
    RETURNING id_prestamo INTO v_id_prestamo;

    UPDATE solicitud_prestamo
    SET estado = 'ATENDIDA',
        fecha_respuesta = CURRENT_TIMESTAMP
    WHERE id_solicitud = p_id_solicitud;

    RETURN v_id_prestamo;
END;
$$;

CREATE OR REPLACE FUNCTION fn_registrar_prestamo_directo(
    p_id_usuario UUID,
    p_id_libro UUID,
    p_num_ejemplar SMALLINT,
    p_fecha_limite TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_prestamo UUID;
    v_estado_activo SMALLINT;
    v_membresia BOOLEAN;
    v_permite BOOLEAN;
BEGIN
    SELECT membresia_activa
    INTO v_membresia
    FROM usuario
    WHERE id_usuario = p_id_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    IF v_membresia = FALSE THEN
        RAISE EXCEPTION 'La membresia esta inactiva';
    END IF;

    SELECT ce.permite_prestamo
    INTO v_permite
    FROM ejemplar e
    JOIN condicion_ejemplar ce
      ON ce.id_condicion_ejemplar = e.id_condicion_ejemplar
    WHERE e.id_libro = p_id_libro
      AND e.num_ejemplar = p_num_ejemplar
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El ejemplar no existe';
    END IF;

    IF v_permite = FALSE THEN
        RAISE EXCEPTION 'La condicion del ejemplar no permite prestarlo';
    END IF;

    IF EXISTS (
        SELECT 1 FROM prestamo
        WHERE id_libro = p_id_libro
          AND num_ejemplar = p_num_ejemplar
          AND fecha_devolucion IS NULL
    ) THEN
        RAISE EXCEPTION 'El ejemplar ya tiene un prestamo activo';
    END IF;

    IF p_fecha_limite <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'La fecha limite debe ser posterior a la actual';
    END IF;

    SELECT id_estado_prestamo
    INTO v_estado_activo
    FROM estado_prestamo
    WHERE nombre = 'ACTIVO';

    INSERT INTO prestamo (
        id_solicitud, fecha_limite, id_estado_prestamo,
        id_usuario, id_libro, num_ejemplar
    )
    VALUES (
        NULL, p_fecha_limite, v_estado_activo,
        p_id_usuario, p_id_libro, p_num_ejemplar
    )
    RETURNING id_prestamo INTO v_id_prestamo;

    RETURN v_id_prestamo;
END;
$$;

CREATE OR REPLACE FUNCTION fn_registrar_devolucion(
    p_id_prestamo UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_devuelto SMALLINT;
BEGIN
    SELECT id_estado_prestamo
    INTO v_estado_devuelto
    FROM estado_prestamo
    WHERE nombre = 'DEVUELTO';

    UPDATE prestamo
    SET fecha_devolucion = CURRENT_TIMESTAMP,
        id_estado_prestamo = v_estado_devuelto
    WHERE id_prestamo = p_id_prestamo
      AND fecha_devolucion IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El prestamo no existe o ya fue devuelto';
    END IF;
END;
$$;

