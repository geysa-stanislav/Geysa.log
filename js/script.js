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

document.addEventListener("DOMContentLoaded", carregarMoodDoDia);
