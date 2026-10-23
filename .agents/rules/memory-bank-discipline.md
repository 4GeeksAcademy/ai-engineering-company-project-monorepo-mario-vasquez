# Regla: Disciplina del Banco de Memoria

**Alcance:** Siempre activa — obligatoria al inicio de cada sesión y antes de cada commit.

## Propósito

El banco de memoria (`memory-bank/`) es la fuente de verdad compartida entre sesiones de desarrollo. Sin disciplina en su lectura y actualización, el trabajo pierde contexto, se duplican esfuerzos y se toman decisiones inconsistentes.

## Lectura obligatoria al inicio de cada sesión

Antes de planificar, editar código o tomar decisiones técnicas, leer en este orden:

1. `memory-bank/projectbrief.md` — propósito, alcance y criterios de éxito del proyecto.
2. `memory-bank/techContext.md` — estado tecnológico, arquitectura y restricciones conocidas.
3. `memory-bank/progress.md` — estado verificado, decisiones tomadas, bloqueos y próximos pasos.

## Cuándo actualizar

Actualizar el banco de memoria inmediatamente después de:

- Decidir una tecnología, framework, base de datos, proveedor de IA o mecanismo de autenticación.
- Implementar un flujo vertical completo (nuevo agente, skill, servicio o pipeline).
- Cambiar el alcance, los criterios de éxito o las restricciones del proyecto.
- Encontrar un bloqueo técnico o de negocio que afecte el plan.
- Completar un hito verificable.

## Cómo actualizar

### `memory-bank/progress.md`

- Mantener un registro cronológico de decisiones y entregables verificables.
- No registrar funcionalidades no implementadas como si existieran. Contrastar con el código antes de afirmar o cambiar el estado.
- Incluir: qué se hizo, por qué, qué decisión se tomó, qué archivos se crearon/modificaron, y el siguiente paso concreto.

### `memory-bank/techContext.md`

- Documentar decisiones técnicas con su justificación y alternativas consideradas.
- Mantener actualizado el stack, las dependencias y las restricciones conocidas.
- Incluir enlaces a archivos relevantes cuando sea posible.

## Reglas de integridad

- No editar `progress.md` sin haber verificado el estado real en el código.
- No eliminar entradas históricas de progreso. Añadir nuevas secciones o marcar como obsoleto si es necesario.
- Si una tarea altera decisiones documentadas, actualizar el archivo pertinente antes del commit.
- Mantener coherencia entre `memory-bank/`, `.agents/rules/` y la documentación en `docs/`.

## Referencias

- `AGENTS.md` — "antes de planificar o editar, lee estos archivos del banco de memoria en este orden"
- `AGENTS.md` — paso 4 del flujo pre-commit: "actualiza la documentación y el banco de memoria"
