# Instrucciones para agentes

Estas reglas aplican a todo el monorepo. Antes de modificar una carpeta, lee también su `README.md` local y sigue las instrucciones más específicas que contenga.

## Lectura al inicio de cada sesión

Antes de planificar o editar, lee estos archivos del banco de memoria en este orden:

1. `memory-bank/projectbrief.md`: propósito, alcance y criterios de éxito del proyecto.
2. `memory-bank/techContext.md`: estado tecnológico, arquitectura y restricciones conocidas.
3. `memory-bank/progress.md`: estado verificado, decisiones, bloqueos y próximos pasos.

Trata el progreso como fuente de estado, no como prueba de que una funcionalidad existe: contrástalo con el código antes de afirmarlo o cambiarlo. Si una tarea altera decisiones o entregables, actualiza el archivo de memoria pertinente.

## Flujo obligatorio antes de cada commit

Completa estos pasos en orden antes de crear cada commit:

1. Ejecuta `git status` y revisa los cambios existentes, incluidos los archivos staged y unstaged; conserva los cambios que no sean tuyos.
2. Inspecciona el diff completo y confirma que cada cambio corresponde a la tarea, sin incluir secretos, credenciales ni datos personales.
3. Ejecuta las pruebas, comprobaciones de tipos y lint relevantes para los archivos modificados. Si no hay una comprobación aplicable o no puede ejecutarse, deja constancia del motivo y del riesgo.
4. Actualiza la documentación y el banco de memoria cuando el cambio modifique comportamiento, arquitectura, decisiones o progreso verificable.
5. Comprueba si algún archivo protegido está afectado y obtén confirmación explícita del desarrollador antes de modificarlo; no incluyas esos cambios sin dicha confirmación.
6. Añade al staging solo las rutas de la tarea, inspecciona el diff staged y confirma que no contiene cambios ajenos. Solo entonces crea el commit.

No hagas el commit si falla una comprobación relevante, el diff incluye cambios ajenos o falta la confirmación requerida para una ruta protegida.

## Rutas protegidas

El agente puede leer estas rutas, pero no crearlas, editarlas, renombrarlas ni borrarlas sin confirmación explícita del desarrollador:

- `data/raw/` y cualquier archivo que contenga datos personales, confidenciales o de producción.
- Archivos de secretos o credenciales, incluidos `.env` y sus variantes, claves privadas, tokens y certificados.
- `infra/`, archivos `docker-compose*.yml` y configuraciones de despliegue o infraestructura.
- `.github/workflows/` y otros archivos que cambien CI/CD o permisos de automatización.
- `CONTEXT.md`, `CONTEXT.es.md`, `company-choice.md` y `BRIEFING.md`, que definen el contexto empresarial y del proyecto.
- Manifiestos y archivos de bloqueo de dependencias, incluidos `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `requirements*.txt`, `pyproject.toml` y equivalentes.

La confirmación debe autorizar el cambio concreto; una solicitud general de implementar otra funcionalidad no la sustituye. Si no está claro si un archivo contiene datos sensibles o controla despliegues, trátalo como protegido y pide confirmación antes de modificarlo.
