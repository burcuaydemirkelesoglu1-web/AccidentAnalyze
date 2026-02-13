let activeNode = null;
let depth = 0;

function handleInput() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    if (!val) return;

    addChat(val, 'user');
    
    if (depth === 0) {
        createNode(val, document.getElementById('tree-root'), "INCIDENT", "#64748b");
    } else {
        const decision = analyzeCategory(val, depth);
        createNode(val, activeNode.querySelector('ul'), decision.cat, decision.color);
    }

    depth++;
    input.value = "";
    setTimeout(() => askBot(`Peki, neden <b>"${val}"</b>?`), 600);
}

function analyzeCategory(text, currentDepth) {
    const t = text.toLowerCase();
    const isUnderlying = /eğitim|bakım|prosedür|denetim|plan|yetkinlik|amir|iletişim|tasarım/.test(t);
    const isRoot = /politika|kültür|bütçe|üst yönetim|yatırım|vizyon|taahhüt|organizasyon|liderlik/.test(t);

    // Hiyerarşik Kilit: 4. derinlikten önce ROOT olamaz
    if (currentDepth >= 4 && isRoot) return { cat: "ROOT", color: "#10b981" };
    if (currentDepth >= 1 && isUnderlying) return { cat: "UNDERLYING", color: "#8b5cf6" };
    return { cat: "IMMEDIATE", color: "#f59e0b" };
}

function createNode(text, parent, cat, color) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="box" onclick="selectNode(this.parentElement)">
            <span class="tag" style="background:${color}">${cat}</span><br>
            <span class="node-text">${text}</span>
        </div>
        <ul></ul>
    `;
    parent.appendChild(li);
    selectNode(li);
}

function selectNode(li) {
    document.querySelectorAll('.box').forEach(b => b.classList.remove('active'));
    activeNode = li;
    activeNode.querySelector('.box').classList.add('active');
}

function addBranch() {
    if (!activeNode || depth === 0) return;
    // Seçili düğümün üstüne git ve yeni bir çocuk dal aç
    const parentNode = activeNode.parentElement.parentElement;
    if (parentNode.tagName === "LI") selectNode(parentNode);
    askBot("Tamam, bu nokta için alternatif bir neden giriniz.");
}

function addChat(t, s) {
    const chat = document.getElementById('chat-log');
    chat.innerHTML += `<div class="msg ${s}">${t}</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function askBot(t) {
    addChat(t, 'bot');
}
