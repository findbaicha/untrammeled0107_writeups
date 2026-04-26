// ===== Writeup Page Enhancements =====

// Dark mode restore
(function() {
  var saved = localStorage.getItem("scheme") || "dark";
  document.documentElement.dataset.scheme = saved;
})();

// Scroll progress bar
(function() {
  var bar = document.createElement("div");
  bar.id = "scroll-progress";
  document.body.prepend(bar);
  window.addEventListener("scroll", function() {
    var top = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (top / h) * 100 : 0) + "%";
  });
})();

// Back to top button
(function() {
  var btt = document.createElement("button");
  btt.id = "backToTop";
  btt.setAttribute("aria-label", "Back to top");
  btt.textContent = "↑";
  document.body.appendChild(btt);
  window.addEventListener("scroll", function() {
    btt.classList.toggle("show", window.scrollY > 400);
  });
  btt.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// Build breadcrumb, header badge, and table of contents
(function() {
  var wp = document.querySelector(".wp-content");
  if (!wp) return;

  var category = wp.dataset.category || "misc";
  var competition = wp.dataset.competition || "CTF";
  var challenge = wp.dataset.challenge || "";
  var difficulty = wp.dataset.difficulty || "easy";
  var date = wp.dataset.date || "";

  var catLabels = { web: "Web", pwn: "Pwn", reverse: "Reverse", misc: "Misc", crypto: "Crypto" };
  var diffLabels = { easy: "Easy", medium: "Medium", hard: "Hard" };
  var CatColors = { web: "#e34c26", pwn: "#9b59b6", reverse: "#2ecc71", misc: "#f39c12", crypto: "#e74c3c" };
  var DiffColors = { easy: "#2ecc71", medium: "#f39c12", hard: "#e74c3c" };

  // Grab original h1
  var h1 = wp.querySelector("h1.wp-title");
  var titleText = h1 ? h1.textContent.trim() : challenge;

  // --- Breadcrumb ---
  var bc = document.createElement("div");
  bc.className = "wp-breadcrumb";
  bc.innerHTML = '<a href="/">🏠 Home</a><span class="sep">›</span><a href="/competitions.html">Competitions</a><span class="sep">›</span><span>' + competition + '</span><span class="sep">›</span><span>' + challenge + '</span>';

  // --- Header ---
  var header = document.createElement("div");
  header.className = "wp-header";
  var badgeCat = '<span class="badge" style="background:' + (CatColors[category] || "#4a6cf7") + ';color:white;">' + (catLabels[category] || category) + '</span>';
  var badgeDiff = '<span class="badge" style="background:' + (DiffColors[difficulty] || "#2ecc71") + ';color:white;">' + (diffLabels[difficulty] || difficulty) + '</span>';
  header.innerHTML =
    '<div class="badges">' + badgeCat + badgeDiff + '</div>' +
    '<h1 class="wp-title" style="margin-top:0;font-size:1.8rem;">' + titleText + '</h1>' +
    '<div class="wp-meta">' +
      '<span>🏆 ' + competition + '</span>' +
      (date ? '<span>📅 ' + date + '</span>' : '') +
    '</div>';

  // --- Table of Contents ---
  var sections = wp.querySelectorAll(".wp-section h2");
  var toc = document.createElement("div");
  toc.className = "wp-toc";
  var ol = document.createElement("ol");
  sections.forEach(function(h2, i) {
    var id = "sec-" + i;
    h2.id = id;
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + id;
    a.textContent = h2.textContent.trim();
    li.appendChild(a);
    ol.appendChild(li);
  });
  toc.innerHTML = '<h3>📑 Table of Contents</h3>';
  toc.appendChild(ol);

  // Insert in order: breadcrumb → header → toc
  wp.insertBefore(bc, wp.firstChild);
  wp.insertBefore(header, wp.firstChild.nextSibling);
  wp.insertBefore(toc, wp.firstChild.nextSibling.nextSibling);

  // Hide original h1
  if (h1) h1.style.display = "none";

  // --- Back to Home ---
  var back = document.createElement("a");
  back.className = "back-home";
  back.href = "/";
  back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;vertical-align:middle;"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Back to Home';
  wp.appendChild(back);
})();

// Auto line numbers for .ide and .code-block blocks
setTimeout(function() {
  document.querySelectorAll(".ide pre, .code-block pre").forEach(function(pre) {
    if (pre.querySelector(".line")) return;
    var content = pre.textContent;
    var lines = content.split("\n");
    // Remove trailing empty line if any
    if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    pre.innerHTML = "";
    pre.style.counterReset = "code-line";
    lines.forEach(function(line) {
      var span = document.createElement("span");
      span.className = "line";
      span.textContent = line;
      pre.appendChild(span);
    });
  });
}, 0);