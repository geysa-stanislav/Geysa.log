const botao = document.getElementById("botaoEnviar");
if (botao) {
  botao.addEventListener("click", validarFormulario);
}

function validarFormulario(e){
  // opcional: evita recarregar a página ao enviar
  e?.preventDefault();

  const nome = document.getElementById("nome")?.value ?? "";
  const email = document.getElementById("email")?.value ?? "";


  if (nome !== "" && email !== ""){
    alert ("Prontinho! Você receberá as novidades por email.");
  } else {
    alert("Por favor, preencha nome e email!");
  }
}
async function carregarMoodDoDia() {
  const container = document.getElementById("mood-container");
  if (!container) return;

  // Estado inicial: vazio (sem mensagem feia)
  container.innerHTML = "";

  try {
    // Caminho robusto para Live Server e GitHub Pages
    const url = new URL("etc.html", window.location.href);

    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const mood = doc.querySelector("#mood-do-dia");
    if (!mood) {
      // Sem mood no etc.html → não mostra nada (ou coloque um placeholder pequeno se quiser)
      return;
    }

    // Clona e aplica a classe para virar “telinha” compacta
    const moodClone = mood.cloneNode(true);
    moodClone.classList.add("mood-mini");

    container.appendChild(moodClone);
  } catch (err) {
    // Se falhar, NÃO exibe erro na tela (só loga no console)
    console.warn("Mood do dia não carregou:", err);
  }
}

function marcarMenuAtivo() {
  const nav = document.querySelector("nav.principal");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  if (!links.length) return;

  // Ex: "", "index.html", "musica.html", etc.html...
  let atual = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Se a pessoa acessou com / (sem arquivo) ou /index.html, consideramos Home
  if (atual === "" || atual === "index.html") atual = "home";

  links.forEach((a) => {
    a.removeAttribute("aria-current");

    let href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();

    // Normaliza Home: "./" ou "/" ou "" ou "index.html"
    const ehHome =
      href === "./" || href === "/" || href === "" || href.endsWith("/") || href.endsWith("index.html");

    const alvo = ehHome ? "home" : href;

    if (alvo === atual) {
      a.setAttribute("aria-current", "page");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  marcarMenuAtivo();

  // mantém o que você já tinha:
  carregarMoodDoDia?.();
  carregarRecentPosts?.();
});


async function carregarRecentPosts() {
  const list = document.getElementById("recent-posts");
  if (!list) return; // só roda onde existir

  try {
    const resp = await fetch("etc.html");
    if (!resp.ok) throw new Error("Não consegui carregar etc.html");

    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const entries = [...doc.querySelectorAll(".diario-entry")];
    if (!entries.length) {
      list.innerHTML = "<li>Sem posts ainda.</li>";
      return;
    }

    const items = entries.slice(0, 8).map((entry) => {
      const id = entry.id || "";
      const titulo = entry.querySelector("h3")?.textContent?.trim() || "Post";
      const data = entry.querySelector("time")?.textContent?.trim() || "";

      return `
        <li>
          <a href="etc.html#${id}">${titulo}</a>
          <span class="mini-date">${data}</span>
        </li>
      `;
    });

    list.innerHTML = items.join("");
  } catch (err) {
    list.innerHTML = "<li>Não consegui carregar os posts.</li>";
    console.error(err);
  }
}

