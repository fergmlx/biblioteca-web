-- Catálogos y datos de prueba.
-- Se ejecuta como biblioteca_owner.

INSERT INTO rol (nombre) VALUES
    ('USUARIO'),
    ('ADMINISTRADOR')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO pais (nombre, codigo_iso) VALUES
    ('México', 'MX'),
    ('Francia', 'FR'),
    ('Reino Unido', 'GB'),
    ('Colombia', 'CO'),
    ('Rusia', 'RU'),
    ('Argentina', 'AR'),
    ('España', 'ES')
ON CONFLICT (codigo_iso) DO NOTHING;

INSERT INTO genero (nombre) VALUES
    ('Ficción'), ('Historia'), ('Filosofía'), ('Ciencia'),
    ('Distopía'), ('Literatura infantil'), ('Realismo mágico')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO condicion_ejemplar (nombre, permite_prestamo) VALUES
    ('BUENO', TRUE),
    ('DANADO', TRUE),
    ('EN_REPARACION', FALSE),
    ('PERDIDO', FALSE),
    ('DADO_DE_BAJA', FALSE)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO estado_prestamo (nombre) VALUES
    ('ACTIVO'), ('DEVUELTO'), ('CANCELADO'), ('RENOVADO')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO tipo_participacion (nombre) VALUES
    ('AUTOR'), ('TRADUCTOR'), ('EDITOR'),
    ('ILUSTRADOR'), ('ADAPTADOR'), ('COMPILADOR')
ON CONFLICT (nombre) DO NOTHING;

-- Estos valores son temporales. Java debe reemplazarlos por hashes antes del login.
INSERT INTO usuario (
    nombres, apellido_paterno, correo, contrasena_hash,
    membresia_activa, id_rol
)
SELECT 'Administrador', 'General', 'admin@biblioteca.local',
       'PENDIENTE_HASH_JAVA_ADMIN_123',
       TRUE, r.id_rol
FROM rol r
WHERE r.nombre = 'ADMINISTRADOR'
  AND NOT EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.correo = 'admin@biblioteca.local');

INSERT INTO usuario (
    nombres, apellido_paterno, correo, contrasena_hash,
    telefono, membresia_activa, id_rol
)
SELECT d.nombres, d.apellido_paterno, d.correo,
       'PENDIENTE_HASH_JAVA_USUARIO_123',
       d.telefono, TRUE, r.id_rol
FROM (
    VALUES
        ('Ana', 'López', 'ana@biblioteca.local', '5550000001'),
        ('Carlos', 'Ruiz', 'carlos@biblioteca.local', '5550000002'),
        ('Lucía', 'Torres', 'lucia@biblioteca.local', '5550000003')
) AS d(nombres, apellido_paterno, correo, telefono)
CROSS JOIN rol r
WHERE r.nombre = 'USUARIO'
  AND NOT EXISTS (
      SELECT 1 FROM usuario u
      WHERE u.correo = d.correo);

INSERT INTO autor (
    nombres, apellido_paterno, id_pais, ruta_imagen,
    fecha_nacimiento, fecha_fallecimiento, biografia
)
SELECT 'Antoine', 'de Saint-Exupéry', p.id_pais,
       'images/autores/saint-exupery.jpg',
       DATE '1900-06-29', DATE '1944-07-31',
       'Escritor y aviador francés.'
FROM pais p
WHERE p.codigo_iso = 'FR'
  AND NOT EXISTS (
      SELECT 1 FROM autor a
      WHERE a.nombres = 'Antoine'
        AND a.apellido_paterno = 'de Saint-Exupéry');

INSERT INTO autor (
    nombres, apellido_paterno, id_pais, ruta_imagen,
    fecha_nacimiento, fecha_fallecimiento, biografia
)
SELECT 'George', 'Orwell', p.id_pais,
       'images/autores/george-orwell.jpg',
       DATE '1903-06-25', DATE '1950-01-21',
       'Escritor y periodista británico.'
FROM pais p
WHERE p.codigo_iso = 'GB'
  AND NOT EXISTS (
      SELECT 1 FROM autor a
      WHERE a.nombres = 'George'
        AND a.apellido_paterno = 'Orwell');

INSERT INTO autor (
    nombres, apellido_paterno, id_pais, ruta_imagen,
    fecha_nacimiento, fecha_fallecimiento, biografia
)
SELECT 'Gabriel García', 'Márquez', p.id_pais,
       'images/autores/gabriel-garcia-marquez.jpg',
       DATE '1927-03-06', DATE '2014-04-17',
       'Escritor colombiano.'
FROM pais p
WHERE p.codigo_iso = 'CO'
  AND NOT EXISTS (
      SELECT 1 FROM autor a
      WHERE a.nombres = 'Gabriel García'
        AND a.apellido_paterno = 'Márquez');

