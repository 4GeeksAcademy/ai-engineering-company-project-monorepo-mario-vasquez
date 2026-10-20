---
name: code-review
description: "Revisa cambios de codigo, pull requests o diffs para encontrar defectos accionables, regresiones y riesgos sin modificar archivos. Usar al pedir code review, revision de codigo o revision de diff."
---

# Revision de cambios de codigo

## Objetivo

Detectar defectos accionables introducidos por un conjunto de cambios y comunicar su impacto con evidencia. Esta skill revisa; no implementa correcciones.

## Cuando usarla

Usala cuando se solicite revisar un diff, un pull request o cambios locales buscando errores, regresiones o riesgos. No la uses para implementar una funcionalidad, refactorizar codigo ni hacer una auditoria general del repositorio.

## Inputs

### Obligatorios

- **Cambios a revisar:** un diff proporcionado, o la referencia del repositorio y los commits/base que delimitan el diff. Si solo se indica una rama o pull request, determina su diff antes de revisar.
- **Resultado esperado:** el objetivo del cambio o el comportamiento que deberia conservarse. Si no se proporciona, deducelo del diff y del contexto cercano; declara cualquier ambiguedad que afecte las conclusiones.

### Opcionales

- **Contexto relevante:** requisitos, restricciones, archivos relacionados o decisiones de diseno.
- **Comprobaciones existentes:** comandos, resultados de pruebas, lint o tipos ya ejecutados.
- **Enfoque solicitado:** areas especificas que requieren atencion, sin dejar de reportar otros defectos claros dentro del diff.

Si falta un input obligatorio y no puede inferirse con seguridad, pide solo la aclaracion necesaria antes de concluir.

## Procedimiento

1. Delimita el diff y entiende el resultado esperado; no asumas que cambios fuera del diff forman parte de la revision.
2. Lee el contexto inmediato de las lineas modificadas y las pruebas directamente relacionadas para comprobar contratos y efectos secundarios.
3. Busca solo defectos concretos causados por el cambio, como comportamiento incorrecto, regresiones, errores de seguridad o fallos en casos limite relevantes. Omite preferencias de estilo y especulaciones sin evidencia.
4. Para cada posible hallazgo, verifica que el escenario sea plausible, que el impacto sea concreto y que la ubicacion señale el cambio causante. Ejecuta una comprobacion enfocada si es segura, disponible y puede confirmar o descartar el defecto; no alteres el codigo.
5. Informa primero los hallazgos, ordenados por prioridad. Si no hay hallazgos, dilo explicitamente. Indica las comprobaciones ejecutadas o las limitaciones de validacion relevantes.

## Formato de salida

Cada hallazgo debe seguir este formato:

`[P1|P2|P3|P4] ruta/al/archivo:linea - titulo del defecto`

- **Problema:** describe el escenario que falla y por que el cambio lo causa.
- **Impacto:** explica la consecuencia observable para usuarios, datos u operacion.
- **Correccion sugerida:** indica el cambio minimo que resolveria el problema.

Prioridades: **P1** bloquea una funcion critica o puede causar dano grave; **P2** afecta una funcion importante en un uso comun; **P3** afecta un caso menos frecuente o tiene impacto moderado; **P4** tiene impacto bajo pero sigue siendo un defecto verificable. No asignes prioridad a observaciones que no sean defectos.

## Criterios de aceptacion

La revision esta completa solo si se cumplen todos estos criterios:

1. El diff revisado y el resultado esperado estan identificados; cualquier ambiguedad material esta declarada o se solicito aclaracion.
2. Cada hallazgo reportado apunta a una linea del cambio revisado e incluye prioridad, escenario de fallo, impacto y correccion sugerida.
3. No se incluyen hallazgos especulativos, preferencias de estilo ni problemas no causados por el cambio.
4. Si no se encontro ningun defecto, el resultado dice literalmente **"No se encontraron hallazgos."**
5. Se enumeran las comprobaciones ejecutadas y su resultado, o se indica que no se ejecutaron y por que.
6. No se modifican archivos durante la revision.
