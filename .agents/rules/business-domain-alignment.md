# Regla: Alineación con el Dominio de Negocio

**Alcance:** Se activa cuando se crean o modifican agentes, flujos, pipelines o documentación que interactúan con procesos de negocio de Nexova — especialmente selección, atención al cliente, capacitación, ventas y RR.HH.

## Propósito

Nexova no es una empresa de tecnología genérica. Cada servicio tiene condiciones comerciales, SLA, procesos operativos y restricciones documentadas. Las soluciones deben respetar estas condiciones; ignorarlas produce entregables que no pueden usarse en el mundo real.

## Reglas por dominio

### 1. Selección de talento (headhunting)

- **SLA por tipo de búsqueda:**
  - Perfil ejecutivo (C-level, VP): 8 semanas promedio, shortlist de 3 candidatos.
  - Perfil gerencial (director, manager): 6 semanas promedio, shortlist de 3-4 candidatos.
  - Perfil técnico especializado: 5 semanas promedio, shortlist de 3 candidatos.
- **Escalamiento:** si a las 4 semanas de una búsqueda ejecutiva no hay candidatos calificados, el agente debe escalar a Javier Almeida y notificar al cliente con un plan de acción.
- **Modelo de precios:** honorario estándar 22% del salario bruto anual. Facturación: 30/30/40 (inicio, shortlist, contratación). Garantía de reemplazo gratis por 6 meses.
- **Sin descuento sin aprobación:** nunca ofrecer descuento sobre 22% sin aprobación de Marcos Ibáñez.

### 2. Atención al cliente externalizada

- **SLA:** 24 horas de tiempo de resolución comprometido. El promedio actual es 48 horas. El objetivo del chatbot de primera línea es resolver 40% de consultas sin intervención humana.
- **Precio:** 1,800–2,400 USD/mes por agente según especialización e idioma.
- **Contrato mínimo:** 6 meses. Penalización por cancelación anticipada: un mes de tarifa.
- **Tamaño mínimo de equipo:** 5 agentes.
- El chatbot debe escalar a humano cuando no pueda resolver.

### 3. Capacitación corporativa

- **Duración de programas:** 4 semanas (desde 3,500 USD), 8 semanas (desde 6,200 USD), 12 semanas (desde 8,900 USD). Grupos de hasta 15 personas.
- **Grupos grandes (>15):** requieren cotización personalizada.
- Las recomendaciones deben considerar el perfil del cliente y el catálogo disponible.
- El sistema de inscripciones debe reemplazar el formulario de Google y la hoja de cálculo actuales.

### 4. Ventas y desarrollo de negocio

- **CRM:** HubSpot. Solo 40% del equipo lo actualiza. Las soluciones deben reducir la fricción de actualización.
- **Secuencias de prospección:** primer contacto → seguimiento → cerrar o descartar.
- Las propuestas generadas por IA deben respetar el modelo de precios y las objeciones documentadas.
- **Objeciones conocidas:** el agente debe poder responder a las 4 objeciones documentadas en `docs/business/prospect-objections.md` sin improvisar condiciones no autorizadas.

### 5. RR.HH. interno

- Procesos actuales: correo electrónico + hojas de cálculo. El agente interno debe responder según políticas y beneficios documentados.
- Las evaluaciones de desempeño son semestrales y no deben automatizarse más allá de recordatorios y recolección.

## Referencias obligatorias

Antes de diseñar soluciones para cualquier dominio, leer:

- `docs/business/hiring-process-sla.md`
- `docs/business/pricing-model.md`
- `docs/business/prospect-objections.md`
- `docs/business/service-lines.md`
- `BRIEFING.md` — descripción completa de cada departamento
- `memory-bank/projectbrief.md` — objetivos y criterios de éxito del proyecto
