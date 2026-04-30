// ============================================================
// UNTRAMMELED0107 CTF WRITEUPS — TERMINAL EDITION
// ============================================================

// WP Data
const WP_LIST = [
  { title: "[Web] BUUCTF Love_SQL", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buulovesql/love_sql.html", comp: "buuctf" },
  { title: "[Web] BUUCTF 随便注", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buusuibianzhu/suibianzhu.html", comp: "buuctf" },
  { title: "[Web] BUUCTF Babysql", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buu/babysql/index.html", comp: "buuctf" },
  { title: "[Web] CTFShow Base64编码隐藏", cat: "web", date: "2026-4-16", read: "2 min", path: "wps/web/ctfshow/Base64encode/index.html", comp: "ctfshow" },
  { title: "[Web] CTFShow HTTP头注入", cat: "web", date: "2026-4-16", read: "2 min", path: "wps/web/ctfshow/http头注入/index.html", comp: "ctfshow" },
  { title: "[Reverse] MOECTF2025 Speed", cat: "reverse", date: "2026-4-18", read: "4 min", path: "wps/moectf2025/reverse/speed/index.html", comp: "moectf2025" },
  { title: "[Reverse] MOECTF2025 逆向工程入门指北", cat: "reverse", date: "2026-4-21", read: "4 min", path: "wps/moectf2025/reverse/入门指北/index.html", comp: "moectf2025" },
  { title: "[Reverse] MOECTF2025 Base", cat: "reverse", date: "2026-4-21", read: "4 min", path: "wps/moectf2025/reverse/base/index.html", comp: "moectf2025" },
  { title: "[Reverse] MOECTF2025 Catch", cat: "reverse", date: "2026-4-21", read: "4 min", path: "wps/moectf2025/reverse/catch/index.html", comp: "moectf2025" },
  { title: "[Reverse] MOECTF2025 UPX", cat: "reverse", date: "2026-4-23", read: "4 min", path: "wps/moectf2025/reverse/upx/index.html", comp: "moectf2025" },
  { title: "[Reverse] MOECTF2025 ez3", cat: "reverse", date: "2026-4-24", read: "4 min", path: "wps/moectf2025/reverse/ez3/index.html", comp: "moectf2025" },
  { title: "[Cloud] CUHK25CTF Infinity_token", cat: "cloud", date: "2026-4-25", read: "3 min", path: "wps/CloudSec/cuhk.html", comp: "cuhk25ctf" },
];

// ---------- Render articles with animations ----------
function render(list) {
  const container = document.getElementById("wpList");
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon-large">[!]</div>
        <p>No writeups found matching your query...</p>
        <p style="font-size:0.7rem;margin-top:0.5rem">Try a different keyword or category</p>
      </div>`;
    return;
  }
  list.forEach((item, idx) => {
    const el = document.createElement("div");
    el.className = `article-item animate-in animate-stagger-${Math.min(idx + 1, 5)}`;
    el.innerHTML = `
      <a href="${item.path}" target="_blank">
        <h2 class="article-title">${item.title}</h2>
        <div class="article-meta">
          <span class="article-tag">${item.cat.toUpperCase()}</span>
          <span>📅 ${item.date}</span>
          <span>⏱ ${item.read}</span>
          <span class="article-link-icon">↗</span>
        </div>
      </a>
    `;
    container.appendChild(el);
  });
}

render(WP_LIST);

// ---------- Stats ----------
function updateStats() {
  const total = WP_LIST.length;
  const cats = new Set(WP_LIST.map(i => i.cat));
  const comps = new Set(WP_LIST.map(i => i.comp));

  animateValue("totalCount", total);
  document.getElementById("catCount").textContent = cats.size;
  document.getElementById("compCount").textContent = comps.size;
}

function animateValue(id, end) {
  const el = document.getElementById(id);
  let start = 0;
  const duration = 600;
  const step = Math.ceil(end / 30);
  const interval = duration / (end / step || 1);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { start = end; clearInterval(timer); }
    el.textContent = start;
  }, interval);
}

updateStats();

// ---------- Category filter ----------
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    const filtered = cat === "all" ? WP_LIST : WP_LIST.filter(i => i.cat === cat);
    render(filtered);
  });
});

// ---------- Search ----------
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", e => {
  const kw = e.target.value.toLowerCase().trim();
  // Reset active category
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  const allBtn = document.querySelector('.cat-btn[data-cat="all"]');
  if (allBtn) allBtn.classList.add("active");

  const filtered = WP_LIST.filter(i => i.title.toLowerCase().includes(kw));
  render(filtered);
});

// ---------- Dark Mode (default: dark) ----------
const darkToggle = document.getElementById("dark-mode-toggle");
function setMode(mode) {
  document.documentElement.dataset.scheme = mode;
  localStorage.setItem("scheme", mode);
}
darkToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.scheme || "dark";
  setMode(current === "dark" ? "light" : "dark");
});
window.addEventListener("load", () => {
  const saved = localStorage.getItem("scheme") || "dark";
  setMode(saved);
});

// ---------- Hamburger ----------
const hamburger = document.getElementById("toggle-menu");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
  });
}

// ---------- Keyboard shortcut: Ctrl+K to focus search ----------
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});