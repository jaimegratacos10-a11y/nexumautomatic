(function () {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------------------------------------------------------
     Nav
  --------------------------------------------------------- */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => {
      if (scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $("[data-nav-burger]");
    const mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      burger.addEventListener("click", () => {
        const open = mobile.getAttribute("data-open") === "true";
        mobile.setAttribute("data-open", open ? "false" : "true");
        nav.classList.toggle("is-open", !open);
        document.body.style.overflow = open ? "" : "hidden";
      });
      $$("a", mobile).forEach(a => a.addEventListener("click", () => {
        mobile.setAttribute("data-open", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      }));
    }
  }

  function initSmoothAnchors() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const navOffset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---------------------------------------------------------
     Reveals
  --------------------------------------------------------- */
  function initReveals() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(el => io.observe(el));

    setTimeout(() => {
      $$("[data-reveal]:not(.is-revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  function initFaqAccordion() {
    const items = $$("[data-faq-item]");
    items.forEach(item => {
      const toggle = item.querySelector("[data-faq-toggle]");
      if (!toggle) return;
      toggle.addEventListener("click", () => {
        const isOpen = item.getAttribute("data-open") === "true";
        item.setAttribute("data-open", isOpen ? "false" : "true");
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  /* ---------------------------------------------------------
     Contact form (simulated submit — no backend wired yet)
  --------------------------------------------------------- */
  function initContactForm() {
    const form = $("[data-contact-form]");
    const success = $("[data-contact-success]");
    if (!form || !success) return;
    const submitBtn = form.querySelector("[data-contact-submit]");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form.classList.contains("is-sending") || form.classList.contains("is-sent")) return;
      if (!form.reportValidity()) return;

      form.classList.add("is-sending");
      submitBtn?.classList.add("is-sending");

      let ok = false;
      try {
        const res = await fetch("lead.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origen: "contacto",
            nombre: form.elements.name?.value || "",
            empresa: form.elements.company?.value || "",
            email: form.elements.email?.value || "",
            telefono: form.elements.phone?.value || "",
            sector: form.elements.sector?.value || "",
            mensaje: form.elements.task?.value || "",
          }),
        });
        const data = await res.json();
        ok = !!data.ok;
      } catch (e) { ok = false; }

      const firstName = (form.elements.name?.value || "").trim().split(/\s+/)[0] || "Hola";
      success.textContent = ok
        ? `${firstName}, hemos recibido tu mensaje. Te escribimos en breve a tu correo.`
        : `${firstName}, no hemos podido enviarlo automáticamente. Escríbenos a nexumautomatic@gmail.com y lo revisamos igualmente.`;

      form.classList.remove("is-sending");
      form.classList.add("is-sent");
      submitBtn?.classList.remove("is-sending");
      success.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     Demo IA — scripted assistant (no live model wired yet)
  --------------------------------------------------------- */
  const DEMO_STEPS = [
    {
      ask: "¡Hola! Soy el asistente de Nexumautomatic. Para orientarte, cuéntame: ¿qué tipo de empresa tienes?",
      chips: ["Clínica o centro médico", "Inmobiliaria", "Restaurante", "Taller", "Otro tipo de empresa"],
    },
    {
      ask: "¿Cuántos clientes o consultas recibís aproximadamente a la semana?",
      chips: ["Menos de 20", "Entre 20 y 50", "Entre 50 y 100", "Más de 100"],
    },
    {
      ask: "¿Por dónde os suelen llegar la mayoría de esas consultas?",
      chips: ["WhatsApp", "Email", "Teléfono", "Varios canales a la vez"],
    },
    {
      ask: "¿Qué herramientas usáis ahora mismo (CRM, calendario, hojas de cálculo...)?",
      chips: ["Ninguna todavía", "Google Calendar", "Un CRM", "Varias herramientas sueltas"],
    },
    {
      ask: "Por último, ¿qué tareas repites cada semana sin apenas cambiar los pasos?",
      chips: ["Enviar presupuestos", "Recordar citas", "Actualizar el CRM a mano", "Clasificar solicitudes"],
    },
  ];

  function suggestAutomations(businessType) {
    const t = (businessType || "").toLowerCase();
    if (/cl[ií]n|dent|m[eé]dic|est[eé]tic/.test(t)) {
      return ["Consultas de WhatsApp", "Reservas de cita", "Recordatorios antes de la cita", "Captación de nuevos pacientes", "Seguimiento de presupuestos"];
    }
    if (/inmobil/.test(t)) {
      return ["Respuesta a interesados", "Filtrado de oportunidades", "Agenda de visitas", "Seguimiento automático de leads"];
    }
    if (/restaur/.test(t)) {
      return ["Gestión de reservas", "Consultas de horario", "Cambios y cancelaciones", "Confirmaciones automáticas"];
    }
    if (/taller/.test(t)) {
      return ["Recogida de datos del vehículo", "Agenda de citas", "Seguimiento de presupuestos", "Recordatorios de revisión"];
    }
    return ["Consultas de WhatsApp y email", "Reservas o solicitudes", "Seguimiento automático de leads", "Tareas administrativas repetitivas"];
  }

  function initDemo() {
    const shell = $(".demo-shell");
    const body = $("[data-demo-body]");
    const suggestions = $("[data-demo-suggestions]");
    const form = $("[data-demo-form]");
    const input = $("[data-demo-input]");
    if (!shell || !body || !suggestions || !form || !input) return;

    let step = 0;
    const answers = [];
    let done = false;

    function scrollBody() {
      body.scrollTop = body.scrollHeight;
    }

    function addMessage(text, who) {
      const el = document.createElement("div");
      el.className = "demo-msg " + (who === "user" ? "is-user" : "is-ai");
      el.textContent = text;
      body.appendChild(el);
      scrollBody();
    }

    function renderChips(chips) {
      suggestions.innerHTML = "";
      chips.forEach(label => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "demo-chip";
        btn.textContent = label;
        btn.addEventListener("click", () => handleAnswer(label));
        suggestions.appendChild(btn);
      });
    }

    function askStep() {
      if (step >= DEMO_STEPS.length) {
        finish();
        return;
      }
      const current = DEMO_STEPS[step];
      addMessage(current.ask, "ai");
      renderChips(current.chips);
    }

    function finish() {
      done = true;
      suggestions.innerHTML = "";
      const list = suggestAutomations(answers[0]);
      const summary = "En tu negocio podríamos automatizar aproximadamente estos procesos:\n" +
        list.map(i => "✓ " + i).join("\n");
      addMessage(summary, "ai");
      const cta = document.createElement("div");
      cta.className = "demo-msg is-ai";
      cta.innerHTML = '¿Hablamos de tu caso? <a href="#contacto" style="color:#04101f;text-decoration:underline;">Solicita una demostración real →</a>';
      body.appendChild(cta);
      scrollBody();
      input.placeholder = "Demo terminada — escríbenos abajo";
      input.disabled = true;
    }

    function handleAnswer(text) {
      if (done || !text.trim()) return;
      addMessage(text, "user");
      answers.push(text);
      step++;
      setTimeout(askStep, 350);
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      handleAnswer(val);
    });

    askStep();
  }

  /* ---------------------------------------------------------
     Calculadora de automatización
  --------------------------------------------------------- */
  function initCalculator() {
    const submitBtn = $("[data-calc-submit]");
    if (!submitBtn) return;
    const empty = $("[data-calc-empty]");
    const output = $("[data-calc-output]");
    const gate = $("[data-calc-gate]");
    const report = $("[data-calc-report]");
    const reportText = $("[data-calc-report-text]");

    const REDUCTION = 0.65;

    submitBtn.addEventListener("click", () => {
      const hourFields = $$("[data-calc-hours]");
      let total = 0;
      hourFields.forEach(f => { total += parseFloat(f.value) || 0; });

      const automated = Math.round(total * (1 - REDUCTION) * 10) / 10;
      const saving = Math.round((total - automated) * 10) / 10;

      $("[data-calc-current]").textContent = total.toFixed(1).replace(/\.0$/, "") + " h/semana";
      $("[data-calc-automated]").textContent = automated.toFixed(1).replace(/\.0$/, "") + " h/semana";
      $("[data-calc-saving]").textContent = saving.toFixed(1).replace(/\.0$/, "") + " h/semana";

      empty.hidden = true;
      output.hidden = false;
      gate.classList.add("is-visible");
      report.hidden = true;
    });

    if (gate) {
      gate.addEventListener("submit", e => {
        e.preventDefault();
        const sector = $("[data-calc-sector]")?.value || "tu sector";
        const consultas = $("[data-calc-consultas]")?.value || "varias";
        const saving = $("[data-calc-saving]")?.textContent || "";
        reportText.textContent =
          `Para una empresa de ${sector} con unas ${consultas} consultas/semana, automatizar WhatsApp, ` +
          `email, reservas y tareas administrativas podría liberar del orden de ${saving}. ` +
          `Nos pondremos en contacto contigo para revisarlo con detalle.`;
        gate.classList.remove("is-visible");
        gate.hidden = true;
        report.hidden = false;

        fetch("lead.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origen: "calculadora",
            nombre: $("[data-lead-name]")?.value || "",
            empresa: $("[data-lead-company]")?.value || "",
            email: $("[data-lead-email]")?.value || "",
            telefono: $("[data-lead-phone]")?.value || "",
            sector,
            consultas,
            ahorro: saving,
          }),
        }).catch(() => {});
      });
    }
  }

  /* ---------------------------------------------------------
     Así funciona — scrollytelling 3D (GSAP ScrollTrigger)
  --------------------------------------------------------- */
  function initHowItWorks() {
    const section = $(".howworks");
    const pinEl = $("[data-hw-pin]", section || document);
    const scene = $("[data-hw-scene]", section || document);
    if (!section || !pinEl || !scene) return;

    const steps = $$("[data-hw-step]", section);
    const lineFill = $("[data-hw-line]", section);

    function setActiveStep(i) {
      steps.forEach((el, idx) => el.classList.toggle("is-active", idx === i));
    }

    const canEnhance = !reduced
      && matchMedia("(min-width: 900px)").matches
      && typeof window.gsap !== "undefined"
      && typeof window.ScrollTrigger !== "undefined";

    if (!canEnhance) return; // CSS fallback already shows every step + card in normal flow

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    const msg = $("[data-hw-msg]", scene);
    const sendBtn = $("[data-hw-send-btn]", scene);
    const mini = $("[data-hw-mini]", scene);
    const core = $("[data-hw-core]", scene);
    const planes = $$("[data-hw-plane]", scene);
    const analyzing = $("[data-hw-analyzing]", scene);
    const tools = $$("[data-hw-tool]", scene);
    const actionsDone = $("[data-hw-actions-done]", scene);
    const reply = $("[data-hw-reply]", scene);
    const sentBadge = $("[data-hw-sent]", scene);
    const envelope = $("[data-hw-envelope2]", scene);
    const envelopeDot = $("[data-hw-envelope-dot]", scene);
    const client = $("[data-hw-client]", scene);
    const cablePath = $("[data-hw-cable-path]", scene);

    gsap.set(msg, { rotateX: 6, rotateY: -5, transformPerspective: 1400 });
    gsap.set(reply, { y: 30, scale: .88, rotateX: 8, transformPerspective: 1400 });
    gsap.set(mini, { opacity: 0, y: -14 });
    gsap.set(core, { opacity: 0, scale: .55 });
    gsap.set(planes, { opacity: 0, scale: .92 });
    gsap.set(analyzing, { opacity: 0 });
    gsap.set(actionsDone, { opacity: 0 });
    gsap.set(client, { opacity: 0, scale: .8 });
    gsap.set(envelope, { opacity: 0 });

    // El sobre viaja por checkpoints reales de la escena (posiciones en % del
    // contenedor): junto al botón "Enviar" -> el mini-mensaje -> el nucleo IA
    // -> junto al cliente. El cable (SVG) es solo el trazo visual de fondo;
    // el sobre en si se mueve con top/left, no con offset-path, para no
    // depender de un plugin extra de GSAP.
    const envelopePath = [
      { top: "74%", left: "63%" }, // junto al botón Enviar (escena 1)
      { top: "18%", left: "50%" }, // hacia el mini-mensaje (transición 1->2)
      { top: "50%", left: "50%" }, // sobre el nucleo IA (escena 2-3)
      { top: "88%", left: "94%" }, // junto al cliente (escena 4)
    ];
    gsap.set(envelope, { top: envelopePath[0].top, left: envelopePath[0].left, xPercent: -50, yPercent: -50, scale: .8 });

    // Las tarjetas de herramientas "nacen" del nucleo IA: medimos su posición
    // final ya maquetada por CSS y las colocamos encima del nucleo con un
    // offset inverso, para poder animarlas de vuelta a x:0,y:0 con scroll.
    const coreRect = core.getBoundingClientRect();
    const coreCenter = { x: coreRect.left + coreRect.width / 2, y: coreRect.top + coreRect.height / 2 };
    const toolOffsets = tools.map((el) => {
      const r = el.getBoundingClientRect();
      const c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      return { x: coreCenter.x - c.x, y: coreCenter.y - c.y };
    });
    tools.forEach((el, i) => {
      gsap.set(el, { x: toolOffsets[i].x, y: toolOffsets[i].y, scale: .2, opacity: 0 });
    });

    const cableLen = cablePath.getTotalLength();
    cablePath.style.strokeDasharray = cableLen;
    cablePath.style.strokeDashoffset = cableLen;

    // Progreso 0-100 (aprox. % de scroll dentro de la sección — ver el "call"
    // final que fuerza la duración total del timeline a exactamente 100).
    function onProgress(p) {
      const t = p * 100;
      setActiveStep(t < 25 ? 0 : t < 75 ? 1 : 2);
      if (lineFill) lineFill.style.transform = "scaleY(" + p + ")";
      if (sendBtn) sendBtn.classList.toggle("is-sent", t >= 16 && t < 24);
      if (envelopeDot) envelopeDot.classList.toggle("is-done", t >= 97);
    }

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        pin: pinEl,
        anticipatePin: 1,
        onUpdate: self => onProgress(self.progress),
      },
    });

    // --- 0 -> 20: escena 1 sostenida; se dibuja el cable y aparece el cliente ---
    tl.to(cablePath, { strokeDashoffset: 0, duration: 22 }, 0)
      .to(client, { opacity: 1, scale: 1, duration: 8 }, 4)
      // --- 16 -> 30: se "pulsa" enviar y el sobre sale hacia el mini-mensaje ---
      .to(envelope, { opacity: 1, duration: 4 }, 16)
      .to(msg, { y: -50, scale: .72, opacity: 0, rotateX: 14, duration: 12 }, 18)
      .to(envelope, { top: envelopePath[1].top, left: envelopePath[1].left, scale: .85, duration: 14 }, 18)
      .to(mini, { opacity: 1, y: 0, duration: 8 }, 26)
      // --- 30 -> 42: el sobre baja hasta el nucleo IA, que se activa ---
      .to(envelope, { top: envelopePath[2].top, left: envelopePath[2].left, scale: .75, duration: 12 }, 32)
      .to(mini, { opacity: 0, y: -10, duration: 6 }, 36)
      .to(core, { opacity: 1, scale: 1.08, duration: 6 }, 34)
      .to(core, { scale: 1, duration: 4 }, 40)
      // --- 42 -> 64: 3 planos de analisis, con parallax y desfase ---
      .to(analyzing, { opacity: 1, duration: 4 }, 44);

    planes.forEach((el, i) => {
      const start = 44 + i * 5;
      tl.to(el, { opacity: 1, scale: 1, duration: 8 }, start)
        .to(el, { y: "-=6", duration: 20 - i * 4 }, start); // parallax: cada plano deriva a su propio ritmo
    });

    tl.to(analyzing, { opacity: 0, duration: 4 }, 62)
      .to(planes, { opacity: 0, scale: .9, duration: 6, stagger: 2 }, 62)
      // --- 64 -> 86: las 3 tarjetas de herramientas nacen del nucleo, una a una ---
      .to({}, { duration: 0 }, 64);

    tools.forEach((el, i) => {
      const start = 64 + i * 7;
      const done = el.querySelector(".hw-tool-done");
      tl.to(el, { x: 0, y: 0, scale: 1.05, opacity: 1, duration: 9 }, start)
        .to(el, { scale: 1, duration: 3 }, start + 9);
      if (done) tl.fromTo(done, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 3 }, start + 10);
    });
    tl.to(actionsDone, { opacity: 1, duration: 4 }, 84)
      // --- 86 -> 94: las herramientas se pliegan hacia el nucleo ---
      .to(actionsDone, { opacity: 0, duration: 3 }, 88);

    tools.forEach((el, i) => {
      const start = 86 + i * 2;
      tl.to(el, { x: toolOffsets[i].x * .5, y: toolOffsets[i].y * .5, scale: .3, opacity: 0, duration: 6 }, start);
    });

    tl.to(core, { scale: .82, opacity: 0, duration: 6 }, 90)
      // --- 90 -> 100: el sobre llega al cliente y aparece la respuesta ---
      .to(envelope, { top: envelopePath[3].top, left: envelopePath[3].left, scale: .8, duration: 10 }, 90)
      .to(reply, { opacity: 1, y: 0, scale: 1, rotateX: -4, duration: 10 }, 90)
      .to(sentBadge, { opacity: 1, duration: 4 }, 96)
      .to(client, { scale: 1.08, duration: 2 }, 96)
      .to(client, { scale: 1, duration: 2 }, 98)
      .to({}, { duration: 0 }, 100); // fija la duración total del timeline en 100

    onProgress(0);

    // Paralaje muy sutil con el ratón (solo desktop con puntero fino), aditivo
    // sobre las transformaciones del scroll: rota el contenedor de la escena,
    // no las tarjetas individuales, para no pelearse con el timeline.
    if (matchMedia("(pointer: fine)").matches) {
      let raf = null;
      pinEl.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          const r = scene.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5;
          const py = (e.clientY - r.top) / r.height - .5;
          gsap.to(scene, { rotateY: px * 4, rotateX: py * -2, duration: .6, ease: "power2.out", overwrite: "auto" });
        });
      });
      pinEl.addEventListener("mouseleave", () => {
        gsap.to(scene, { rotateY: 0, rotateX: 0, duration: .6, ease: "power2.out", overwrite: "auto" });
      });
    }
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initFaqAccordion, "initFaqAccordion");
    safe(initHowItWorks, "initHowItWorks");
    safe(initContactForm, "initContactForm");
    safe(initDemo, "initDemo");
    safe(initCalculator, "initCalculator");

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
