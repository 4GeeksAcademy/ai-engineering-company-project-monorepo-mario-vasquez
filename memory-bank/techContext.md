# Technical Context

## Estado tecnológico

Este repositorio parte de una plantilla de monorepo con documentación y estructura por responsabilidades. Aún no contiene aplicaciones ejecutables ni scripts globales en la raíz, y no hay un runner de workspace configurado. Existe el paquete privado `@repo/shared-types` en `packages/shared/`, con metadatos para tipos compartidos en TypeScript; todavía no define scripts de ejecución.

## Stack y arquitectura

- **Backend:** la guía del repositorio recomienda una API centralizada con FastAPI, organizada por routers o módulos de dominio. Es una recomendación arquitectónica, no una implementación existente.
- **Frontend:** las interfaces deben vivir en `uis/`. Las dos aplicaciones canónicas del proyecto son `uis/website/` (sitio web corporativo público) y `uis/backoffice/` (aplicación interna para RR.HH., selección, soporte y ventas). Cualquier otra interfaz (portal de candidatos, portal de aprendizaje) también va dentro de `uis/`. No se ha elegido framework de frontend.
- **Datos:** `data/` separa fuentes, pipelines, datos procesados y evaluación.
- **IA:** `agents/` aloja agentes; `skills/` contiene capacidades reutilizables y `mcps/` integra herramientas y sistemas mediante MCP.
- **Automatización y operaciones:** `workflows/` alberga orquestaciones; `infra/` y `scripts/` se reservan para infraestructura y utilidades.
- **Tipos compartidos:** `packages/shared/` contiene la base del paquete TypeScript `@repo/shared-types`.

La guía aconseja empezar con un backend central y evitar microservicios prematuros. Se pueden separar workers cuando exista una necesidad operativa real.

## Sistemas existentes en el negocio

El briefing menciona HubSpot, Zendesk heredado, Google Workspace, un ATS propio antiguo y hojas de cálculo. Son parte del entorno actual de Nexova; el repositorio no especifica integraciones implementadas con ellos.

## Decisiones pendientes y restricciones

- No están definidos el framework de frontend, la base de datos, el proveedor o modelo de IA, el almacén vectorial, el mecanismo de autenticación ni el entorno de despliegue.
- No asumir que los sistemas del negocio ya tienen APIs disponibles; validar acceso, formatos y permisos antes de diseñar integraciones.
- Los datos de candidatos, empleados y clientes pueden ser sensibles. Antes de procesarlos se deben definir minimización, control de acceso, retención y protección de datos personales, atendiendo a las obligaciones aplicables en España y Estados Unidos.
- Las puntuaciones y recomendaciones de IA relacionadas con selección o personas deben ser evaluables, explicables en su contexto y sujetas a supervisión humana; no deben tratarse como decisiones automáticas definitivas.
- Mantener `CONTEXT.md` y `CONTEXT.es.md` alineados si cambia el contexto de empresa. Cada nueva app, servicio, agente o pipeline debe documentarse en su carpeta correspondiente.
