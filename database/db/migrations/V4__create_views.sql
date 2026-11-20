-- Vistas de consulta.
-- Se ejecuta como biblioteca_owner.

CREATE OR REPLACE VIEW v_ejemplar_disponibilidad AS
SELECT e.id_libro,
       e.num_ejemplar,
       e.codigo_inventario,
       e.ubicacion,
       ce.nombre AS condicion,
       ce.permite_prestamo,
       CASE
           WHEN ce.permite_prestamo = FALSE THEN FALSE
           WHEN EXISTS (
               SELECT 1
               FROM prestamo p
               WHERE p.id_libro = e.id_libro
                 AND p.num_ejemplar = e.num_ejemplar
                 AND p.fecha_devolucion IS NULL
           ) THEN FALSE
           ELSE TRUE
       END AS disponible,
       CASE
           WHEN ce.permite_prestamo = FALSE THEN 'NO_DISPONIBLE'
           WHEN EXISTS (
               SELECT 1
               FROM prestamo p
               WHERE p.id_libro = e.id_libro
                 AND p.num_ejemplar = e.num_ejemplar
                 AND p.fecha_devolucion IS NULL
           ) THEN 'PRESTADO'
           ELSE 'DISPONIBLE'
       END AS estado_disponibilidad
FROM ejemplar e
JOIN condicion_ejemplar ce
  ON ce.id_condicion_ejemplar = e.id_condicion_ejemplar;

CREATE OR REPLACE VIEW v_libro_disponibilidad AS
SELECT l.id_libro,
       l.titulo,
       COUNT(e.num_ejemplar) AS total_ejemplares,
       COUNT(*) FILTER (WHERE ved.disponible = TRUE) AS ejemplares_disponibles,
       COUNT(*) FILTER (WHERE ved.disponible = TRUE) > 0 AS disponible
FROM libro l
LEFT JOIN ejemplar e ON e.id_libro = l.id_libro
LEFT JOIN v_ejemplar_disponibilidad ved
       ON ved.id_libro = e.id_libro
      AND ved.num_ejemplar = e.num_ejemplar
GROUP BY l.id_libro, l.titulo;

CREATE OR REPLACE VIEW v_prestamos_detalle AS
SELECT p.id_prestamo,
       p.id_solicitud,
       p.fecha_prestamo,
       p.fecha_limite,
       p.fecha_devolucion,
       p.id_usuario,
       u.numero_socio,
       u.nombres || ' ' || u.apellido_paterno AS nombre_usuario,
       p.id_libro,
       l.titulo,
       p.num_ejemplar,
       ep.nombre AS estado,
       CASE
           WHEN p.fecha_devolucion IS NULL
            AND p.fecha_limite < CURRENT_TIMESTAMP THEN TRUE
           ELSE FALSE
       END AS vencido,
       CASE WHEN p.id_solicitud IS NULL THEN 'MOSTRADOR' ELSE 'WEB' END AS origen
FROM prestamo p
JOIN usuario u ON u.id_usuario = p.id_usuario
JOIN libro l ON l.id_libro = p.id_libro
JOIN estado_prestamo ep
  ON ep.id_estado_prestamo = p.id_estado_prestamo;

CREATE OR REPLACE VIEW v_circulos_resumen AS
SELECT c.id_circulo,
       c.nombre,
       c.tema,
       c.dia_semana,
       c.hora,
       c.cupo_maximo,
       c.fecha_inicio,
       c.fecha_fin,
       c.id_libro,
       l.titulo,
       COUNT(i.id_inscripcion) FILTER (
           WHERE i.fecha_baja IS NULL
       ) AS inscritos_activos,
       GREATEST(
           c.cupo_maximo - COUNT(i.id_inscripcion) FILTER (
               WHERE i.fecha_baja IS NULL
                 AND i.es_excepcion_cupo = FALSE
           ),
           0
       ) AS lugares_disponibles,
       CASE
           WHEN c.fecha_fin IS NOT NULL
            AND c.fecha_fin < CURRENT_DATE THEN 'FINALIZADO'
           WHEN COUNT(i.id_inscripcion) FILTER (
               WHERE i.fecha_baja IS NULL
                 AND i.es_excepcion_cupo = FALSE
           ) >= c.cupo_maximo THEN 'CUPO_LLENO'
           ELSE 'DISPONIBLE'
       END AS estado_circulo
FROM circulo_lectura c
LEFT JOIN libro l ON l.id_libro = c.id_libro
LEFT JOIN inscripcion_circulo i ON i.id_circulo = c.id_circulo
GROUP BY c.id_circulo, c.nombre, c.tema, c.dia_semana, c.hora,
         c.cupo_maximo, c.fecha_inicio, c.fecha_fin, c.id_libro, l.titulo;

CREATE OR REPLACE VIEW v_solicitudes_detalle AS
SELECT s.id_solicitud,
       s.id_usuario,
       u.numero_socio,
       u.nombres || ' ' || u.apellido_paterno AS nombre_usuario,
       s.id_libro,
       l.titulo,
       s.fecha_solicitud,
       s.fecha_respuesta,
       s.estado,
       s.observaciones
FROM solicitud_prestamo s
JOIN usuario u ON u.id_usuario = s.id_usuario
JOIN libro l ON l.id_libro = s.id_libro;

CREATE OR REPLACE VIEW v_resenas_promedio AS
SELECT l.id_libro,
       l.titulo,
       COUNT(r.id_usuario) AS cantidad_resenas,
       ROUND(AVG(r.calificacion), 2) AS promedio
FROM libro l
LEFT JOIN resena r ON r.id_libro = l.id_libro
GROUP BY l.id_libro, l.titulo;

CREATE OR REPLACE VIEW v_autores_libros AS
SELECT l.id_libro,
       l.titulo,
       string_agg(
           a.nombres || ' ' || a.apellido_paterno,
           ', ' ORDER BY a.apellido_paterno
       ) AS autores
FROM libro l
JOIN libro_autor la ON la.id_libro = l.id_libro
JOIN autor a ON a.id_autor = la.id_autor
GROUP BY l.id_libro, l.titulo;

