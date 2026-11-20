-- Se ejecuta una vez al crear el volumen de PostgreSQL.
CREATE ROLE biblioteca_owner NOLOGIN;
CREATE ROLE biblioteca_app LOGIN PASSWORD '123';

GRANT USAGE, CREATE ON SCHEMA public TO biblioteca_owner;
