(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const gate = $("[data-panel-gate]");
  const content = $("[data-panel-content]");
  const errorEl = $("[data-panel-error]");
  const who = $("[data-panel-who]");
  const signOut = $("[data-panel-signout]");
  const tableWrap = $("[data-panel-table-wrap]");
  const rowsEl = $("[data-panel-rows]");
  const emptyEl = $("[data-panel-empty]");

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.classList.add("is-visible");
  }

  function renderLeads(leads) {
    if (!leads || !leads.length) {
      emptyEl.hidden = false;
      tableWrap.hidden = true;
      return;
    }
    emptyEl.hidden = true;
    tableWrap.hidden = false;
    rowsEl.innerHTML = leads.map(l => `
      <tr>
        <td>${escHTML((l.fecha || "").replace("T", " ").slice(0, 16))}</td>
        <td>${escHTML(l.origen)}</td>
        <td>${escHTML(l.nombre)}</td>
        <td>${escHTML(l.empresa)}</td>
        <td>${escHTML(l.email)}</td>
        <td>${escHTML(l.telefono)}</td>
        <td>${escHTML(l.sector)}</td>
        <td>${escHTML(l.mensaje || l.consultas)}</td>
        <td>${escHTML(l.ahorro)}</td>
      </tr>
    `).join("");
  }

  window.handleCredentialResponse = async function (response) {
    try {
      const res = await fetch("panel-data.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential }),
      });
      const data = await res.json();
      if (!data.ok) {
        const messages = {
          no_autorizado: "Esta cuenta de Google no tiene acceso a este panel.",
          token_invalido: "No hemos podido verificar tu sesión de Google. Inténtalo de nuevo.",
          rate: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
        };
        showError(messages[data.reason] || "No se ha podido iniciar sesión.");
        return;
      }
      gate.hidden = true;
      content.hidden = false;
      who.textContent = "Sesión iniciada como " + data.email;
      renderLeads(data.leads);
    } catch (e) {
      showError("No se ha podido conectar con el servidor. Inténtalo de nuevo.");
    }
  };

  if (signOut) {
    signOut.addEventListener("click", () => {
      if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
      content.hidden = true;
      gate.hidden = false;
    });
  }
})();
