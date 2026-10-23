# Project Progress

## Estado actual

El repositorio está en fase de plantilla y definición. Contiene el briefing de Nexova en inglés y español, guías para las carpetas del monorepo, documentación comercial y la metadata inicial de `@repo/shared-types`.

Según la documentación actual, aún no hay aplicaciones ejecutables, scripts globales ni runner de workspace en la raíz. Tampoco se han documentado decisiones concretas sobre frameworks de interfaz, base de datos, proveedor de IA, autenticación o despliegue. Los casos de uso del briefing son necesidades propuestas; su implementación no está acreditada en el repositorio.

## Próximos pasos previstos

1. Elegir un caso de uso prioritario y definir usuarios, alcance y métricas de éxito.
2. Acordar las decisiones técnicas pendientes para ese caso, incluyendo datos disponibles, privacidad, permisos y evaluación.
3. Implementar un primer flujo vertical en las carpetas correspondientes, siguiendo las guías locales; documentar cómo configurarlo y ejecutarlo.
4. Validar el flujo con pruebas y métricas del dominio antes de ampliar el alcance o separar servicios.
5. Actualizar este archivo con entregables verificables, decisiones tomadas, bloqueos y los siguientes pasos reales.

## Seguimiento

### 2026-10-23 — Creación de `.agents/rules/` con reglas de desarrollo

**Qué se hizo:** Se creó la carpeta `.agents/rules/` con 5 reglas de desarrollo documentadas, alineadas con el BRIEFING, el memory bank y la documentación comercial de Nexova.

**Reglas creadas:**

| Archivo                        | Alcance        | Propósito                                                                                                   |
| ------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------------- |
| `monorepo-conventions.md`      | Siempre activa | Estructura, nombrado y colocación de código en el monorepo.                                                 |
| `ai-ethics-oversight.md`       | Siempre activa | Supervisión humana, explicabilidad, no discriminación y registro de auditoría en decisiones de IA.          |
| `data-privacy-security.md`     | Siempre activa | Minimización, control de acceso, retención y protección de datos personales (RGPD/CCPA).                    |
| `business-domain-alignment.md` | Por dominio    | Reglas comerciales y SLA específicos para selección, atención al cliente, capacitación, ventas y RR.HH.     |
| `memory-bank-discipline.md`    | Siempre activa | Lectura obligatoria al inicio de sesión y actualización del banco de memoria tras decisiones y entregables. |

**Decisión:** Se eligió un enfoque de 5 reglas que cubren: (1) organización del repositorio, (2) ética de IA, (3) privacidad y seguridad, (4) alineación con el dominio de negocio, y (5) disciplina del memory bank. Cada regla referencia los documentos fuente correspondientes. Las reglas se documentaron en Markdown dentro de `.agents/rules/` siguiendo el esquema solicitado.

### 2026-10-23 — Corrección de criterios de evaluación

**Qué se hizo:** Se corrigieron los dos criterios que no estaban cumplidos según la verificación de la rúbrica.

**Criterio 4 — Skill implementada:** Se creó `skills/candidate-matching/SKILL.md` con:

- **Objetivo único:** ranking semántico de candidatos por relevancia.
- **Inputs documentados:** `vacancy_text`, `candidates`, `top_k`, `min_score` con tipos, descripciones y ejemplo JSON.
- **Output documentado:** ranking con `score`, `factors` explicativos y `explanation` en texto.
- **Criterios de aceptación verificables:** 8 criterios (ranking determinista, scores en [0,1], factor explicativo, filtro min_score, tope top_k, test set mínimo, sin datos personales, tiempo de respuesta <5s para 100 candidatos).

**Criterio 5 — Apps canónicas:** Se actualizaron:

- `.agents/rules/monorepo-conventions.md`: se añadió `uis/website/` y `uis/backoffice/` como interfaces canónicas, y se prohibió explícitamente crear carpetas de aplicación en la raíz (`app/`, `web/`, `frontend/`, `backend/`).
- `memory-bank/techContext.md`: se actualizó la sección de frontend para mencionar `uis/website` y `uis/backoffice` como las dos aplicaciones canónicas.

**Archivos modificados/creados:**

- `skills/candidate-matching/SKILL.md` (nuevo)
- `.agents/rules/monorepo-conventions.md` (editado)
- `memory-bank/techContext.md` (editado)

**Próximo paso:** Elegir un caso de uso prioritario del BRIEFING e implementar el primer flujo vertical.
