#!/usr/bin/env bash
set -euo pipefail

dir=$(cd "$(dirname "$0")" && pwd)
sql=$(mktemp -d)
trap 'rm -f "$sql"/*.sql; rmdir "$sql"' EXIT
cp "$dir"/../db/migrations/*.sql "$sql/"

# Se adapta una copia de V6 para conservar el checksum de las instalaciones locales.
python3 - "$sql/V6__grant_application_privileges.sql" <<'PY'
from pathlib import Path
import sys
file = Path(sys.argv[1])
source = file.read_text()
old = 'GRANT CONNECT ON DATABASE biblioteca TO biblioteca_app;'
new = """DO $grant$
BEGIN
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO biblioteca_app', current_database());
END
$grant$;"""
if source.count(old) != 1:
    raise SystemExit("Revisar la adaptación de V6 para Render.")
file.write_text(source.replace(old, new))
PY

if [[ -n ${FLYWAY_BIN:-} ]]; then
    "$FLYWAY_BIN" "-locations=filesystem:$sql" migrate
else
    export FLYWAY_SQL_DIR="$sql"
    chmod 755 "$sql"
    docker compose -f "$dir/compose.yaml" run --rm migrate
fi
