(function () {
  "use strict";
  fetch("assets/credits.json").then(function (r) { return r.json(); }).then(function (credits) {
    var list = document.querySelector("[data-credits]");
    if (!list) return;
    list.innerHTML = Object.values(credits).map(function (c) {
      var author = c.creator_url
        ? '<a href="' + c.creator_url + '" target="_blank" rel="noopener">' + c.creator + '</a>'
        : c.creator;
      return (
        '<li>' +
        '<strong>' + c.title + '</strong> — ' + author + ' (' + c.source + ') · ' +
        '<a href="' + c.license_url + '" target="_blank" rel="noopener">' + c.license.toUpperCase() + ' ' + (c.license_version || '') + '</a> · ' +
        '<a href="' + c.foreign_landing_url + '" target="_blank" rel="noopener">Ver original ↗</a>' +
        '</li>'
      );
    }).join("");
  }).catch(function () {
    var list = document.querySelector("[data-credits]");
    if (list) list.innerHTML = "<li>No se ha podido cargar el listado de créditos.</li>";
  });
})();