INSERT INTO libro (
    isbn, titulo, editorial, anio_publicacion, idioma, sinopsis, ruta_portada
) VALUES
    ('9781234567890', 'El principito', 'Editorial X', 2020, 'Español',
     'La amistad y la responsabilidad.', 'images/portadas/el-principito.jpg'),
    ('9789876543210', '1984', 'Editorial Y', 2019, 'Español',
     'Novela distópica.', 'images/portadas/1984.jpg'),
    ('9781112223334', 'Cien años de soledad', 'Editorial Z', 2018, 'Español',
     'Historia de varias generaciones.', 'images/portadas/cien-anos-de-soledad.jpg')
ON CONFLICT (isbn) DO NOTHING;

INSERT INTO libro_autor (id_libro, id_autor, id_tipo_participacion)
SELECT l.id_libro, a.id_autor, t.id_tipo_participacion
FROM libro l
JOIN autor a ON (
    (l.isbn = '9781234567890' AND a.nombres = 'Antoine')
    OR (l.isbn = '9789876543210' AND a.nombres = 'George')
    OR (l.isbn = '9781112223334' AND a.nombres = 'Gabriel García')
)
CROSS JOIN tipo_participacion t
WHERE t.nombre = 'AUTOR'
ON CONFLICT DO NOTHING;

INSERT INTO libro_genero (id_libro, id_genero)
SELECT l.id_libro, g.id_genero
FROM libro l
CROSS JOIN genero g
WHERE (l.isbn = '9781234567890' AND g.nombre IN ('Ficción', 'Literatura infantil'))
   OR (l.isbn = '9789876543210' AND g.nombre IN ('Ficción', 'Distopía'))
   OR (l.isbn = '9781112223334' AND g.nombre IN ('Ficción', 'Realismo mágico'))
ON CONFLICT DO NOTHING;

INSERT INTO ejemplar (
    id_libro, num_ejemplar, codigo_inventario, ubicacion, id_condicion_ejemplar
)
SELECT l.id_libro, d.num_ejemplar, d.codigo,
       d.ubicacion, c.id_condicion_ejemplar
FROM (
    VALUES
        ('9781234567890', 1, 'A001', 'Sala A', 'BUENO'),
        ('9781234567890', 2, 'A002', 'Sala A', 'BUENO'),
        ('9781234567890', 3, 'A003', 'Sala A', 'BUENO'),
        ('9789876543210', 1, 'B001', 'Sala B', 'BUENO'),
        ('9789876543210', 2, 'B002', 'Sala B', 'EN_REPARACION'),
        ('9781112223334', 1, 'C001', 'Sala C', 'BUENO')
) AS d(isbn, num_ejemplar, codigo, ubicacion, condicion)
JOIN libro l ON l.isbn = d.isbn
JOIN condicion_ejemplar c ON c.nombre = d.condicion
ON CONFLICT (id_libro, num_ejemplar) DO NOTHING;

INSERT INTO circulo_lectura (
    nombre, descripcion, dia_semana, hora, cupo_maximo,
    fecha_inicio, fecha_fin, id_libro
)
SELECT 'Lectura y debate', 'Conversación sobre la obra.',
       'Sábado', TIME '10:00', 20, DATE '2026-10-01',
       DATE '2026-12-20', l.id_libro
FROM libro l
WHERE l.isbn = '9781234567890'
  AND NOT EXISTS (
      SELECT 1 FROM circulo_lectura c
      WHERE c.nombre = 'Lectura y debate');

INSERT INTO inscripcion_circulo (id_usuario, id_circulo)
SELECT u.id_usuario, c.id_circulo
FROM usuario u
CROSS JOIN circulo_lectura c
WHERE u.correo = 'ana@biblioteca.local'
  AND c.nombre = 'Lectura y debate'
  AND NOT EXISTS (
      SELECT 1 FROM inscripcion_circulo i
      WHERE i.id_usuario = u.id_usuario
        AND i.id_circulo = c.id_circulo
        AND i.fecha_baja IS NULL);

INSERT INTO favorito (id_usuario, id_libro)
SELECT u.id_usuario, l.id_libro
FROM usuario u
JOIN libro l ON l.isbn = '9781234567890'
WHERE u.correo = 'ana@biblioteca.local'
ON CONFLICT DO NOTHING;

INSERT INTO resena (id_usuario, id_libro, calificacion, comentario)
SELECT u.id_usuario, l.id_libro, 5, 'Excelente para discutir.'
FROM usuario u
JOIN libro l ON l.isbn = '9781234567890'
WHERE u.correo = 'ana@biblioteca.local'
ON CONFLICT (id_usuario, id_libro)
DO UPDATE SET
    calificacion = EXCLUDED.calificacion,
    comentario = EXCLUDED.comentario,
    fecha = CURRENT_TIMESTAMP;

