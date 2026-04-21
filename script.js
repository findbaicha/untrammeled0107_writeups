// WP 列表（自行添加）
const WP_LIST = [
  { title: "[Web] BUUCTF Love_SQL", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buulovesql/love_sql.html" },
  { title: "[Web] BUUCTF 随便注", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buusuibianzhu/suibianzhu.html" },
  { title: "[Web] BUUCTF Babysql", cat: "web", date: "2026-4-16", read: "3 min", path: "wps/web/buu/babysql/index.html" },
  { title: "[Web] CTFShow Base64Encode", cat: "web", date: "2026-4-16", read: "2 min", path: "wps/web/ctfshow/Base64encode/index.html" },
  { title: "[Web] CTFShow HTTP头注入", cat: "web", date: "2026-4-16", read: "2 min", path: "wps/web/ctfshow/http头注入/index.html" },
  { title: "[Reverse] MOECTF2025 Speed", cat: "reverse", date: "2026-4-18", read: "4 min", path: "wps/moectf2025/reverse/speed/index.html" },
  { title: "[Reverse] MOECTF2025 逆向工程入门指北", cat: "reverse", date: "2026-4-20", read: "4 min", path: "wps/moectf2025/reverse/入门指北/index.html" },
  { title: "[Reverse] MOECTF2025 Base", cat: "reverse", date: "2026-4-21", read: "4 min", path: "wps/moectf2025/reverse/base/index.html" },
  { title: "[Reverse] MOECTF2025 Catch", cat: "reverse", date: "2026-4-21", read: "4 min", path: "wps/moectf2025/reverse/catch/index.html" },
  { title: "[Pwn] 敬请期待", cat: "pwn", date: "2025-12-28", read: "5 min", path: "wps/pwn/stack.html" },
  { title: "[Misc] 敬请期待", cat: "misc", date: "2025-12-20", read: "2 min", path: "wps/misc/stego.html" },
  { title: "[Crypto] 敬请期待", cat: "crypto", date: "2025-12-18", read: "3 min", path: "wps/crypto/rsa.html" },
];

// 渲染
function render(list) {
  const container = document.getElementById("wpList");
  container.innerHTML = "";
  list.forEach(item => {
    const el = document.createElement("div");
    el.className = "article-item";
    el.innerHTML = `
      <a href="${item.path}" target="_blank">
        <h2 class="article-title">${item.title}</h2>
        <div class="article-meta">
          <span class="article-tag">${item.cat.toUpperCase()}</span>
          <span>${item.date}</span>
          <span>${item.read}</span>
        </div>
      </a>
    `;
    container.appendChild(el);
  });
}
render(WP_LIST);

// 分类
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    const filtered = cat === "all" ? WP_LIST : WP_LIST.filter(i => i.cat === cat);
    render(filtered);
  });
});

// 搜索
document.getElementById("search").addEventListener("input", e => {
  const kw = e.target.value.toLowerCase();
  const filtered = WP_LIST.filter(i => i.title.toLowerCase().includes(kw));
  render(filtered);
});

// 暗黑模式
const darkToggle = document.getElementById("dark-mode-toggle");
function setMode(mode) {
  document.documentElement.dataset.scheme = mode;
  localStorage.setItem("scheme", mode);
}
darkToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.scheme || "light";
  setMode(current === "dark" ? "light" : "dark");
});
window.addEventListener("load", () => {
  const saved = localStorage.getItem("scheme") || "light";
  setMode(saved);
});