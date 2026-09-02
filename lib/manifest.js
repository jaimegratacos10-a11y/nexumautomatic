(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Nexumautomatic",
    legalName: "Nexumautomatic",
    tagline: "Automatización con IA para negocios que no quieren perder el tiempo",
    year: "2026",

    contact: {
      email: "nexumautomatic@gmail.com",
    },

    nav: [
      { label: "Servicios", href: "#servicios" },
      { label: "Cómo funciona", href: "#proceso" },
      { label: "Casos de uso", href: "#casos" },
      { label: "Planes", href: "#planes" },
      { label: "FAQ", href: "#faq" },
    ],

    services: [
      {
        id: "gmail",
        num: "01",
        name: "Automatización de Gmail",
        short: "Tu bandeja de entrada, resuelta sola.",
        description:
          "Conectamos IA a tu correo para leer, clasificar y responder los mensajes repetitivos al instante: consultas de precio, disponibilidad, dudas frecuentes o seguimiento de leads. Tú solo entras cuando de verdad hace falta.",
        bullets: [
          "Respuestas automáticas con el tono de tu marca",
          "Clasificación y etiquetado inteligente de correo entrante",
          "Detección y aviso de leads calientes en tiempo real",
          "Redacción de borradores para que solo revises y envíes",
        ],
      },
      {
        id: "whatsapp",
        num: "02",
        name: "Automatización de WhatsApp",
        short: "Un asistente que no cierra nunca.",
        description:
          "Tu WhatsApp Business atendido por IA 24/7: responde preguntas, envía catálogos, gestiona pedidos y deriva a una persona solo cuando el caso lo requiere. Sin bots que suenan a bot.",
        bullets: [
          "Respuestas automáticas naturales, en tu idioma y tono",
          "Gestión de pedidos, catálogo y estados de envío",
          "Derivación a un humano en un clic cuando es necesario",
          "Funciona con WhatsApp Business API",
        ],
      },
      {
        id: "reservas",
        num: "03",
        name: "Automatización de reservas y citas",
        short: "La agenda se organiza sola.",
        description:
          "Tus clientes reservan, cambian o cancelan citas hablando por WhatsApp, web o teléfono, y la IA sincroniza todo con tu calendario en tiempo real. Recordatorios automáticos incluidos, para que no falte nadie.",
        bullets: [
          "Reserva conversacional por WhatsApp o formulario web",
          "Sincronización con Google Calendar / Calendly y similares",
          "Recordatorios y confirmaciones automáticas",
          "Reprogramaciones y cancelaciones sin intervención manual",
        ],
      },
      {
        id: "medida",
        num: "04",
        name: "Automatizaciones a medida",
        short: "Si es repetitivo, se puede automatizar.",
        description:
          "Cada negocio tiene sus propios cuellos de botella. Diseñamos flujos con IA para lo que no encaja en un producto estándar: CRM, facturación, atención en varios canales, informes automáticos, integraciones entre herramientas.",
        bullets: [
          "Diagnóstico de procesos y detección de tareas automatizables",
          "Integración entre tus herramientas actuales (CRM, hojas de cálculo, ERP)",
          "Flujos de trabajo con IA generativa donde aporta valor real",
          "Mantenimiento y ajuste continuo tras la puesta en marcha",
        ],
      },
    ],

    process: [
      {
        num: "01",
        title: "Diagnóstico",
        text: "Analizamos tus procesos actuales y detectamos qué tareas repetitivas te están robando horas cada semana.",
      },
      {
        num: "02",
        title: "Automatización",
        text: "Diseñamos e implementamos los flujos con IA a medida de tu negocio, conectados a las herramientas que ya usas.",
      },
      {
        num: "03",
        title: "Acompañamiento",
        text: "Medimos resultados, ajustamos el sistema y seguimos disponibles para lo que necesites después del lanzamiento.",
      },
    ],

    benefits: [
      {
        title: "Menos bandeja de entrada",
        text: "Los correos y mensajes repetitivos dejan de depender de que alguien esté delante de la pantalla.",
      },
      {
        title: "Respuesta inmediata",
        text: "Tus clientes reciben contestación al momento, a cualquier hora, sin esperar al horario de oficina.",
      },
      {
        title: "Tiempo para lo importante",
        text: "El equipo deja de repetir lo mismo cien veces y se dedica a lo que realmente mueve el negocio.",
      },
    ],

    useCases: [
      {
        tag: "Ejemplo · Clínica dental",
        title: "Confirmación de citas por WhatsApp",
        text: "Un consultorio automatiza el recordatorio y la confirmación de citas: los pacientes responden por WhatsApp y la agenda se actualiza sola, sin llamadas de por medio.",
      },
      {
        tag: "Ejemplo · Tienda online",
        title: "Atención de pedidos fuera de horario",
        text: "Una tienda deja que la IA responda dudas sobre pedidos y envíos a cualquier hora, y solo escala a una persona cuando el cliente lo pide explícitamente.",
      },
      {
        tag: "Ejemplo · Estudio de servicios",
        title: "Bandeja de entrada bajo control",
        text: "Un estudio recibe decenas de correos con la misma pregunta cada semana; ahora la IA redacta la respuesta y solo confirma quien la envía.",
      },
    ],

    plans: [
      {
        name: "Starter",
        tagline: "Un canal, resuelto.",
        features: [
          "Automatización de un canal (Gmail o WhatsApp)",
          "Configuración inicial y pruebas incluidas",
          "Ajustes durante el primer mes",
        ],
        cta: "Pedir presupuesto",
        featured: false,
      },
      {
        name: "Pro",
        tagline: "Gmail, WhatsApp y reservas conectados.",
        features: [
          "Automatización de Gmail y WhatsApp",
          "Gestión de reservas y citas incluida",
          "Integración con tu calendario y CRM",
          "Soporte prioritario",
        ],
        cta: "Pedir presupuesto",
        featured: true,
      },
      {
        name: "Business",
        tagline: "Automatización a medida, sin límites.",
        features: [
          "Todo lo de Pro",
          "Automatizaciones a medida para tus procesos internos",
          "Integraciones múltiples entre herramientas",
          "Acompañamiento continuo y prioridad de soporte",
        ],
        cta: "Hablar con nosotros",
        featured: false,
      },
    ],

    faqs: [
      {
        q: "¿Necesito saber de tecnología para automatizar mi negocio?",
        a: "No. Nos encargamos de todo el proceso técnico: tú solo nos cuentas cómo funciona tu negocio hoy y qué te gustaría dejar de hacer a mano.",
      },
      {
        q: "¿Cuánto se tarda en tener la automatización funcionando?",
        a: "Depende del alcance, pero la mayoría de automatizaciones de un solo canal (Gmail o WhatsApp) están listas en cuestión de días tras el diagnóstico inicial.",
      },
      {
        q: "¿Qué pasa con mis datos y los de mis clientes?",
        a: "Los flujos se configuran para trabajar únicamente con la información necesaria para cada tarea, y puedes pedir en cualquier momento un informe de qué datos se procesan y cómo.",
      },
      {
        q: "¿Puedo seguir interviniendo cuando quiera?",
        a: "Sí. Cada automatización incluye un punto claro de derivación a una persona: la IA resuelve lo repetitivo, tú decides cuándo entrar en lo demás.",
      },
      {
        q: "¿Solo trabajáis con Gmail y WhatsApp?",
        a: "Son los dos canales más habituales, pero también automatizamos reservas, CRMs, hojas de cálculo y prácticamente cualquier proceso repetitivo que pueda describirse como una serie de pasos.",
      },
    ],

    footerLinks: [
      { label: "Servicios", href: "#servicios" },
      { label: "Cómo funciona", href: "#proceso" },
      { label: "Planes", href: "#planes" },
      { label: "FAQ", href: "#faq" },
      { label: "Contacto", href: "#contacto" },
    ],
  };
})();
