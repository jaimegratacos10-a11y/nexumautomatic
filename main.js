(function () {
  "use strict";

  const data = window.__BRAND__ || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---------------------------------------------------------
     Mounts — idempotent, only fill if empty
  --------------------------------------------------------- */

  function mountNav() {
    const desktop = $("[data-nav-links]");
    const mobile = $("[data-nav-mobile-list]");
    if (!data.nav) return;
    if (desktop && !desktop.children.length) {
      desktop.innerHTML = data.nav.map(item =>
        `<a class="nav-link" href="${escHTML(item.href)}">${escHTML(item.label)}</a>`
      ).join("");
    }
    if (mobile && !mobile.children.length) {
      mobile.innerHTML = data.nav.map(item =>
        `<a href="${escHTML(item.href)}">${escHTML(item.label)}</a>`
      ).join("");
    }
  }

  function mountServices() {
    const target = $("[data-services]");
    if (!target || target.children.length || !data.services) return;
    target.innerHTML = data.services.map((s, i) => `
      <div class="service-row" data-service-row>
        <button class="service-row-head" data-service-toggle aria-expanded="false" aria-controls="service-panel-${s.id}">
          <span class="service-num">${escHTML(s.num)}</span>
          <span class="service-title-wrap">
            <span class="service-name">${escHTML(s.name)}</span>
            <span class="service-short">${escHTML(s.short)}</span>
          </span>
          <span class="service-toggle" aria-hidden="true"></span>
        </button>
        <div class="service-panel" id="service-panel-${s.id}">
          <div class="service-panel-inner">
            <div class="service-panel-content">
              <p class="service-desc">${escHTML(s.description)}</p>
              <ul class="service-bullets">
                ${s.bullets.map(b => `<li>${escHTML(b)}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function mountProcess() {
    const target = $("[data-process]");
    if (!target || target.children.length || !data.process) return;
    target.innerHTML = data.process.map(p => `
      <div class="process-item" data-reveal>
        <div class="process-num">${escHTML(p.num)}</div>
        <h3>${escHTML(p.title)}</h3>
        <p>${escHTML(p.text)}</p>
      </div>
    `).join("");
  }

  function mountBenefits() {
    const target = $("[data-benefits]");
    if (!target || target.children.length || !data.benefits) return;
    target.innerHTML = data.benefits.map(b => `
      <div class="card benefit-card" data-reveal>
        <h3>${escHTML(b.title)}</h3>
        <p>${escHTML(b.text)}</p>
      </div>
    `).join("");
  }

  function mountCases() {
    const target = $("[data-cases]");
    if (!target || target.children.length || !data.useCases) return;
    target.innerHTML = data.useCases.map(c => `
      <div class="card case-card" data-reveal>
        <span class="case-tag">${escHTML(c.tag)}</span>
        <h3>${escHTML(c.title)}</h3>
        <p>${escHTML(c.text)}</p>
      </div>
    `).join("");
  }

  function mountPlans() {
    const target = $("[data-plans]");
    if (!target || target.children.length || !data.plans) return;
    target.innerHTML = data.plans.map(p => `
      <div class="card plan-card ${p.featured ? "is-featured" : ""}" data-reveal>
        ${p.featured ? '<span class="plan-badge">Recomendado</span>' : ""}
        <div class="plan-name">${escHTML(p.name)}</div>
        <p class="plan-tagline">${escHTML(p.tagline)}</p>
        <ul class="plan-features">
          ${p.features.map(f => `<li>${escHTML(f)}</li>`).join("")}
        </ul>
        <a class="btn ${p.featured ? "btn-primary" : "btn-ghost"}" href="#contacto">${escHTML(p.cta)}</a>
      </div>
    `).join("");
  }

  function mountFaqs() {
    const target = $("[data-faqs]");
    if (!target || target.children.length || !data.faqs) return;
    target.innerHTML = data.faqs.map((f, i) => `
      <div class="faq-item" data-faq-item>
        <button class="faq-q" data-faq-toggle aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${escHTML(f.q)}</span>
          <span class="faq-icon" aria-hidden="true"></span>
        </button>
        <div class="faq-a" id="faq-a-${i}">
          <div class="faq-a-inner"><p>${escHTML(f.a)}</p></div>
        </div>
      </div>
    `).join("");
  }

  function mountFooter() {
    const target = $("[data-footer-links]");
    if (!target || target.children.length || !data.footerLinks) return;
    target.innerHTML = data.footerLinks.map(l =>
      `<a href="${escHTML(l.href)}">${escHTML(l.label)}</a>`
    ).join("");
  }

  function mountContactInfo() {
    const emailEl = $("[data-contact-email]");
    if (emailEl && data.contact && !emailEl.textContent.trim()) {
      emailEl.textContent = data.contact.email;
      emailEl.setAttribute("href", "mailto:" + data.contact.email);
    }
    const waEl = $("[data-contact-whatsapp]");
    if (waEl && data.contact) {
      waEl.setAttribute("href", data.contact.whatsapp);
    }
  }

  /* ---------------------------------------------------------
     Inits
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
      const navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  function initMouseGradient() {
    if (!fineHover) return;
    let tx = 50, ty = 42, mx = 50, my = 42;
    document.addEventListener("mousemove", e => {
      tx = (e.clientX / innerWidth) * 100;
      ty = (e.clientY / innerHeight) * 100;
    }, { passive: true });
    function loop() {
      mx += (tx - mx) * 0.055;
      my += (ty - my) * 0.055;
      document.documentElement.style.setProperty("--mx", mx + "%");
      document.documentElement.style.setProperty("--my", my + "%");
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

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

  function bindAccordionGroup(rows, { exclusive } = {}) {
    rows.forEach(row => {
      if (row.dataset.accordionBound) return;
      row.dataset.accordionBound = "1";
      const toggle = row.querySelector("[data-service-toggle], [data-faq-toggle]");
      if (!toggle) return;
      toggle.addEventListener("click", () => {
        const isOpen = row.getAttribute("data-open") === "true";
        if (exclusive && !isOpen) {
          rows.forEach(r => { r.setAttribute("data-open", "false"); r.querySelector("button")?.setAttribute("aria-expanded", "false"); });
        }
        row.setAttribute("data-open", isOpen ? "false" : "true");
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });
  }

  function initServiceAccordion() {
    const rows = $$("[data-service-row]");
    if (!rows.length) return;
    bindAccordionGroup(rows, { exclusive: false });
  }

  function initFaqAccordion() {
    const items = $$("[data-faq-item]");
    if (!items.length) return;
    bindAccordionGroup(items, { exclusive: false });
    if (items[0]) {
      items[0].setAttribute("data-open", "true");
      items[0].querySelector("[data-faq-toggle]")?.setAttribute("aria-expanded", "true");
    }
  }

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

      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

      const firstName = (form.elements.name?.value || "").trim().split(/\s+/)[0] || "Hola";
      success.textContent = `${firstName}, hemos recibido tu mensaje. Te escribimos en breve a tu correo.`;

      form.classList.remove("is-sending");
      form.classList.add("is-sent");
      submitBtn?.classList.remove("is-sending");
      success.classList.add("is-visible");
    });
  }

  function boot() {
    safe(mountNav, "mountNav");
    safe(mountServices, "mountServices");
    safe(mountProcess, "mountProcess");
    safe(mountBenefits, "mountBenefits");
    safe(mountCases, "mountCases");
    safe(mountPlans, "mountPlans");
    safe(mountFaqs, "mountFaqs");
    safe(mountFooter, "mountFooter");
    safe(mountContactInfo, "mountContactInfo");

    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initMouseGradient, "initMouseGradient");
    safe(initReveals, "initReveals");
    safe(initServiceAccordion, "initServiceAccordion");
    safe(initFaqAccordion, "initFaqAccordion");
    safe(initContactForm, "initContactForm");

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
