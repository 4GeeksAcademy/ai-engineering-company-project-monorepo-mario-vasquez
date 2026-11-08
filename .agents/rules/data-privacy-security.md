# Regla: Privacidad de Datos y Seguridad

**Alcance:** Siempre activa — aplica a cualquier operación que lea, procese, almacene o transmita datos personales, confidenciales o de producción.

## Propósito

Nexova maneja datos sensibles de candidatos, empleados y clientes en múltiples jurisdicciones (España — RGPD, y Estados Unidos — CCPA/FCRA). El incumplimiento tiene consecuencias legales, reputacionales y contractuales graves.

## Principios obligatorios

1. **Minimización:** solo recoger y procesar los datos estrictamente necesarios para la función. No almacenar datos derivados o enriquecidos sin justificación documentada.
2. **Control de acceso:** ningún sistema, agente o pipeline debe exponer datos personales sin autenticación y autorización explícitas.
3. **Retención limitada:** los datos personales deben tener una política de retención documentada. No conservar indefinidamente.
4. **Protección en tránsito y reposo:** todo dato personal debe cifrarse en tránsito (TLS) y en reposo (cifrado simétrico seguro).
5. **Datos sintéticos para desarrollo:** siempre que sea posible, usar datos sintéticos o anonimizados en entornos que no sean de producción.

## Restricciones específicas

| Tipo de dato                               | Restricción                                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| CV, datos de candidatos                    | No almacenar fuera del sistema de selección sin consentimiento explícito. No compartir con clientes sin autorización del candidato. |
| Datos de empleados Nexova                  | Solo accesibles para RR.HH. y el empleado correspondiente. Nunca expuestos en paneles de uso general.                               |
| Datos de clientes (facturación, contratos) | Acceso restringido a Ventas, Dirección y Finanzas.                                                                                  |
| Conversaciones de soporte                  | No usar para entrenar modelos sin anonimización previa y consentimiento.                                                            |

## Rutas protegidas (confirmación requerida para modificar)

Las siguientes rutas no deben crearse, editarse, renombrarse ni eliminarse sin confirmación explícita del desarrollador:

- `data/raw/` y archivos con datos personales, confidenciales o de producción.
- Archivos `.env` y variantes, claves privadas, tokens y certificados.
- `infra/`, `docker-compose*.yml` y configuraciones de despliegue.
- `.github/workflows/` y archivos de CI/CD.
- `CONTEXT.md`, `CONTEXT.es.md`, `company-choice.md`, `BRIEFING.md`.
- Manifiestos de dependencias (`package.json`, `requirements*.txt`, `pyproject.toml`, `pnpm-lock.yaml`, etc.).

## Referencias

- `memory-bank/techContext.md` — "los datos de candidatos, empleados y clientes pueden ser sensibles; definir minimización, control de acceso, retención y protección"
- `AGENTS.md` — lista completa de rutas protegidas y flujo pre-commit
- `BRIEFING.md` — contexto de operaciones en España y EE.UU.
