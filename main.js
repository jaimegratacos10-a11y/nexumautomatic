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

  function boot() {
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initFaqAccordion, "initFaqAccordion");
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
