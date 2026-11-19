/**
 * validation.js — Validación de formularios de Nexova Solutions
 *
 * Cubre los 3 formularios del sitio:
 *   - form[action="/api/aplica"]   (captación rápida de candidatos)
 *   - form[action="/api/contacto"]  (contacto de clientes)
 *   - form[action="/api/candidatos"] (solicitud detallada de empleo)
 *
 * Sin dependencias.
 *
 * Funcionalidades:
 *   - Validación al perder el foco (blur)
 *   - Validación en tiempo real mientras escribe (input con debounce 300ms)
 *   - Validación completa en submit con prevención de envío si hay errores
 *   - Banner resumen de errores en la parte superior del formulario
 *   - Marcado de TODOS los campos como "tocados" al hacer submit
 *   - Deshabilitado del botón de envío durante validación (evita doble clic)
 *   - Restauración del botón en reset o si hay errores
 *   - Estados visuales: rojo (error), verde (éxito), gris (neutro)
 *   - Mensajes de error personalizados por campo y regla
 *   - Animaciones fade-in en mensajes de feedback
 *   - Soporte para text, email, tel, url, number, select, checkbox, file
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. REGLAS DE VALIDACIÓN
  // ──────────────────────────────────────────────

  const RULES = {
    /**
     * required: el campo no puede estar vacío.
     * Para selects, el primer <option value=""> se considera vacío.
     * Para checkboxes, al menos uno debe estar marcado.
     * Para files, al menos un archivo debe estar seleccionado.
     */
    required: {
      validate: function (el) {
        if (el.type === 'checkbox') return el.checked;
        if (el.type === 'file')   return el.files && el.files.length > 0;
        if (el.tagName === 'SELECT') return el.value !== '';
        return el.value.trim().length > 0;
      },
      message: 'Este campo es obligatorio.',
    },

    /** email: formato de correo electrónico básico */
    email: {
      validate: function (el) {
        if (!el.value.trim()) return true; // vacío se omite (usar required aparte)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      },
      message: 'Introduce un correo electrónico válido (ej: nombre@dominio.com).',
    },

    /** minLength: longitud mínima de caracteres */
    minLength: {
      validate: function (el, min) {
        if (!el.value.trim()) return true;
        return el.value.trim().length >= parseInt(min, 10);
      },
      message: function (el, min) {
        return `Debe tener al menos ${min} caracteres.`;
      },
    },

    /** maxLength: longitud máxima de caracteres */
    maxLength: {
      validate: function (el, max) {
        if (!el.value.trim()) return true;
        return el.value.trim().length <= parseInt(max, 10);
      },
      message: function (el, max) {
        return `No puede superar los ${max} caracteres.`;
      },
    },

    /** tel: formato de teléfono español/internacional */
    tel: {
      validate: function (el) {
        if (!el.value.trim()) return true;
        // Acepta: +34 600 000 000, 600000000, +1 (305) 555-0100, etc.
        return /^[\d\s\+\(\)\-]{7,20}$/.test(el.value.trim());
      },
      message: 'Introduce un número de teléfono válido (ej: +34 600 000 000).',
    },

    /** url: formato de URL básico */
    url: {
      validate: function (el) {
        if (!el.value.trim()) return true;
        try {
          new URL(el.value.trim());
          return true;
        } catch (_) {
          return false;
        }
      },
      message: 'Introduce una URL válida (ej: https://linkedin.com/in/tu-perfil).',
    },

    /** number: debe ser numérico y opcionalmente dentro de un rango */
    number: {
      validate: function (el) {
        if (!el.value.trim()) return true;
        return !isNaN(parseFloat(el.value)) && isFinite(el.value);
      },
      message: 'Introduce un valor numérico válido.',
    },

    /** min: valor mínimo (para number) */
    min: {
      validate: function (el, min) {
        if (!el.value.trim()) return true;
        return parseFloat(el.value) >= parseFloat(min);
      },
      message: function (el, min) {
        return `El valor mínimo es ${min}.`;
      },
    },

    /** pattern: expresión regular personalizada */
    pattern: {
      validate: function (el, pattern) {
        if (!el.value.trim()) return true;
        return new RegExp(pattern).test(el.value.trim());
      },
      message: 'El formato introducido no es válido.',
    },

    /** fileSize: tamaño máximo en MB */
    fileSize: {
      validate: function (el, maxMB) {
        if (!el.files || el.files.length === 0) return true;
        const maxBytes = parseFloat(maxMB) * 1024 * 1024;
        return Array.from(el.files).every(function (f) { return f.size <= maxBytes; });
      },
      message: function (el, maxMB) {
        return `El archivo no puede superar los ${maxMB} MB.`;
      },
    },

    /** fileType: extensiones de archivo permitidas */
    fileType: {
      validate: function (el, extensions) {
        if (!el.files || el.files.length === 0) return true;
        var allowed = extensions.split(',').map(function (e) { return e.trim().toLowerCase(); });
        return Array.from(el.files).every(function (f) {
          var ext = f.name.split('.').pop().toLowerCase();
          return allowed.indexOf('.' + ext) !== -1;
        });
      },
      message: function (el, extensions) {
        return 'Solo se permiten archivos: ' + extensions + '.';
      },
    },

    /** minSelect: para selects con optgroup, al menos N opciones seleccionadas (no usado actualmente) */

    /** dni: formato de DNI/NIE español */
    dni: {
      validate: function (el) {
        if (!el.value.trim()) return true;
        // DNI: 8 dígitos + letra
        // NIE: X/Y/Z + 7 dígitos + letra
        // Pasaporte: alfanumérico genérico
        return /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z]|[A-Z]{2,3}\d{6,7})$/.test(el.value.trim().toUpperCase());
      },
      message: 'Introduce un DNI (12345678A), NIE (X1234567L) o pasaporte válido.',
    },

    /** salario: valida que min <= max si ambos están presentes */
    salaryRange: {
      validate: function (el) {
        var form = el.closest('form');
        if (!form) return true;
        var minEl = form.querySelector('[name="salarial-min"]');
        var maxEl = form.querySelector('[name="salarial-max"]');
        if (!minEl || !maxEl) return true;
        var minVal = minEl.value.trim();
        var maxVal = maxEl.value.trim();
        if (!minVal || !maxVal) return true; // uno o ambos vacíos → OK (son opcionales)
        return parseFloat(minVal) <= parseFloat(maxVal);
      },
      message: 'El salario mínimo no puede ser mayor que el máximo.',
    },
  };

  // ──────────────────────────────────────────────
  // 1b. ESTADO DE CAMPOS "TOCADOS"
  // ──────────────────────────────────────────────

  /**
   * WeakSet que almacena los campos que han perdido el foco al menos una vez.
   * Solo los campos "tocados" se validan en tiempo real (input).
   */
  var touchedFields = new WeakSet();

  // ──────────────────────────────────────────────
  // 2. REGLAS PERSONALIZADAS POR FORMULARIO
  // ──────────────────────────────────────────────

  /**
   * Definiciones de validación por campo.
   * Cada campo puede tener una o más reglas.
   * Formato: { regla: valor } o { regla: true } si no necesita parámetro.
   *
   * Se aplican SOLO si el campo está presente en el DOM.
   */
  var FORMS_CONFIG = {
    'form[action="/api/aplica"]': {
      'nombre':   { required: true, minLength: 2, pattern: '^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\\s\\.\\,\\-\\\']+$',
        _messages: { required: 'El nombre es obligatorio.', minLength: 'El nombre debe tener al menos 2 caracteres.', pattern: 'El nombre solo puede contener letras y espacios.' } },
      'email':    { required: true, email: true,
        _messages: { required: 'El correo electrónico es obligatorio.', email: 'Introduce un correo válido, como nombre@dominio.com.' } },
      'telefono': { tel: true,
        _messages: { tel: 'Introduce un teléfono válido, ej: +34 600 000 000.' } },
      'puesto':   { required: true,
        _messages: { required: 'Selecciona un puesto al que deseas postularte.' } },
      'cv':       { required: true, fileType: '.pdf,.doc,.docx', fileSize: 10,
        _messages: { required: 'Adjunta tu currículum (PDF o Word).', fileType: 'El archivo debe ser PDF o Word (.pdf, .doc, .docx).', fileSize: 'El archivo no puede superar los 10 MB.' } },
      'mensaje':  { maxLength: 3000,
        _messages: { maxLength: 'El mensaje no puede superar los 3000 caracteres.' } },
    },
    'form[action="/api/contacto"]': {
      'nombre':          { required: true, minLength: 2,
        _messages: { required: 'El nombre es obligatorio.', minLength: 'El nombre debe tener al menos 2 caracteres.' } },
      'email':           { required: true, email: true,
        _messages: { required: 'El correo electrónico es obligatorio.', email: 'Introduce un correo válido, como nombre@dominio.com.' } },
      'empresa':         {},
      'servicio':        { required: true,
        _messages: { required: 'Selecciona el servicio que te interesa.' } },
      'mensaje':         { required: true, minLength: 10, maxLength: 5000,
        _messages: { required: 'Escribe un mensaje para que podamos ayudarte.', minLength: 'El mensaje debe tener al menos 10 caracteres.', maxLength: 'El mensaje no puede superar los 5000 caracteres.' } },
    },
    'form[action="/api/candidatos"]': {
      'nombre':            { required: true, minLength: 2, pattern: '^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\\s\\.\\,\\-\\\']+$',
        _messages: { required: 'El nombre completo es obligatorio.', minLength: 'El nombre debe tener al menos 2 caracteres.', pattern: 'El nombre solo puede contener letras y espacios.' } },
      'email':             { required: true, email: true,
        _messages: { required: 'El correo electrónico es obligatorio.', email: 'Introduce un correo válido, como nombre@dominio.com.' } },
      'dni':               { required: true, dni: true,
        _messages: { required: 'El DNI o NIE es obligatorio.', dni: 'Introduce un DNI (12345678A), NIE (X1234567L) o pasaporte válido.' } },
      'telefono':          { required: true, tel: true,
        _messages: { required: 'El teléfono es obligatorio.', tel: 'Introduce un teléfono válido, ej: +34 600 000 000.' } },
      'pais':              { required: true,
        _messages: { required: 'Selecciona tu país de residencia.' } },
      'ciudad':            {},
      'formacion-nivel':   { required: true,
        _messages: { required: 'Selecciona tu nivel de formación.' } },
      'formacion-titulo':  { required: true, minLength: 2,
        _messages: { required: 'Indica el título que has obtenido.', minLength: 'El título debe tener al menos 2 caracteres.' } },
      'formacion-centro':  {},
      'origen':            {},
      'puesto':            { required: true,
        _messages: { required: 'Selecciona el puesto al que deseas postularte.' } },
      'experiencia':       { required: true,
        _messages: { required: 'Indica tu nivel de experiencia profesional.' } },
      'movilidad':         { required: true,
        _messages: { required: 'Indica tu disponibilidad para viajar.' } },
      'disponibilidad':    { required: true,
        _messages: { required: 'Indica tu disponibilidad para incorporarte.' } },
      'salarial-min':      { number: true, min: 0, salaryRange: true,
        _messages: { number: 'Introduce un valor numérico válido.', min: 'El salario mínimo no puede ser negativo.' } },
      'salarial-max':      { number: true, min: 0, salaryRange: true,
        _messages: { number: 'Introduce un valor numérico válido.', min: 'El salario máximo no puede ser negativo.' } },
      'habilidades':       { required: true, minLength: 3,
        _messages: { required: 'Indica tus habilidades principales.', minLength: 'Describe tus habilidades con al menos 3 caracteres.' } },
      'idioma-principal':  { required: true,
        _messages: { required: 'Selecciona tu idioma principal.' } },
      'idioma-nivel':      { required: true,
        _messages: { required: 'Selecciona tu nivel de idioma.' } },
      'idioma-segundo':    {},
      'mensaje':           { maxLength: 3000,
        _messages: { maxLength: 'El mensaje no puede superar los 3000 caracteres.' } },
      'cv':                { required: true, fileType: '.pdf,.doc,.docx', fileSize: 10,
        _messages: { required: 'Adjunta tu currículum (PDF o Word).', fileType: 'El archivo debe ser PDF o Word (.pdf, .doc, .docx).', fileSize: 'El archivo no puede superar los 10 MB.' } },
      'recomendacion':     { fileType: '.pdf,.doc,.docx,.jpg,.jpeg,.png', fileSize: 10,
        _messages: { fileType: 'Solo se permiten archivos PDF, Word, JPG o PNG.', fileSize: 'El archivo no puede superar los 10 MB.' } },
      'linkedin':          { url: true,
        _messages: { url: 'Introduce una URL válida, como https://linkedin.com/in/tu-perfil.' } },
      'referencias':       {},
      'consentimiento':    { required: true,
        _messages: { required: 'Debes aceptar la política de privacidad para continuar.' } },
      'newsletter':        {},
    },
  };

  // ──────────────────────────────────────────────
  // 3. UTILIDADES
  // ──────────────────────────────────────────────

  /**
   * Encuentra la configuración de validación para un campo dado.
   */
  function getFieldRules(field) {
    var form = field.form;
    if (!form) return null;

    // Encontrar el selector de formulario que coincide
    var formId = form.getAttribute('id');
    var formAction = form.getAttribute('action');

    var formConfig = null;
    if (formId && FORMS_CONFIG['#' + formId]) {
      formConfig = FORMS_CONFIG['#' + formId];
    } else if (formAction && FORMS_CONFIG['form[action="' + formAction + '"]']) {
      formConfig = FORMS_CONFIG['form[action="' + formAction + '"]'];
    }

    if (!formConfig) return null;

    var fieldName = field.getAttribute('name');
    return formConfig[fieldName] || null;
  }

  /**
   * SVG de icono de advertencia (triángulo con exclamación).
   */
  var WARNING_ICON_SVG = '<svg class="h-4 w-4 flex-shrink-0 mt-0.5 text-red-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';

  /**
   * SVG de icono de éxito (check dentro de un círculo verde).
   */
  var SUCCESS_ICON_SVG = '<svg class="h-4 w-4 flex-shrink-0 mt-0.5 text-green-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>';

  /**
   * Crea o recupera el contenedor de feedback (error / éxito) para un campo.
   * Ahora es un div con icono + texto para mostrar errores o confirmaciones visuales.
   */
  function getErrorContainer(field) {
    var id = field.getAttribute('id') || field.getAttribute('name');
    var errorId = id + '-error';
    var container = document.getElementById(errorId);
    if (!container) {
      container = document.createElement('div');
      container.id = errorId;
      container.className = 'mt-2 items-start gap-2 rounded-md border-l-4 border-transparent bg-transparent px-3 py-2 text-sm hidden';
      // role="alert" se asigna dinámicamente al mostrar el error (showFieldError)
      container.innerHTML = WARNING_ICON_SVG + '<span class="flex-1"></span>';
      field.parentNode.appendChild(container);
    }
    return container;
  }

  /**
   * Muestra el estado de error visual en un campo.
   * Borde rojo en el campo + mensaje con fondo, icono y barra lateral.
   */
  function showFieldError(field, message) {
    // 1. Campo: añadir borde rojo, quitar colores normales
    field.classList.add('border-red-400', 'focus:ring-red-400', 'focus:border-red-400');
    field.classList.remove('border-gray-300', 'hover:border-gray-400', 'focus:ring-brand-500', 'focus:border-brand-500');
    // Quitar borde verde si lo tuviera (estado éxito previo)
    field.classList.remove('border-green-400', 'focus:ring-green-400', 'focus:border-green-400');

    // 2. Feedback: mostrar el mensaje con estilo de error
    var container = getErrorContainer(field);
    container.className = 'mt-2 flex items-start gap-2 rounded-md border-l-4 border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 animate-fade-in';
    container.setAttribute('role', 'alert');
    container.innerHTML = WARNING_ICON_SVG + '<span class="flex-1">' + escapeHtml(message) + '</span>';

    // 3. ARIA: vincular el campo con su mensaje de error y marcarlo como inválido
    field.setAttribute('aria-invalid', 'true');
    // Preservar cualquier aria-describedby existente (hints) y añadir el contenedor de error
    var existingDesc = field.getAttribute('aria-describedby');
    var descIds = existingDesc ? existingDesc.split(/\s+/) : [];
    if (descIds.indexOf(container.id) === -1) {
      descIds.push(container.id);
    }
    field.setAttribute('aria-describedby', descIds.join(' '));
  }

  /**
   * Muestra el estado de éxito visual en un campo (campo válido y "tocado").
   * Borde verde sutil + check.
   */
  function showFieldSuccess(field) {
    // 1. Campo: borde verde, quitar colores neutros y rojos
    field.classList.add('border-green-400', 'focus:ring-green-400', 'focus:border-green-400');
    field.classList.remove('border-gray-300', 'hover:border-gray-400', 'border-red-400', 'focus:ring-red-400', 'focus:border-red-400');
    field.classList.remove('focus:ring-brand-500', 'focus:border-brand-500');

    // 2. ARIA: limpiar estado de error; el campo ya es válido
    field.removeAttribute('aria-invalid');
    // El contenedor ahora muestra éxito (role="status") pero sigue siendo
    // información complementaria → se mantiene en aria-describedby

    // 3. Feedback: mostrar check verde
    var container = getErrorContainer(field);
    container.className = 'mt-2 flex items-start gap-2 rounded-md border-l-4 border-green-400 bg-green-50 px-3 py-2 text-sm text-green-700 animate-fade-in';
    container.setAttribute('role', 'status');
    container.innerHTML = SUCCESS_ICON_SVG + '<span class="flex-1"></span>';
  }

  /**
   * Limpia TODO el estado visual (error y éxito) de un campo.
   */
  function clearFieldError(field) {
    field.classList.remove(
      'border-red-400', 'focus:ring-red-400', 'focus:border-red-400',
      'border-green-400', 'focus:ring-green-400', 'focus:border-green-400'
    );
    field.classList.add('border-gray-300', 'hover:border-gray-400', 'focus:ring-brand-500', 'focus:border-brand-500');

    // ARIA: limpiar estado de error
    field.removeAttribute('aria-invalid');
    // Eliminar solo la referencia al contenedor de error, preservando hints existentes
    var container = getErrorContainer(field);
    var currentDesc = field.getAttribute('aria-describedby') || '';
    var descIds = currentDesc.split(/\s+/).filter(function (id) {
      return id !== container.id && id !== '';
    });
    if (descIds.length > 0) {
      field.setAttribute('aria-describedby', descIds.join(' '));
    } else {
      field.removeAttribute('aria-describedby');
    }

    container.className = 'mt-2 items-start gap-2 rounded-md border-l-4 border-transparent bg-transparent px-3 py-2 text-sm hidden';
    container.removeAttribute('role');
    container.innerHTML = WARNING_ICON_SVG + '<span class="flex-1"></span>';
  }

  /**
   * Escapa HTML para evitar inyección en los mensajes de error.
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Valida un campo individual contra sus reglas configuradas.
   * Retorna el primer mensaje de error, o null si pasa todas las reglas.
   * Los mensajes se resuelven con esta prioridad:
   *   1. _messages[ruleName] del FORMS_CONFIG (mensaje personalizado por campo)
   *   2. rule.message (mensaje por defecto de la regla)
   */
  function validateField(field) {
    var rulesConfig = getFieldRules(field);
    if (!rulesConfig) return null; // campo sin reglas → siempre válido

    // Extraer mensajes personalizados si existen (clave _messages)
    var customMessages = rulesConfig._messages || {};

    // Recorrer cada regla configurada para este campo (excluyendo _messages)
    var ruleNames = Object.keys(rulesConfig);
    for (var i = 0; i < ruleNames.length; i++) {
      var ruleName = ruleNames[i];
      if (ruleName === '_messages') continue; // saltar metadatos

      var ruleParam = rulesConfig[ruleName];
      var rule = RULES[ruleName];

      if (!rule) continue; // regla desconocida, saltar

      var isValid = rule.validate(field, ruleParam);
      if (!isValid) {
        // Resolver mensaje: prioridad 1 = personalizado, prioridad 2 = regla por defecto
        var message;
        if (customMessages.hasOwnProperty(ruleName)) {
          message = customMessages[ruleName];
        } else {
          message = typeof rule.message === 'function'
            ? rule.message(field, ruleParam)
            : rule.message;
        }
        return message;
      }
    }

    return null;
  }

  /**
   * Actualiza el estado visual de un campo basado en la validación.
   * - Si hay error: muestra mensaje de error con estilo rojo.
   * - Si no hay error Y el campo está "tocado": muestra indicador de éxito verde.
   * - Si no hay error pero no está "tocado": estado neutro (sin feedback).
   */
  function updateFieldState(field) {
    var error = validateField(field);
    if (error) {
      showFieldError(field, error);
      return false;
    } else if (touchedFields.has(field)) {
      showFieldSuccess(field);
      return true;
    } else {
      clearFieldError(field);
      return true;
    }
  }

  // ──────────────────────────────────────────────
  // 4. MANEJO DE ERRORES EN CHECKBOX GROUP
  // ──────────────────────────────────────────────

  /**
   * Para checkboxes obligatorios dentro de un fieldset, muestra el error
   * a nivel de fieldset.
   */
  function validateRequiredCheckbox(checkbox) {
    var form = checkbox.form;
    if (!form) return true;

    // Buscar todos los checkboxes con el mismo nombre dentro del mismo form
    var name = checkbox.getAttribute('name');
    var checkboxes = form.querySelectorAll('input[type="checkbox"][name="' + name + '"]');

    if (checkboxes.length > 1) {
      // Grupo de checkboxes: al menos uno debe estar marcado
      var anyChecked = Array.from(checkboxes).some(function (cb) { return cb.checked; });
      checkboxes.forEach(function (cb) {
        if (anyChecked) {
          cb.classList.remove('border-red-400');
        } else {
          cb.classList.add('border-red-400');
        }
      });
      return anyChecked;
    }

    return checkbox.checked;
  }

  // ──────────────────────────────────────────────
  // 5. VALIDACIÓN DE FORMULARIO COMPLETO
  // ──────────────────────────────────────────────

  // ──────────────────────────────────────────────
  // 5. VALIDACIÓN DE FORMULARIO COMPLETO
  // ──────────────────────────────────────────────

  /**
   * Crea o recupera el contenedor de error general del formulario (banner superior).
   */
  function getFormErrorSummary(form) {
    var formId = form.getAttribute('id');
    var formAction = form.getAttribute('action');
    var summaryId = formId ? formId + '-errors' : (formAction ? 'fe-' + formAction.replace(/[^a-zA-Z0-9]/g, '-') + '-errors' : 'form-errors');
    var summary = document.getElementById(summaryId);
    if (!summary) {
      summary = document.createElement('div');
      summary.id = summaryId;
      summary.className = 'mx-auto hidden';
      summary.setAttribute('role', 'alert');
      summary.setAttribute('tabindex', '-1');
      // Insertar al inicio del formulario, como primer hijo
      form.insertBefore(summary, form.firstElementChild);
    }
    return summary;
  }

  /**
   * Valida todos los campos de un formulario que tengan reglas definidas.
   * Marca TODOS los campos como "tocados" para que muestren error o éxito.
   * Muestra un banner resumen con el número de errores.
   * Desplaza la vista al primer error.
   * Retorna true si todos pasan, false en caso contrario.
   */
  function validateForm(form) {
    // Encontrar el formConfig para este formulario
    var formId = form.getAttribute('id');
    var formAction = form.getAttribute('action');
    var formConfig = null;
    if (formId && FORMS_CONFIG['#' + formId]) {
      formConfig = FORMS_CONFIG['#' + formId];
    } else if (formAction && FORMS_CONFIG['form[action="' + formAction + '"]']) {
      formConfig = FORMS_CONFIG['form[action="' + formAction + '"]'];
    }
    if (!formConfig) return true;

    // 1. Marcar TODOS los campos como "tocados" antes de validar,
    //    para que los campos válidos también muestren el check verde.
    var allFieldNames = Object.keys(formConfig);
    for (var f = 0; f < allFieldNames.length; f++) {
      var anyField = form.querySelector('[name="' + allFieldNames[f] + '"]');
      if (anyField) touchedFields.add(anyField);
    }

    // 2. Validar cada campo
    var fieldNames = Object.keys(formConfig);
    var allValid = true;
    var firstErrorField = null;
    var errorCount = 0;

    for (var i = 0; i < fieldNames.length; i++) {
      var name = fieldNames[i];
      if (name === '_messages') continue;
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) continue;

      var valid = updateFieldState(field);
      if (!valid) {
        allValid = false;
        errorCount++;
        if (!firstErrorField) firstErrorField = field;
      }
    }

    // 3. Mostrar / ocultar banner resumen de errores
    var summary = getFormErrorSummary(form);
    if (!allValid) {
      var msg = errorCount === 1
        ? 'Hay 1 error que debes corregir antes de enviar.'
        : 'Hay ' + errorCount + ' errores que debes corregir antes de enviar.';
      summary.className = 'mx-auto mb-6 flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800 animate-fade-in';
      summary.innerHTML = WARNING_ICON_SVG
        + '<div class="flex-1">'
        + '<p class="font-semibold">No se puede enviar el formulario</p>'
        + '<p class="mt-1">' + escapeHtml(msg) + '</p>'
        + '</div>'
        + '<button type="button" class="flex-shrink-0 rounded-md p-1 text-red-700 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400" onclick="this.parentElement.classList.add(\'hidden\')" aria-label="Cerrar">'
        + '<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>'
        + '</button>';
      summary.classList.remove('hidden');
    } else {
      summary.className = 'mx-auto hidden';
    }

    // 4. Hacer scroll y foco al primer error
    if (firstErrorField) {
      // Esperar a que el DOM se actualice con los errores antes de hacer scroll
      setTimeout(function () {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus({ preventScroll: true });
      }, 50);
    }

    return allValid;
  }

  // ──────────────────────────────────────────────
  // 6. EVENTOS: BLUR (validación al perder el foco)
  // ──────────────────────────────────────────────

  function onFieldBlur(e) {
    var field = e.target;
    // Solo procesar campos que tengan reglas definidas
    var rulesConfig = getFieldRules(field);
    if (rulesConfig && Object.keys(rulesConfig).length > 0) {
      // Marcar como "tocado" para activar validación en tiempo real
      touchedFields.add(field);
      updateFieldState(field);
    }
  }

  // ──────────────────────────────────────────────
  // 6b. EVENTO: INPUT (validación en tiempo real)
  // ──────────────────────────────────────────────

  /**
   * Mapa para almacenar los timeouts de debounce por campo.
   */
  var debounceTimers = new WeakMap();

  /**
   * Valida en tiempo real mientras el usuario escribe,
   * pero SOLO si el campo ya ha sido "tocado" (ha perdido el foco al menos una vez).
   * Usa debounce para no validar en cada pulsación.
   */
  function onFieldInput(e) {
    var field = e.target;

    // Ignorar si el campo nunca ha perdido el foco (aún no "tocado")
    if (!touchedFields.has(field)) return;

    // Solo campos con reglas definidas
    var rulesConfig = getFieldRules(field);
    if (!rulesConfig || Object.keys(rulesConfig).length === 0) return;

    // Cancelar el debounce anterior
    var existing = debounceTimers.get(field);
    if (existing) {
      clearTimeout(existing);
    }

    // Establecer un nuevo debounce de 300ms para no saturar
    var timer = setTimeout(function () {
      updateFieldState(field);
      debounceTimers.delete(field);
    }, 300);

    debounceTimers.set(field, timer);
  }

  // ──────────────────────────────────────────────
  // 7. EVENTOS: SUBMIT (validación completa)
  // ──────────────────────────────────────────────

  function onSubmitForm(e) {
    var form = e.target;
    var submitBtn = form.querySelector('button[type="submit"]');

    // Deshabilitar botón de envío para evitar doble clic
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
      // Guardar texto original si no se ha guardado ya
      if (!submitBtn.getAttribute('data-original-text')) {
        submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
      }
      submitBtn.innerHTML = 'Enviando...';
    }

    var valid = validateForm(form);

    if (!valid) {
      e.preventDefault();
      // Re-habilitar botón si hay errores
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text');
      }
      return;
    }

    // ✅ SI ES VÁLIDO: simular envío y mostrar mensaje de éxito
    e.preventDefault();

    // Restaurar botón (ya no está "enviando")
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Enviar';
    }

    // Mostrar mensaje de éxito animado
    showSuccessMessage(form);
  }

  // ──────────────────────────────────────────────
  // 8. EVENTO: RESET (limpiar errores visuales y estado)
  // ──────────────────────────────────────────────

  function onResetForm(e) {
    var form = e.target;
    var fields = form.querySelectorAll('input, select, textarea');
    Array.from(fields).forEach(function (field) {
      clearFieldError(field);
      // Eliminar del conjunto de "tocados" para que vuelva a empezar
      touchedFields.delete(field);
      // Cancelar cualquier debounce pendiente
      var existing = debounceTimers.get(field);
      if (existing) {
        clearTimeout(existing);
        debounceTimers.delete(field);
      }
    });

    // Ocultar banner resumen de errores si existe
    var formId = form.getAttribute('id');
    var formAction = form.getAttribute('action');
    var summaryId = formId ? formId + '-errors' : (formAction ? 'fe-' + formAction.replace(/[^a-zA-Z0-9]/g, '-') + '-errors' : 'form-errors');
    var summary = document.getElementById(summaryId);
    if (summary) {
      summary.className = 'mx-auto hidden';
    }

    // Restaurar contenido original si se mostró mensaje de éxito
    restoreFormContent(form);

    // Restaurar botón de envío
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
      if (submitBtn.getAttribute('data-original-text')) {
        submitBtn.innerHTML = submitBtn.getAttribute('data-original-text');
      }
    }
  }

  // ──────────────────────────────────────────────
  // 9. FILE INPUT: VALIDACIÓN ADICIONAL EN CHANGE
  // ──────────────────────────────────────────────

  function onFileChange(e) {
    var field = e.target;
    if (field.type === 'file') {
      updateFieldState(field);
    }
  }

  // ──────────────────────────────────────────────
  // 9b. MOSTRAR MENSAJE DE ÉXITO (simular envío)
  // ──────────────────────────────────────────────

  /**
   * Muestra un mensaje de éxito simulando el envío del formulario.
   * Reemplaza el contenido del formulario con una pantalla de confirmación.
   */
  function showSuccessMessage(form) {
    var formAction = form.getAttribute('action');
    var successId = formAction ? 'success-' + formAction.replace(/[^a-zA-Z0-9]/g, '-') : 'success-form';

    // Si ya existe, no duplicar
    var existing = document.getElementById(successId);
    if (existing) return;

    // Ocultar resumen de errores si existe
    var formId = form.getAttribute('id');
    var summaryId = formId ? formId + '-errors' : (formAction ? 'fe-' + formAction.replace(/[^a-zA-Z0-9]/g, '-') + '-errors' : 'form-errors');
    var summary = document.getElementById(summaryId);
    if (summary) {
      summary.className = 'mx-auto hidden';
    }

    // Crear el contenedor del mensaje de éxito
    var successDiv = document.createElement('div');
    successDiv.id = successId;
    successDiv.setAttribute('role', 'status');
    successDiv.setAttribute('tabindex', '-1');
    successDiv.className = 'animate-fade-in mx-auto my-6 rounded-xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-8 text-center shadow-lg outline-none';

    successDiv.innerHTML = [
      '<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">',
      '  <svg class="h-8 w-8 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
      '    <polyline points="20 6 9 17 4 12"/>',
      '  </svg>',
      '</div>',
      '<h3 class="text-xl font-bold text-green-800">¡Solicitud recibida en Nexova Solutions!</h3>',
      '<p class="mt-2 text-green-700">Hemos recibido tu información correctamente.</p>',
      '<p class="mt-1 text-sm text-green-700">Nuestro equipo de talento revisará tu solicitud y te contactaremos en los próximos días.</p>',
      '<hr class="mx-auto my-4 max-w-xs border-green-200">',
      '<button type="button" class="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2" data-reset-form>',
      '  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">',
      '    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>',
      '  </svg>',
      '  Nueva solicitud',
      '</button>',
    ].join('\n');

    // Ocultar todos los hijos del formulario excepto el mensaje de éxito
    Array.from(form.children).forEach(function (child) {
      if (child.id !== successId && child.tagName !== 'SCRIPT') {
        child.classList.add('hidden');
      }
    });

    form.insertBefore(successDiv, form.firstChild);

    // Mover el foco al mensaje de éxito para que los lectores de pantalla lo anuncien
    successDiv.focus({ preventScroll: true });

    // Evento para el botón "Nueva solicitud"
    var resetBtn = successDiv.querySelector('[data-reset-form]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        // Disparar reset nativo del formulario
        var resetEvent = new Event('reset', { bubbles: true, cancelable: true });
        form.dispatchEvent(resetEvent);
        form.reset();
      });
    }
  }

  /**
   * Restaura el contenido original del formulario después de un éxito.
   */
  function restoreFormContent(form) {
    var formAction = form.getAttribute('action');
    var successId = formAction ? 'success-' + formAction.replace(/[^a-zA-Z0-9]/g, '-') : 'success-form';
    var successDiv = document.getElementById(successId);

    if (successDiv) {
      successDiv.remove();
    }

    // Restaurar visibilidad de los hijos originales
    Array.from(form.children).forEach(function (child) {
      if (child.tagName !== 'SCRIPT') {
        child.classList.remove('hidden');
      }
    });
  }

  // ──────────────────────────────────────────────
  // 11. INICIALIZACIÓN
  // ──────────────────────────────────────────────

  function init() {
    // Las animaciones se definen en tailwind.config (animate-fade-in)

    // Recorrer todos los formularios definidos en la configuración
    var formSelectors = Object.keys(FORMS_CONFIG);

    formSelectors.forEach(function (selector) {
      var form = document.querySelector(selector);
      if (!form) return;

      // Establecer novalidate para que nuestro JS tome el control
      form.setAttribute('novalidate', '');

      // Asignar eventos
      form.addEventListener('submit', onSubmitForm);
      form.addEventListener('reset', onResetForm);

      // Validación al perder el foco (event delegation)
      form.addEventListener('blur', onFieldBlur, true);

      // Validación en tiempo real mientras escribe (event delegation)
      // Usamos 'input' para text, email, tel, textarea
      // y 'change' para select/checkbox/file (cambios discretos)
      form.addEventListener('input', onFieldInput, true);

      // Para selects y checkboxes, el 'change' también activa validación
      // ya que 'input' no siempre se dispara en estos elementos
      form.addEventListener('change', function (e) {
        var field = e.target;
        if (field.type === 'file') {
          onFileChange(e);
          return;
        }
        // Para selects y checkboxes ya tocados, validar sin debounce
        if ((field.tagName === 'SELECT' || field.type === 'checkbox') && touchedFields.has(field)) {
          updateFieldState(field);
        }
      });
    });
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
