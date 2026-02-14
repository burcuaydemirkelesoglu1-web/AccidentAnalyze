// Analiz Durum Takibi
let stepCount = 0;
const analysisData = [];

// DOM Elemanları
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const mapContainer = document.getElementById('map-container');

// Başlangıç Mesajı
window.onload = () => {
    addMessage("Merhaba Müfettiş. Lütfen analiz etmek istediğiniz kaza veya olayı kısaca tarif edin.", 'bot');
};

// Mesaj Gönderme Fonksiyonu
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    
    // Analiz Mantığı
    processAnalysis(text);
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.innerText = text;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function processAnalysis(text) {
    stepCount++;
    let category = "";
    let nextQuestion = "";

    // HSG65 Mantığına Göre Kategorizasyon
    if (stepCount === 1) {
        category = "OLAY";
        nextQuestion = "Bu olayın gerçekleşmesine neden olan 'Doğrudan Neden' (Güvensiz durum veya davranış) nedir?";
    } else if (stepCount <= 3) {
        category = "DOĞRUDAN NEDEN";
        nextQuestion = "Peki, bu durumun/davranışın altında yatan 'Dolaylı Neden' (Eğitim eksikliği, denetim azlığı vb.) ne olabilir?";
    } else if (stepCount === 4) {
        category = "DOLAYLI NEDEN";
        nextQuestion = "Son olarak, bu dolaylı nedenin 'Kök Nedeni' (Yönetim sistemi hatası, politika eksikliği) nedir?";
    } else {
        category = "KÖK NEDEN";
        nextQuestion = "Analiz tamamlandı. Kök neden tespit edildi. Başka bir ekleme yapmak ister misiniz?";
    }

    // Haritaya Ekle
    addToMap(text, category);
    
    // Asistanın Cevabı (Gecikmeli)
    setTimeout(() => {
        addMessage(nextQuestion, 'bot');
    }, 600);
}

function addToMap(text, category) {
    const node = document.createElement('div');
    node.className = 'map-node fade-in';
    
    // Kategoriye göre renk sınıfı ekle
    const categoryClass = category.replace(/\s/g, '-').toLowerCase();
    
    node.innerHTML = `
        <div class="node-category ${categoryClass}">${category}</div>
        <div class="node-text">${text}</div>
    `;
    
    mapContainer.appendChild(node);
    
    // Otomatik Çizgi Çizimi (Görsel bağlantı)
    if (mapContainer.children.length > 1) {
        const line = document.createElement('div');
        line.className = 'map-line';
        mapContainer.insertBefore(line, node);
    }
}

// Enter Tuşu Dinleyici
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
sendBtn.addEventListener('click', sendMessage);
