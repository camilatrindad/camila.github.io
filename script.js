const audioFundo = document.getElementById("musicaFundo");
const bestTimeDisplay = document.getElementById("best-time");
let audioIniciado = false;


function carregarRecorde() {
    const recorde = localStorage.getItem("melhorTempo");
    if (recorde) {
        bestTimeDisplay.innerText = formatarTempo(parseInt(recorde));
    }
}

function tocarMusica() {
    if (!audioIniciado && audioFundo) {
        audioFundo.volume = 0.3; 
        audioFundo.play().then(() => {
            audioIniciado = true;
        }).catch(error => console.log("Aguardando interação."));
    }
}

document.addEventListener("click", tocarMusica, { once: true });

const imgs = ["img/img-1.png", "img/img-2.png", "img/img-3.png", "img/img-4.png", "img/img-5.png", "img/img-6.png"];
const board = document.getElementById("board");
const timerDisplay = document.getElementById("timer");
const triesDisplay = document.getElementById("tries");

let deck = [], first = null, second = null, lock = false;
let tentativas = 0, segundos = 0, cronometro, paresEncontrados = 0;

function formatarTempo(s) {
  const min = Math.floor(s / 60);
  const seg = s % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function iniciarCronometro() {
  clearInterval(cronometro);
  segundos = 0;
  cronometro = setInterval(() => {
    segundos++;
    timerDisplay.innerText = formatarTempo(segundos);
  }, 1000);
}

function render(){
  board.innerHTML = "";
  deck.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<div class="card-inner"><div class="face back">✨</div><div class="face front"><img src="${src}"></div></div>`;
    card.onclick = () => { if(!lock) flip(card); };
    board.appendChild(card);
  });
}

function flip(card){
  if(lock || card.classList.contains("flip")) return;
  card.classList.add("flip");
  
  if(!first){ first = card; return; }
  
  second = card;
  lock = true;
  tentativas++;
  triesDisplay.innerText = tentativas;

  if(first.querySelector("img").src === second.querySelector("img").src){
    paresEncontrados++;
    first = second = null;
    lock = false;
    
    if(paresEncontrados === imgs.length) {
      clearInterval(cronometro);
      verificarRecorde(segundos);
      setTimeout(() => alert(`Vitória!\nTempo: ${formatarTempo(segundos)}\nTentativas: ${tentativas}`), 500);
    }
  } else {
    setTimeout(() => {
      first.classList.remove("flip");
      second.classList.remove("flip");
      first = second = null;
      lock = false;
    }, 1000); 
  }
}

function verificarRecorde(tempoAtual) {
    const recordeSalvo = localStorage.getItem("melhorTempo");
    if (!recordeSalvo || tempoAtual < parseInt(recordeSalvo)) {
        localStorage.setItem("melhorTempo", tempoAtual);
        bestTimeDisplay.innerText = formatarTempo(tempoAtual);
        alert("🎉 Novo Recorde!");
    }
}

function startGame(){
  tocarMusica(); 
  carregarRecorde();
  clearInterval(cronometro);
  tentativas = 0; paresEncontrados = 0; segundos = 0;
  triesDisplay.innerText = "0"; timerDisplay.innerText = "00:00";
  lock = true;
  
  deck = [...imgs, ...imgs].sort(() => Math.random() - 0.5);
  render();

  const cards = document.querySelectorAll(".card");
  cards.forEach(c => c.classList.add("flip"));
  
  setTimeout(() => {
    cards.forEach(c => c.classList.remove("flip"));
    lock = false;
    iniciarCronometro();
  }, 2000);
}

document.getElementById("restart").onclick = startGame;
window.onload = startGame;

const btnMute = document.getElementById("toggleMute");
btnMute.onclick = () => {
    if (audioFundo.muted) {
        audioFundo.muted = false;
        btnMute.innerText = "🔊";
    } else {
        audioFundo.muted = true;
        btnMute.innerText = "🔇";
    }
};
