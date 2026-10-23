# Regla: Ética, Supervisión Humana y Explicabilidad en IA

**Alcance:** Siempre activa — aplica a todo agente, skill, pipeline o sistema que genere clasificaciones, puntuaciones, recomendaciones o decisiones automatizadas mediante IA.

## Propósito

Las soluciones de IA en Nexova operan sobre procesos críticos de personas: selección de candidatos, evaluación de desempeño, atención al cliente y recomendaciones de capacitación. Ninguna decisión con impacto significativo sobre una persona debe ser automática e irreversible sin intervención humana.

## Principios

1. **Supervisión humana obligatoria:** toda puntuación de CV, clasificación de candidatos, recomendación de capacitación o propuesta comercial generada por IA debe ser revisable por un humano antes de ejecutarse.
2. **Explicabilidad contextual:** el sistema debe poder explicar por qué asignó una puntuación o recomendación, mostrando los factores que influyeron (ej. "coincidencia de habilidades técnicas 85%, experiencia en rol similar 70%, años de experiencia 60%").
3. **No discriminación:** los modelos y pipelines deben auditarse para evitar sesgos por género, edad, origen o cualquier otra característica protegida. Esto aplica especialmente a la puntuación de CV y selección de candidatos.
4. **Registro de auditoría:** cada inferencia que afecte a una persona (candidato, empleado, cliente) debe quedar registrada con: timestamp, entrada, salida,置信ianza y, si aplica, acción humana posterior.
5. **Derecho a revisión:** los candidatos y empleados deben poder solicitar revisión humana de cualquier decisión automatizada que les afecte.

## Aplicación por dominio

### Selección de talento (core business)

- La puntuación y ranking de CV es una **recomendación**, no una decisión final. El consultor debe poder ver los factores de puntuación y aceptar, modificar o rechazar el ranking.
- El agente de comunicación automatizada solo envía correos de estado si un humano ha definido o aprobado la plantilla y el disparador.

### Atención al cliente

- El chatbot de primera línea debe identificar cuándo no puede resolver una consulta y escalar a un agente humano sin fricción.
- El análisis de sentimiento de tickets alerta a supervisores, pero no toma acciones automáticas (ej. escalar o cerrar tickets).

### Capacitación corporativa

- Las recomendaciones de programas son sugerencias. El cliente o el equipo de capacitación decide el plan final.

### Ventas

- Las propuestas personalizadas generadas por IA son borradores. El SDR o account manager revisa y ajusta antes de enviar.

## Referencias

- `BRIEFING.md` — "CV scoring pipeline with explainable rankings"
- `memory-bank/projectbrief.md` — "las puntuaciones de IA deben ser evaluables, explicables y sujetas a supervisión humana"
- `memory-bank/techContext.md` — "no tratarlas como decisiones automáticas definitivas"
- `docs/business/pricing-model.md` — contexto de márgenes y precios que las propuestas deben respetar
- `docs/business/prospect-objections.md` — objeciones comerciales que un agente de ventas debe conocer antes de sugerir propuestas
