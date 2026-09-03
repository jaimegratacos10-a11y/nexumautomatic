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

    const emailIn = $("[data-hw-email-in]", scene);
    const sendBtn = $("[data-hw-send-btn]", scene);
    const envelope = $("[data-hw-envelope]", scene);
    const badgeClient = $("[data-hw-badge-client]", scene);
    const aiCard = $("[data-hw-ai]", scene);
    const aiCore = $("[data-hw-core]", scene);
    const checks = $$("[data-hw-check]", scene);
    const emailOut = $("[data-hw-email-out]", scene);
    const badgeDone = $("[data-hw-badge-done]", scene);
    const notif = $("[data-hw-notif]", scene);

    gsap.set(emailIn, { rotateX: 7, rotateY: -6, transformPerspective: 1400 });
    gsap.set(aiCard, { y: 50, scale: .88 });
    gsap.set(emailOut, { y: 80, scale: .86, rotateX: 10, transformPerspective: 1400 });
    gsap.set(badgeDone, { y: 26, opacity: 0 });
    gsap.set(notif, { scale: .4, opacity: 0 });
    gsap.set(envelope, { opacity: 0, xPercent: -50, yPercent: -50, scale: .7 });

    // Progreso 0-100 (aprox. % de scroll dentro de la sección — ver el "call"
    // final que fuerza la duración total del timeline a exactamente 100).
    const checkStart = 36, checkEnd = 58;
    const checkStep = checks.length > 1 ? (checkEnd - checkStart) / (checks.length - 1) : 0;

    function onProgress(p) {
      const t = p * 100;
      setActiveStep(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
      if (lineFill) lineFill.style.transform = "scaleY(" + p + ")";
      if (sendBtn) sendBtn.classList.toggle("is-sent", t >= 14 && t < 22);
      const checkedCount = t < checkStart ? 0 : t >= checkEnd ? checks.length : Math.floor((t - checkStart) / checkStep) + 1;
      checks.forEach((li, i) => li.classList.toggle("is-checked", i < checkedCount));
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

    // --- 15 -> 30: el email se envía y sale de la escena ---
    tl.set(envelope, { opacity: 1, top: "18%", scale: .7 }, 15)
      .to(envelope, { top: "50%", scale: 1.15, duration: 15 }, 15)
      .to(emailIn, { y: -90, scale: .82, opacity: 0, rotateX: 16, duration: 15 }, 15)
      .to(badgeClient, { opacity: 0, y: -26, duration: 8 }, 15)
      .to(envelope, { opacity: 0, scale: .6, duration: 5 }, 30)
      // --- 30 -> 60: la IA entra y procesa ---
      .to(aiCard, { opacity: 1, y: 0, scale: 1, duration: 8 }, 32)
      .to(aiCore, { rotate: 14, duration: 28 }, 32)
      // --- 60 -> 68: la IA termina y envía la respuesta ---
      .to(aiCard, { opacity: 0, y: -36, scale: .9, duration: 8 }, 60)
      .set(envelope, { opacity: 1, top: "56%", scale: .7 }, 60)
      .to(envelope, { top: "86%", scale: 1.15, duration: 8 }, 60)
      .to(envelope, { opacity: 0, scale: .6, duration: 4 }, 66)
      // --- 68 -> 100: la respuesta llega ---
      .to(emailOut, { opacity: 1, y: 0, scale: 1, rotateX: -5, duration: 12 }, 68)
      .to(badgeDone, { opacity: 1, y: 0, duration: 8 }, 74)
      .to(notif, { opacity: 1, scale: 1, duration: 6 }, 80)
      .to({}, { duration: 0 }, 100); // fija la duración total del timeline en 100

    onProgress(0);
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
