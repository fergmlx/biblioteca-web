# Biblioteca · API Java y PostgreSQL

`backend/` contiene el WAR Jakarta Servlet 6.1 (Java 21). `database/` contiene el esquema, las migraciones Flyway y el arranque de PostgreSQL para desarrollo. `postman/` contiene la colección y el entorno de pruebas. El proyecto Angular se ejecuta desde su propio repositorio en localhost.

## 1. Crear PostgreSQL en Render

En **New → Postgres** usa el nombre de servicio **biblioteca-pg**, nombre de base **biblioteca**, PostgreSQL 18, región **Oregon** y plan **Free**. Espera a que aparezca **Available**. En **Connect** encontrarás el host externo para trabajar desde tu equipo y el interno para el servicio Java. Si limitas el acceso externo, incluye la IP desde la que ejecutarás las migraciones.

Desde Bash, situado en este repositorio, prepara las variables. Usa el usuario administrador generado por Render y conserva la contraseña aleatoria de la aplicación en tu gestor de contraseñas. Las variables del shell sólo duran la sesión.

```bash
read -rp 'Host externo de Render: ' PGHOST
read -rp 'Usuario de Render: ' PGUSER
read -rsp 'Contraseña de Render: ' PGPASSWORD; echo
export PGHOST PGUSER PGPASSWORD PGPORT=5432 PGDATABASE=biblioteca PGSSLMODE=require
export BIBLIOTECA_APP_PASSWORD="$(openssl rand -hex 24)"
psql -X -f database/render/bootstrap.psql
export FLYWAY_URL="jdbc:postgresql://${PGHOST}:5432/biblioteca?sslmode=require"
export FLYWAY_USER="$PGUSER" FLYWAY_PASSWORD="$PGPASSWORD"
docker compose -f database/render/compose.yaml run --rm migrate
psql -X -c 'SELECT id_libro, titulo FROM public.libro ORDER BY titulo'
```

El bootstrap crea `biblioteca_owner` y `biblioteca_app`. Si vuelves a ejecutarlo, usa la contraseña de aplicación original. Flyway registra qué migraciones aplicó. La migración V2 carga datos de ejemplo. Estas instrucciones inicializan una base nueva. Para conservar registros adicionales de un volumen Docker existente, hace falta una exportación de ese volumen.

## 2. Probar Java local con la base remota

Desde el mismo shell, con Docker disponible:

```bash
docker build -t biblioteca-api backend
export DB_URL="$FLYWAY_URL" DB_USER=biblioteca_app DB_PASSWORD="$BIBLIOTECA_APP_PASSWORD"
docker run --rm -p 127.0.0.1:8080:8080 -e DB_URL -e DB_USER -e DB_PASSWORD biblioteca-api
```

En otra terminal, abre `http://localhost:8080/biblioteca-backend/api/libros`. Compara un par `idLibro` y `titulo` con la consulta SQL. Para desarrollo totalmente local, el Compose de la raíz inicia PostgreSQL y Flyway con `docker compose up -d`. El archivo `backend/db.properties.example` muestra la configuración para ejecutar el WAR en tu servidor Java.

## 3. Publicar el servicio web

En **New → Blueprint**, conecta este repositorio y selecciona la rama que contiene `render.yaml`. El archivo enlaza el host interno de la base ya creada y solicita **DB_PASSWORD**. Introduce la contraseña de `biblioteca_app`. Render genera **DEMO_API_KEY**. Comprueba que se indique **Free** y aplica el Blueprint. El contenedor escucha en el puerto que Render le asigna.

Cuando el servicio indique **Live**, copia el dominio HTTPS de su panel. Añade `/biblioteca-backend/api/libros` y compara el mismo UUID y título con los resultados de localhost y PostgreSQL. También puedes consultar `/biblioteca-backend/api/autores` y `/biblioteca-backend/api/generos`.

## 4. Probar con Postman y Angular

Importa los dos archivos `Biblioteca.postman_*.json`. Duplica **Biblioteca Local** como **Biblioteca Render** y configura:

| Variable | Valor en el entorno Render |
| --- | --- |
| `base_url` | Dominio HTTPS real seguido de `/biblioteca-backend` |
| `demo_api_key` | Valor local y secreto de **DEMO_API_KEY** del servicio |

La colección envía `X-Demo-Key`. El despliegue permite lecturas públicas de libros, autores, países, géneros y sus relaciones de catálogo. Para consultar usuarios, acceder a préstamos o escribir, se requiere la clave del equipo. Es un control compartido para la práctica. El sistema de sesiones individuales sigue pendiente. Ejecuta pruebas que escriban o borren únicamente sobre datos de ensayo.

Desde el repositorio Angular, ejecuta `BIBLIOTECA_API_ORIGIN=https://DOMINIO-REAL pnpm start` y abre `http://localhost:4200/api/libros`. Las pantallas existentes usan datos de demostración en localStorage. El proxy permite probar el recorrido localhost → Render → PostgreSQL desde ese mismo origen.

## Contraseñas

El alta de usuario y los cambios por PUT/PATCH reciben `contrasena`. Java deriva un hash PBKDF2-HMAC-SHA-256 con sal aleatoria de 16 bytes y 600 000 iteraciones. Guarda el algoritmo, iteraciones, sal y resultado en `contrasena_hash`. Un cambio de contraseña y los demás campos del usuario se guardan en la misma sentencia. La API omite la contraseña y el hash de sus respuestas. Los registros anteriores conservan su valor hasta que se les cambie la contraseña. Las cuentas semilla de V2 contienen marcadores de demostración.

Render Postgres Free caduca 30 días después del alta y carece de copias de seguridad gestionadas. Guarda una exportación con `pg_dump` si necesitas los datos después de la entrega. El servicio web Free entra en reposo tras 15 minutos sin tráfico. [Documentación de Render](https://render.com/docs/free)
