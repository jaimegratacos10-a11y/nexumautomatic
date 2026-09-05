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

/* ---------------------------------------------------------
   Premium pass requested for Nexum Automatic
--------------------------------------------------------- */
(function () {
  "use strict";

  function make(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function enhance() {
    const heroTitle = document.querySelector(".hero-title");
    const heroSub = document.querySelector(".hero-sub");
    const heroActions = document.querySelector(".hero-actions");
    const hero = document.querySelector(".hero");

    if (heroTitle) heroTitle.innerHTML = 'Tu WhatsApp, email y reservas <span class="text-grad">trabajando aunque tú no estés.</span>';
    if (heroSub) heroSub.textContent = "Diseñamos sistemas de IA conectados a las herramientas que ya usas para responder clientes, gestionar citas, actualizar datos y ejecutar tareas sin depender de trabajo manual.";
    if (heroActions) {
      const links = heroActions.querySelectorAll("a");
      if (links[0]) {
        links[0].textContent = "Analiza gratis 1 proceso";
        links[0].setAttribute("href", "#contacto");
      }
      if (links[1]) {
        links[1].textContent = "Ver cómo funciona";
        links[1].setAttribute("href", "#como-funciona");
      }
    }

    if (hero && !document.querySelector(".nx-architecture")) {
      const block = make("section", "nx-architecture", `
        <div class="nx-architecture-inner">
          <p class="nx-architecture-kicker">Un sistema conectado, no otro chatbot aislado</p>
          <div class="nx-architecture-flow" aria-label="Arquitectura de automatización Nexum">
            <div class="nx-stack"><span>WhatsApp</span><span>Email</span><span>Web</span></div>
            <div class="nx-flow-arrow" aria-hidden="true">→</div>
            <div class="nx-core"><small>NEXUM</small><strong>IA</strong><em>entiende · decide · ejecuta</em></div>
            <div class="nx-flow-arrow" aria-hidden="true">→</div>
            <div class="nx-stack"><span>CRM</span><span>Calendar</span><span>Sheets / ERP</span></div>
          </div>
        </div>`);
      hero.insertAdjacentElement("afterend", block);
    }

    const hwKicker = document.querySelector("#como-funciona .kicker");
    const hwTitle = document.querySelector(".howworks-title");
    const hwSub = document.querySelector(".howworks-sub");
    if (hwKicker) hwKicker.textContent = "Un proceso simple, resultados reales";
    if (hwTitle) hwTitle.textContent = "Así funciona";
    if (hwSub) hwSub.textContent = "De un simple mensaje a una acción ejecutada: la IA entiende la solicitud, conecta con tus herramientas y responde sin romper el flujo de tu negocio.";

    const steps = document.querySelectorAll("[data-hw-step]");
    if (steps[0]) steps[0].querySelector("p").textContent = "Recibe consultas por email, WhatsApp o desde tu web.";
    if (steps[1]) steps[1].querySelector("p").textContent = "Analiza, responde, consulta tu agenda o CRM y ejecuta las acciones necesarias.";
    if (steps[2]) steps[2].querySelector("p").textContent = "Una contestación rápida, personalizada y profesional.";

    const emailIn = document.querySelector("[data-hw-email-in]");
    if (emailIn && !emailIn.querySelector(".nx-channel-tabs")) {
      const tabs = make("div", "nx-channel-tabs", '<span class="is-active">Email</span><span>WhatsApp</span><span>Web</span>');
      emailIn.insertBefore(tabs, emailIn.firstChild);
      const live = make("div", "nx-floating nx-floating-live", '<b>▮▮▮</b><span>Nuevas consultas cada día</span>');
      emailIn.appendChild(live);
    }

    const scene = document.querySelector("[data-hw-scene]");
    if (scene && !scene.querySelector(".nx-scene-caption")) {
      scene.appendChild(make("div", "nx-scene-caption nx-caption-1", "MÁS CONVERSACIONES<br>MÁS NEGOCIO"));
      scene.appendChild(make("div", "nx-scene-caption nx-caption-2", "TU NEGOCIO<br>EN MODO AUTOMÁTICO"));
      scene.appendChild(make("div", "nx-scene-caption nx-caption-3", "MENOS TAREAS<br>MÁS CLIENTES"));
    }

    const emailOut = document.querySelector("[data-hw-email-out]");
    if (emailOut && !emailOut.querySelector(".nx-email-meta")) {
      emailOut.insertBefore(make("div", "nx-email-meta", '<span>Re: Consulta</span><span>hace 1 min</span>'), emailOut.firstChild);
      emailOut.appendChild(make("div", "nx-floating nx-floating-sent", '<b>✓</b><span><strong>Respuesta enviada</strong><small>Cliente atendido automáticamente</small></span>'));
    }

    const faq = document.querySelector("#faq");
    if (faq && !document.querySelector(".nx-trust")) {
      faq.insertAdjacentElement("beforebegin", make("section", "section nx-trust", `
        <div class="section-inner">
          <div class="section-head is-centered">
            <p class="kicker">Control y confianza</p>
            <h2>Automatizar no significa perder el control.</h2>
            <p>Definimos qué puede hacer la IA sola, cuándo debe pedir confirmación y cuándo tiene que derivar el caso a una persona.</p>
          </div>
          <div class="nx-trust-grid">
            <article class="nx-trust-card"><span>01</span><h3>Permisos mínimos</h3><p>Solo se conectan los datos y herramientas necesarios para ejecutar cada tarea.</p></article>
            <article class="nx-trust-card"><span>02</span><h3>Control humano</h3><p>Los casos sensibles o ambiguos se derivan a tu equipo en lugar de improvisar.</p></article>
            <article class="nx-trust-card"><span>03</span><h3>Trazabilidad</h3><p>Los flujos se diseñan para que puedas entender qué acción se ejecutó y cuándo.</p></article>
            <article class="nx-trust-card"><span>04</span><h3>Privacidad</h3><p>Reducimos la información tratada al mínimo necesario para cada automatización.</p></article>
          </div>
        </div>`));
    }

    const contactHeading = document.querySelector("#contacto h2");
    const contactIntro = document.querySelector("#contacto .section-head.p");
    const contactSubmit = document.querySelector("#contacto .btn-label");
    if (contactHeading) contactHeading.textContent = "Cuéntanos una tarea. Te diremos si merece la pena automatizarla.";
    if (contactIntro) contactIntro.textContent = "No necesitas tener un proyecto definido. Describe un proceso repetitivo y analizaremos qué se puede automatizar, con qué herramientas y dónde no tendría sentido hacerlo.";
    if (contactSubmit) contactSubmit.textContent = "Analizar gratis mi proceso";

    if (!document.getElementById("nx-premium-style")) {
      const style = make("style");
      style.id = "nx-premium-style";
      style.textContent = `
        .hero-title{max-width:16ch;letter-spacing:-.045em}.hero-sub{max-width:43rem}
        .brand-mark{display:none!important}.brand{gap:.2rem}.brand-line1{font-size:1.14rem;letter-spacing:.08em}.brand-line2{font-size:.52rem;letter-spacing:.32em;margin-top:.08rem}
        .nx-architecture{padding:0 var(--gutter) 4.75rem;background:var(--bg);position:relative;z-index:2}.nx-architecture-inner{max-width:1200px;margin:0 auto;border:1px solid var(--line);border-radius:28px;padding:clamp(1.4rem,3vw,2.3rem);background:linear-gradient(180deg,#fff,#fafafa);box-shadow:0 30px 70px -55px rgba(0,0,0,.4)}
        .nx-architecture-kicker{font-family:var(--mono);font-size:.7rem;letter-spacing:.11em;text-transform:uppercase;color:var(--mute);text-align:center;margin-bottom:1.3rem}.nx-architecture-flow{display:grid;grid-template-columns:1fr auto minmax(190px,.8fr) auto 1fr;gap:clamp(.7rem,2vw,1.5rem);align-items:center}.nx-stack{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center}.nx-stack span{padding:.65rem .9rem;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:.78rem;font-weight:600;color:var(--ink-soft);box-shadow:0 8px 18px -16px rgba(0,0,0,.3)}.nx-flow-arrow{font-size:1.5rem;color:var(--mute-2)}
        .nx-core{min-height:120px;border-radius:24px;background:#090909;color:#fff;display:grid;place-items:center;align-content:center;text-align:center;padding:1rem;box-shadow:0 24px 50px -24px rgba(0,0,0,.65);position:relative;overflow:hidden}.nx-core:before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 45%);animation:nxCorePulse 4.5s ease-in-out infinite}.nx-core small,.nx-core strong,.nx-core em{position:relative;z-index:1}.nx-core small{font-family:var(--mono);font-size:.6rem;letter-spacing:.18em;opacity:.7}.nx-core strong{font-family:var(--mono);font-size:1.7rem;line-height:1}.nx-core em{font-style:normal;font-size:.65rem;opacity:.65;margin-top:.45rem}@keyframes nxCorePulse{0%,100%{transform:scale(.8);opacity:.45}50%{transform:scale(1.2);opacity:1}}
        .howworks{background:linear-gradient(180deg,#f7f7f7,#fff 48%,#f7f7f7)!important}.howworks-scene{transform-style:preserve-3d}.hw-chip{isolation:isolate;overflow:visible;background:linear-gradient(145deg,#111,#020202)!important;border:1px solid rgba(255,255,255,.18)}.hw-chip:before{content:"";position:absolute;inset:-16px;border-radius:30px;border:1px solid rgba(0,0,0,.12);box-shadow:0 0 0 8px rgba(255,255,255,.58),0 28px 60px -35px rgba(0,0,0,.7);z-index:-1;animation:nxChipBreath 3.6s ease-in-out infinite}.hw-chip:after{content:"";position:absolute;inset:7px;border-radius:14px;background:linear-gradient(145deg,rgba(255,255,255,.18),transparent 45%);pointer-events:none}@keyframes nxChipBreath{0%,100%{transform:scale(.97);opacity:.5}50%{transform:scale(1.08);opacity:1}}
        .hw-proc{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,.94);border-color:rgba(0,0,0,.13);box-shadow:0 28px 58px -32px rgba(0,0,0,.44);transform-style:preserve-3d}.hw-proc-agenda{translate:0 -50% 30px}.hw-proc-responde{translate:-50% 0 42px}.hw-proc-crm{translate:0 -50% 50px}.hw-proc-automatiza{translate:-50% 0 22px}.hw-link{stroke:rgba(10,10,10,.3);stroke-width:.75}.hw-card{background:rgba(255,255,255,.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
        .nx-channel-tabs{display:flex;gap:.45rem;margin-bottom:1rem}.nx-channel-tabs span{font-size:.7rem;padding:.35rem .65rem;border:1px solid var(--line);border-radius:999px;color:var(--mute)}.nx-channel-tabs .is-active{background:var(--ink);color:#fff;border-color:var(--ink)}.nx-floating{position:absolute;background:rgba(255,255,255,.96);border:1px solid var(--line);border-radius:16px;box-shadow:0 20px 40px -26px rgba(0,0,0,.4);display:flex;align-items:center;gap:.7rem;z-index:6}.nx-floating-live{top:14%;right:-26%;padding:.75rem .9rem;font-size:.72rem;max-width:150px}.nx-floating-live b{font-family:var(--mono);letter-spacing:-.15em}.nx-floating-sent{right:-26%;bottom:8%;padding:.75rem 1rem;min-width:210px}.nx-floating-sent>b{width:30px;height:30px;border-radius:50%;background:#0a0a0a;color:#fff;display:grid;place-items:center}.nx-floating-sent span{display:grid}.nx-floating-sent strong{font-size:.76rem}.nx-floating-sent small{font-size:.65rem;color:var(--mute)}.nx-email-meta{display:flex;justify-content:space-between;gap:1rem;font-size:.72rem;font-weight:600;padding-bottom:.7rem;margin-bottom:.5rem;border-bottom:1px solid var(--line)}
        .nx-scene-caption{position:absolute;font-family:var(--mono);font-size:.62rem;letter-spacing:.18em;color:var(--mute-2);line-height:1.65;z-index:2}.nx-caption-1{right:-18%;top:18%}.nx-caption-2{right:-18%;top:52%}.nx-caption-3{right:-18%;bottom:6%}
        .nx-trust{background:#0a0a0a;color:#fff}.nx-trust .kicker{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.2);color:#fff}.nx-trust .kicker:before{background:#fff}.nx-trust .section-head p{color:rgba(255,255,255,.62)}.nx-trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.nx-trust-card{border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:1.5rem;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.025));min-height:220px}.nx-trust-card span{font-family:var(--mono);font-size:.72rem;letter-spacing:.12em;color:rgba(255,255,255,.45)}.nx-trust-card h3{font-size:1.08rem;margin-top:2.3rem}.nx-trust-card p{font-size:.88rem;line-height:1.6;color:rgba(255,255,255,.62);margin-top:.75rem}
        @media(min-width:900px){.howworks{height:420vh!important}.howworks-scene{min-height:680px!important}.hw-chip{width:96px!important;height:96px!important;margin:-48px 0 0 -48px!important}.hw-proc{width:164px!important}.hw-proc-agenda{left:1%!important}.hw-proc-crm{right:1%!important}.hw-proc-responde{top:2%!important}.hw-proc-automatiza{bottom:2%!important}}
        @media(max-width:1100px){.nx-scene-caption,.nx-floating-live,.nx-floating-sent{display:none!important}}
        @media(max-width:899px){.nx-architecture-flow{grid-template-columns:1fr}.nx-flow-arrow{transform:rotate(90deg);text-align:center}.nx-trust-grid{grid-template-columns:1fr 1fr}.nx-core{min-height:100px}.hw-chip:before{animation:none}.nx-channel-tabs{justify-content:center}}
        @media(max-width:599px){.nx-trust-grid{grid-template-columns:1fr}.nx-trust-card{min-height:0}.nx-architecture{padding-inline:1rem}.nx-architecture-inner{border-radius:22px}.hero-title{max-width:13ch}}
        @media(prefers-reduced-motion:reduce){.nx-core:before,.hw-chip:before{animation:none!important}}
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance);
  else enhance();
})();
