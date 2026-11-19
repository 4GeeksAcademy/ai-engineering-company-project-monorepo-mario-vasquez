# Nexova Solutions — Sitio Web Corporativo

Sitio web corporativo de [Nexova Solutions](https://nexova.com), consultora de recursos humanos y adquisición de talento.

## Stack tecnológico

- **HTML5** con elementos semánticos y microdatos Schema.org
- **Tailwind CSS v3** vía CDN (`cdn.tailwindcss.com`) — sin paso de build
- **JavaScript vanilla** (`validation.js`) para validación de formularios
- **Serve** mediante `npx serve` (servidor de archivos estáticos sin configuración)

## Cómo ejecutar localmente (Codespaces / terminal)

```bash
# Desde la raíz del monorepo:
npx serve uis/website -l 3000
```

O desde esta carpeta:

```bash
cd uis/website
npm run dev
```

Luego abre http://localhost:3000 en el navegador.

### ¿Por qué `npx serve`?

- Funciona **sin instalación previa** en Codespaces (no requiere instalación global)
- Sirve archivos estáticos tal cual, sin paso de build
- Incluye SPA fallback, listado de directorios y cabeceras CORS
- El puerto `3000` se reenvía automáticamente en Codespaces

## Estructura del proyecto

```
uis/website/
├── index.html        # Página principal
├── application.html  # Formulario de solicitud de empleo
├── validation.js     # Validación de formularios
├── package.json      # Scripts de desarrollo
├── README.md         # Este archivo (en)
└── README.es.md      # Este archivo (es)
```

## Características

- Diseño responsive (móvil, tablet, escritorio)
- HTML semántico con Schema.org JSON-LD + microdatos
- Validación de 3 formularios (aplica rápido, contacto, solicitud completa)
- Accesible: labels, texto alternativo, atributos ARIA, gestión de foco
- Touch-friendly: objetivos táctiles mínimos de 44×44 px
