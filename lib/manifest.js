(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Nexumautomatic",
    legalName: "Nexumautomatic",
    tagline: "Automatización con IA para negocios que no quieren perder el tiempo",
    year: "2026",
    contact: { email: "nexumautomatic@gmail.com" },
    nav: [
      { label: "Servicios", href: "#servicios" },
      { label: "Cómo funciona", href: "#proceso" },
      { label: "Casos de uso", href: "#casos" },
      { label: "Planes", href: "#planes" },
      { label: "FAQ", href: "#faq" }
    ],
    services: [], process: [], benefits: [], useCases: [], plans: [], faqs: [],
    footerLinks: [
      { label: "Servicios", href: "#servicios" },
      { label: "Cómo funciona", href: "#proceso" },
      { label: "FAQ", href: "#faq" },
      { label: "Contacto", href: "#contacto" }
    ]
  };

  function enhanceExistingLayout() {
    const heroTitle = document.querySelector(".hero-title");
    const heroSub = document.querySelector(".hero-sub");
    const heroActions = document.querySelector(".hero-actions");
    const diagram = document.querySelector(".diagram");
    const services = document.querySelector("#servicios");
    const servicesHead = services && services.querySelector(".section-head");
    const hwKicker = document.querySelector("#como-funciona .kicker");
    const hwTitle = document.querySelector(".howworks-title");
    const hwSub = document.querySelector(".howworks-sub");

    if (heroTitle) {
      heroTitle.innerHTML = 'Menos tareas repetitivas.<br><span class="text-grad">Más negocio.</span>';
    }
    if (heroSub) {
      heroSub.textContent = "Automatizamos email, WhatsApp, reservas, CRM y procesos repetitivos con sistemas de IA conectados a las herramientas que ya utilizas.";
    }
    if (heroActions) {
      const links = heroActions.querySelectorAll("a");
      if (links[0]) {
        links[0].textContent = "Analiza gratis un proceso";
        links[0].href = "#contacto";
      }
      if (links[1]) {
        links[1].textContent = "Ver cómo funciona";
        links[1].href = "#como-funciona";
      }
    }

    /* Sustituimos el diagrama antiguo: no añadimos otra sección debajo. */
    if (diagram) {
      diagram.className = "hero-photo-wrap";
      diagram.removeAttribute("aria-hidden");
      diagram.innerHTML = `
        <img class="hero-photo" src="assets/img/nexum-laptop-email.webp" alt="Portátil mostrando una consulta por email que puede automatizar Nexum" width="1200" height="900" decoding="async" fetchpriority="high">
        <div class="hero-photo-chip"><span>01</span><strong>El cliente escribe</strong></div>
        <div class="hero-photo-status"><span class="status-dot"></span> Consulta recibida</div>
      `;
    }

    /* La mano es un recurso visual dentro de Servicios, no una sección duplicada. */
    if (servicesHead && !services.querySelector(".services-art")) {
      const art = document.createElement("figure");
      art.className = "services-art";
      art.setAttribute("aria-hidden", "true");
      art.innerHTML = '<img src="assets/img/nexum-robot-hand.webp" alt="" width="1200" height="900" loading="lazy" decoding="async">';
      servicesHead.insertAdjacentElement("afterend", art);
    }

    if (hwKicker) hwKicker.textContent = "Un proceso simple, resultados reales";
    if (hwTitle) hwTitle.textContent = "Así funciona";
    if (hwSub) hwSub.textContent = "Un mensaje entra. La IA lo entiende, consulta tus herramientas, ejecuta las acciones necesarias y devuelve una respuesta.";

    const steps = document.querySelectorAll("[data-hw-step]");
    if (steps[0]) {
      steps[0].querySelector("h3").textContent = "El cliente escribe";
      steps[0].querySelector("p").textContent = "Recibe consultas por email, WhatsApp o desde tu web.";
    }
    if (steps[1]) {
      steps[1].querySelector("h3").textContent = "La IA trabaja por ti";
      steps[1].querySelector("p").textContent = "Analiza, responde, consulta tu agenda o CRM y ejecuta las acciones necesarias.";
    }
    if (steps[2]) {
      steps[2].querySelector("h3").textContent = "El cliente recibe la respuesta";
      steps[2].querySelector("p").textContent = "Una contestación rápida, personalizada y profesional.";
    }

    const contactHeading = document.querySelector("#contacto h2");
    const contactIntro = document.querySelector("#contacto .section-head.p");
    const contactSubmit = document.querySelector("#contacto .btn-label");
    if (contactHeading) contactHeading.textContent = "Cuéntanos una tarea. Te diremos si merece la pena automatizarla.";
    if (contactIntro) contactIntro.textContent = "Describe un proceso repetitivo de tu empresa y analizaremos qué se puede automatizar, con qué herramientas y dónde no tendría sentido hacerlo.";
    if (contactSubmit) contactSubmit.textContent = "Analizar gratis mi proceso";

    if (!document.getElementById("nexum-clean-enhancements")) {
      const style = document.createElement("style");
      style.id = "nexum-clean-enhancements";
      style.textContent = `
        .brand-mark{display:none!important}.brand{gap:.15rem}.brand-line1{font-size:1.08rem;letter-spacing:.08em}.brand-line2{font-size:.5rem;letter-spacing:.32em}
        .hero-title{max-width:13ch;letter-spacing:-.05em}.hero-sub{max-width:42rem}
        .hero-photo-wrap{position:relative;min-height:520px;display:grid;place-items:center;perspective:1500px}
        .hero-photo{width:min(650px,100%);border-radius:30px;box-shadow:0 42px 90px -48px rgba(0,0,0,.42);transform:rotateY(-5deg) rotateX(2deg);object-fit:cover;aspect-ratio:4/3;transition:transform .7s var(--ease-out),box-shadow .7s var(--ease-out)}
        .hero-photo-wrap:hover .hero-photo{transform:rotateY(-2deg) rotateX(1deg) translateY(-6px);box-shadow:0 52px 100px -48px rgba(0,0,0,.5)}
        .hero-photo-chip,.hero-photo-status{position:absolute;background:rgba(255,255,255,.92);border:1px solid var(--line);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 20px 45px -30px rgba(0,0,0,.4)}
        .hero-photo-chip{top:13%;left:-2%;padding:1rem 1.15rem;border-radius:18px;display:grid;gap:.12rem}.hero-photo-chip span{font-family:var(--mono);font-size:.7rem;color:var(--mute)}.hero-photo-chip strong{font-size:.92rem}
        .hero-photo-status{right:-1%;bottom:14%;padding:.7rem 1rem;border-radius:999px;font-size:.76rem;font-weight:600;display:flex;align-items:center;gap:.5rem}.status-dot{width:7px;height:7px;border-radius:50%;background:#111;box-shadow:0 0 0 5px rgba(0,0,0,.06)}
        #servicios .section-inner{overflow:hidden}.services-art{height:220px;position:relative;margin:-1rem 0 2.25rem;pointer-events:none}.services-art img{position:absolute;right:-8%;top:-120px;width:min(590px,55vw);filter:grayscale(1);mix-blend-mode:multiply;opacity:.92;mask-image:linear-gradient(90deg,transparent 0%,#000 24%,#000 80%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 24%,#000 80%,transparent 100%)}
        .howworks{background:linear-gradient(180deg,#f6f6f6 0%,#fff 52%,#f7f7f7 100%)!important}.howworks-scene{transform-style:preserve-3d}.hw-chip{background:linear-gradient(145deg,#171717,#020202)!important;border:1px solid rgba(255,255,255,.2);box-shadow:0 34px 70px -28px rgba(0,0,0,.72)!important}.hw-chip:before{content:"";position:absolute;inset:-13px;border:1px solid rgba(0,0,0,.12);border-radius:29px;box-shadow:0 0 0 7px rgba(255,255,255,.55);pointer-events:none}.hw-proc{background:rgba(255,255,255,.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 28px 56px -32px rgba(0,0,0,.46)!important}.hw-link{stroke:rgba(10,10,10,.34)!important;stroke-width:.7!important}.hw-card{background:rgba(255,255,255,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
        @media(min-width:900px) and (prefers-reduced-motion:no-preference){.howworks{height:420vh!important}.hw-proc-agenda{translate:0 -50% 30px}.hw-proc-responde{translate:-50% 0 42px}.hw-proc-crm{translate:0 -50% 50px}.hw-proc-automatiza{translate:-50% 0 22px}}
        @media(max-width:899px){.hero-photo-wrap{min-height:auto;margin-top:.5rem}.hero-photo{transform:none;border-radius:22px}.hero-photo-chip{left:2%;top:8%}.hero-photo-status{right:2%;bottom:8%}.services-art{height:150px}.services-art img{top:-85px;right:-26%;width:82vw}.howworks{height:auto!important}}
        @media(max-width:560px){.hero-photo-chip{padding:.7rem .8rem}.hero-photo-status{font-size:.66rem}.services-art{height:110px}.services-art img{top:-55px;right:-38%;width:100vw}}
        @media(prefers-reduced-motion:reduce){.hero-photo{transform:none!important;transition:none!important}}
      `;
      document.head.appendChild(style);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhanceExistingLayout);
  else enhanceExistingLayout();
})();
