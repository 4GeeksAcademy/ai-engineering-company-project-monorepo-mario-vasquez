# Regla: Convenciones del Monorepo

**Alcance:** Siempre activa — aplica a todas las operaciones de creación, edición y organización de archivos en el repositorio.

## Propósito

Mantener una estructura de monorepo coherente y predecible, de modo que cualquier agente o desarrollador pueda localizar rápidamente el código, la documentación y los datos de cada dominio.

## Estructura de carpetas

| Carpeta        | Responsabilidad                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| `agents/`      | Agentes de IA (por ejemplo, agente de comunicación, agente RR.HH., clasificador de CV).                        |
| `data/`        | Datos sin procesar (`raw/`), pipelines (`pipelines/`), datos procesados (`processed/`) y evaluación (`eval/`). |
| `docs/`        | Documentación del proyecto y contexto de negocio (`business/`).                                                |
| `infra/`       | Configuración de infraestructura, Docker, CI/CD. **Ruta protegida** (no modificar sin confirmación).           |
| `internal/`    | Herramientas y procesos internos del equipo de ingeniería.                                                     |
| `mcps/`        | Implementaciones de MCP (Model Context Protocol) para integrar herramientas y sistemas.                        |
| `packages/`    | Paquetes compartidos (ej. `shared/` con tipos TypeScript).                                                     |
| `scripts/`     | Utilidades y scripts de automatización.                                                                        |
| `services/`    | Servicios backend (API, workers).                                                                              |
| `shared/`      | Recursos compartidos entre dominios.                                                                           |
| `skills/`      | Capacidades reutilizables de IA (code-review, data-analysis, research, etc.).                                  |
| `uis/`         | Interfaces de usuario (web pública, portal interno, paneles).                                                  |
| `workflows/`   | Orquestaciones y automatizaciones multi-paso.                                                                  |
| `memory-bank/` | Banco de memoria del proyecto (progreso, contexto técnico, brief).                                             |

## Convenciones de nombrado

- **Carpetas y archivos:** usar `kebab-case`. Ejemplo: `hiring-process-sla.md`, `cv-scoring-agent/`.
- **Paquetes compartidos:** prefijo `@repo/` (ej. `@repo/shared-types`).
- **Archivos README:** cada carpeta debe contener un `README.md` (y `README.es.md` si aplica) explicando su propósito, estructura y modo de uso.

## Reglas de colocación

1. **Backend API:** en `services/`, organizado por routers o módulos de dominio (no microservicios prematuros).
2. **Frontends:** en `uis/`. Las dos interfaces canónicas del proyecto son:
   - `uis/website/` — sitio web corporativo público (marketing, catálogo de capacitación, blog).
   - `uis/backoffice/` — aplicación interna (portal de RR.HH., paneles de selección, soporte y ventas).
     Otras interfaces (ej. portal de candidatos, portal de aprendizaje) también van dentro de `uis/`.
3. **No crear carpetas de aplicación en la raíz del monorepo.** Toda aplicación debe vivir en `uis/` (frontend) o `services/` (backend). Quedan prohibidas carpetas como `app/`, `web/`, `frontend/` o `backend/` en la raíz.
4. **Agentes de IA:** en `agents/`. Cada agente en su propia subcarpeta con `agent.py`, tests y README.
5. **Skills reutilizables:** en `skills/`. Seguir la plantilla `skills/_template/SKILL.md`.
6. **Workflows:** en `workflows/`. Cada workflow es un pipeline orquestado de varios pasos.
7. **Integraciones MCP:** en `mcps/`. Cada integración es un servidor o cliente MCP.

## Referencias

- `AGENTS.md` — instrucciones generales para agentes.
- `memory-bank/techContext.md` — decisiones tecnológicas y arquitectura.
- README locales de cada carpeta para reglas más específicas.
