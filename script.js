let zIndexCounter = 10;

// Estado inicial das janelas
const windowStates = {
    "win-about": "open",
    "win-projects": "minimized",
    "win-skills": "minimized",
    "win-contact": "minimized",
    "win-cmd": "minimized"
};


// ===============================
// GERENCIAMENTO DE JANELAS
// ===============================

function bringToFront(winId) {
    const win = document.getElementById(winId);

    if (!win) return;

    // Remove o foco das outras janelas
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });

    // Ativa a janela escolhida
    win.classList.add('active');

    // Coloca na frente
    win.style.zIndex = ++zIndexCounter;

    // Mostra a janela
    win.style.display = 'flex';

    // Atualiza o estado
    windowStates[winId] = "open";

    updateTaskbar();
}


function openWindow(winId) {
    bringToFront(winId);
}


function closeWindow(winId) {
    const win = document.getElementById(winId);

    if (!win) return;

    win.style.display = 'none';
    win.classList.remove('active');

    windowStates[winId] = "closed";

    updateTaskbar();
}


function minimizeWindow(winId) {
    const win = document.getElementById(winId);

    if (!win) return;

    win.style.display = 'none';
    win.classList.remove('active');

    windowStates[winId] = "minimized";

    updateTaskbar();
}


// ===============================
// MAXIMIZAR JANELA
// ===============================

function maximizeWindow(winId) {
    const win = document.getElementById(winId);

    if (!win) return;

    if (win.style.width === '100vw') {

        win.style.width = '';
        win.style.height = '';
        win.style.top = '50px';
        win.style.left = '50px';

    } else {

        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 30px)';
        win.style.top = '0';
        win.style.left = '0';

    }
}


// ===============================
// ARRASTAR JANELAS
// ===============================

function dragWindow(e, winId) {

    const win = document.getElementById(winId);

    bringToFront(winId);

    let shiftX = e.clientX - win.getBoundingClientRect().left;
    let shiftY = e.clientY - win.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        win.style.left = pageX - shiftX + 'px';
        win.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e) {
        moveAt(e.clientX, e.clientY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {

        document.removeEventListener('mousemove', onMouseMove);

        document.onmouseup = null;
    };
}


// ===============================
// ABAS
// ===============================

function switchTab(e, tabId) {

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    e.target.classList.add('active');

    document.getElementById(tabId).classList.add('active');
}


// ===============================
// MENU INICIAR
// ===============================

function toggleStartMenu() {

    const menu = document.getElementById('start-menu');

    menu.classList.toggle('show');
}


// Fecha o menu quando clicar fora
document.addEventListener('click', function(e) {

    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');

    if (!menu.contains(e.target) && !startBtn.contains(e.target)) {

        menu.classList.remove('show');

    }
});


// ===============================
// BARRA DE TAREFAS
// ===============================

function updateTaskbar() {

    const container = document.getElementById('task-items');

    container.innerHTML = '';

    document.querySelectorAll('.window').forEach(win => {

        const state = windowStates[win.id];

        // Janela fechada não aparece na barra
        if (state === "closed") {
            return;
        }

        const title = win.querySelector('.title-bar-text').textContent;

        const isActive = win.classList.contains('active');

        const taskBtn = document.createElement('div');

        taskBtn.className =
            `task-item outset ${isActive ? 'active' : ''}`;

        taskBtn.innerHTML = title;

        taskBtn.onclick = () => {

            // Se estiver aberta e já for a janela ativa,
            // minimiza
            if (windowStates[win.id] === "open" && isActive) {

                minimizeWindow(win.id);

            } else {

                bringToFront(win.id);

            }

        };

        container.appendChild(taskBtn);
    });
}


// ===============================
// RELÓGIO
// ===============================

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');

    const minutes = String(now.getMinutes()).padStart(2, '0');

    document.getElementById('clock').textContent =
        `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);

updateClock();


// ===============================
// INICIALIZAÇÃO
// ===============================

document.querySelectorAll('.window').forEach(win => {

    // Esconde todas inicialmente
    win.style.display = 'none';

    // Clicar na janela coloca ela na frente
    win.addEventListener('mousedown', () => {
        bringToFront(win.id);
    });
});


// Abre somente o Sobre Mim
const initialWindow = document.getElementById('win-about');

initialWindow.style.display = 'flex';
initialWindow.classList.add('active');
initialWindow.style.zIndex = ++zIndexCounter;


// Cria os botões da barra de tarefas
updateTaskbar();

const somClique = new Audio("mouseclick.mp3");
const somInicializacao = new Audio("startup_effect.wav");

const telaInicializacao = document.getElementById("tela-inicializacao");
const botaoIniciar = document.getElementById("botao-iniciar");


// BOTÃO DE ENTRAR
botaoIniciar.addEventListener("click", function(event) {

    // Impede que esse clique também seja considerado
    // pelo evento geral de clique
    event.stopPropagation();

    // Toca o som de inicialização
    somInicializacao.currentTime = 0;
    somInicializacao.play();

    // Esconde a tela de login
    telaInicializacao.style.display = "none";

});


// CLIQUES NORMAIS DO SITE
document.addEventListener("click", function() {

    somClique.currentTime = 0;
    somClique.play();

});