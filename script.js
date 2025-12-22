



const imgs = ["img/img-1.png", "img/img-2.png", "img/img-3.png", "img/img-4.png", "img/img-5.png", "img/img-6.png"];
const board = document.getElementById("board");
const timerDisplay = document.getElementById("timer");
const triesDisplay = document.getElementById("tries");
const audioFundo = document.getElementById("audioFundo");

let deck = [], first = null, second = null, lock = false, audioIniciado = false;
let tentativas = 0, segundos = 0, cronometro, paresEncontrados = 0;

function iniciarAudio() {
  if (!audioIniciado) {
    audioFundo.volume = 0.2; 
    audioFundo.play().catch(() => {});
    audioIniciado = true;
  }
}

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

function startGame(){
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

