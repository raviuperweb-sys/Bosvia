(function () {
  "use strict";

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".has-sub > button").forEach(function (b) {
    b.addEventListener("click", function () {
      var li = b.parentNode;
      var open = li.classList.toggle("open");
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Image fallbacks (photos are loaded from the current live site in this preview) */
  function initials(text) {
    return (text || "B").replace(/^(Dr\.|Mr\.)\s*/i, "").split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }
  function handle(img) {
    if (img.dataset.person !== undefined) {
      var d = document.createElement("div");
      d.className = "mono";
      d.setAttribute("role", "img");
      d.setAttribute("aria-label", img.alt);
      d.textContent = initials(img.alt);
      img.replaceWith(d);
    } else if (img.dataset.fallback !== undefined) {
      var s = document.createElement("span");
      s.className = "logo-text";
      s.textContent = img.dataset.fallback;
      img.replaceWith(s);
    } else if (img.dataset.optional !== undefined) {
      var host = img.closest("[data-media]");
      if (host) {
        var parent = host.parentNode;
        host.remove();
        parent.classList.add("solo");
      }
    }
  }
  document.querySelectorAll("img[data-person],img[data-fallback],img[data-optional]").forEach(function (img) {
    img.addEventListener("error", function () { handle(img); });
    if (img.complete && img.naturalWidth === 0) handle(img);
  });

  /* Tabs (contact page) */
  var tabs = document.querySelectorAll("[role=tab]");
  function selectTab(name) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      var panel = document.getElementById("tab-" + t.dataset.tab);
      if (panel) panel.hidden = !on;
    });
  }
  if (tabs.length) {
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { selectTab(t.dataset.tab); history.replaceState(null, "", "#" + t.dataset.tab); });
    });
    if (location.hash === "#careers") selectTab("careers");
  }

  /* Forms: preview behaviour only. Backend (database + email alert) is built in the development phase. */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    var cv = form.querySelector("input[type=file]");
    var err = form.querySelector(".form-err");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (err) err.textContent = "";
      if (cv && cv.files.length) {
        var f = cv.files[0];
        var ok = /\.(pdf|doc|docx)$/i.test(f.name);
        if (!ok) { err.textContent = "Upload your CV as a PDF or Word file."; cv.focus(); return; }
        if (f.size > 5 * 1024 * 1024) { err.textContent = "The CV is larger than 5MB. Upload a smaller file."; cv.focus(); return; }
      }
      var nameField = form.querySelector("input[name=name]");
      var who = nameField && nameField.value ? ", " + nameField.value.split(" ")[0] : "";
      var done = form.parentNode.querySelector(".form-ok");
      if (done) {
        done.querySelector("[data-who]").textContent = who;
        done.hidden = false;
        form.hidden = true;
        done.focus();
      }
    });
  });
})();
