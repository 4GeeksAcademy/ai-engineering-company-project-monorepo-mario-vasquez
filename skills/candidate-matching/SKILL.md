# Skill: Candidate Matching

**Objetivo único:** Dado el texto de una solicitud de vacante y una colección de CVs candidatos, producir un ranking ordenado por relevancia con puntuaciones explicables, utilizando búsqueda semántica y coincidencia de habilidades.

## Inputs documentados

| Parámetro      | Tipo         | Descripción                                                                                                                                                |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vacancy_text` | `string`     | Descripción completa de la vacante (título, responsabilidades, requisitos, seniority, idiomas).                                                            |
| `candidates`   | `list[dict]` | Lista de candidatos. Cada dict debe contener: `id` (string), `cv_text` (string), `metadata` (dict opcional con `years_experience`, `skills`, `languages`). |
| `top_k`        | `int`        | Número máximo de candidatos a retornar en el ranking. Default: `10`.                                                                                       |
| `min_score`    | `float`      | Puntuación mínima (0–1) para incluir un candidato en el ranking. Default: `0.0`.                                                                           |

### Ejemplo de input

```json
{
  "vacancy_text": "Buscamos un Sales Manager con 5+ años en ventas B2B, inglés C1, experiencia en CRM y negociación con clientes enterprise.",
  "candidates": [
    {
      "id": "C001",
      "cv_text": "Experiencia de 5 años en ventas B2B en sector tecnológico. Manejo de CRM Salesforce. Inglés avanzado. Negociación de contratos enterprise.",
      "metadata": {
        "years_experience": 5,
        "skills": ["ventas B2B", "negociación", "CRM", "cuentas enterprise"],
        "languages": ["español nativo", "inglés C1"]
      }
    }
  ],
  "top_k": 5,
  "min_score": 0.3
}
```

## Output

```json
{
  "vacancy_id": "V-2026-001",
  "rankings": [
    {
      "candidate_id": "C001",
      "score": 0.87,
      "factors": {
        "semantic_similarity": 0.91,
        "skills_match": 0.85,
        "experience_match": 0.8,
        "language_match": 1.0
      },
      "explanation": "Alta coincidencia semántica con el perfil de ventas B2B. El candidato cumple todos los idiomas requeridos y tiene 5 de 5+ años solicitados."
    }
  ],
  "runtime_ms": 234
}
```

## Criterios de aceptación verificables

1. **Ranking determinista:** dado el mismo input y configuración, el ranking debe ser reproducible (mismo orden y puntuaciones).
2. **Puntuaciones en [0,1]:** cada `score` global debe ser un float entre 0 y 1, donde 1 es coincidencia perfecta.
3. **Factor explicativo:** cada resultado debe incluir al menos 2 factores (p.ej. `semantic_similarity`, `skills_match`) que descompongan la puntuación global.
4. **Filtro por score mínimo:** candidatos con `score < min_score` no deben aparecer en el ranking.
5. **Tope top_k:** el ranking no debe exceder `top_k` resultados, incluso si hay más candidatos que superan `min_score`.
6. **Conjunto de prueba mínimo:** la skill debe incluir o referenciar un conjunto de prueba con al menos 2 candidatos y 1 vacante.
7. **Sin datos personales en el output:** el output no debe contener nombre, email, teléfono ni otro dato personal del candidato a menos que se solicite explícitamente.
8. **Tiempo de respuesta:** el ranking para 100 candidatos debe completarse en menos de 5 segundos en hardware de desarrollo.

## Dependencias técnicas sugeridas

- `sentence-transformers` o equivalente para generar embeddings
- `scikit-learn` para similitud coseno
- Almacén vectorial a definir (para la integración RAG completa)

## Integración en el monorepo

| Componente                               | Ubicación                          |
| ---------------------------------------- | ---------------------------------- |
| Pipeline de matching (lógica central)    | `services/candidate-matching/`     |
| Endpoint REST que expone el ranking      | `services/api/routers/matching.py` |
| Frontend de consulta (portal candidatos) | `uis/website/` o `uis/backoffice/` |
| Agente que activa el matching            | `agents/talent-selection/`         |

## Referencias

- `BRIEFING.md` — sección de selección: "RAG system over the candidate database"
- `memory-bank/projectbrief.md` — "clasificación y puntuación explicable de CV"
- `docs/business/hiring-process-sla.md` — SLA por tipo de búsqueda
- `memory-bank/techContext.md` — stack y decisiones técnicas
- `.agents/rules/ai-ethics-oversight.md` — supervisión humana en ranking de candidatos
