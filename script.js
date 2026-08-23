// ============================================================
//  "İlk Randevu Daveti" — Vanilla JS ile ekran akışı ve efektler
// ============================================================

// ---------- Ekranlar arası geçiş ----------
function goToScreen(id) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (current === next) return;
  if (current) current.classList.remove('active');
  next.classList.add('active');
}

// ============================================================
//  1) ARKA PLANDAKİ SÜZÜLEN KALPLER
// ============================================================
function createFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const emojis = ['💕', '💖', '💗', '❤️', '💘', '✨', '💓'];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (1 + Math.random() * 1.3) + 'rem';

    const duration = 8 + Math.random() * 10;
    el.style.animationDuration = duration + 's';
    // Negatif gecikme: animasyonlar farklı noktalardan başlasın, hepsi aynı anda alttan çıkmasın
    el.style.animationDelay = -(Math.random() * duration) + 's';
    el.style.setProperty('--drift', (Math.random() * 140 - 70) + 'px');

    container.appendChild(el);
  }
}

// ============================================================
//  2) "HAYIR" BUTONUNUN KAÇMA DAVRANIŞI
// ============================================================
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const funnyMessage = document.getElementById('funny-message');
const questionEmoji = document.getElementById('question-emoji');

const funnyMessages = [
  'Emin misin? 🥺',
  'Bir daha düşün 😏',
  'Kalbimi kırma 💔',
  'Kaçamazsın 😈',
  'Hızlısın ama ben daha hızlıyım 🏃',
  'Yakalayamayacaksın 😂',
  'Evet\'e basmak zorundasın artık 😂',
  'Pes etsen mi acaba? 🙈',
];

let noScale = 1;
let yesScale = 1;
let escapeCount = 0;
let isEscaping = false; // Aynı anda birden fazla event (hover+touch+click) tetiklenip butonu anında yok etmesin diye kısa bir bekleme kilidi
let noOriginalParent = null; // Kaçmadan önceki DOM konumu (Baştan Başla'da geri koymak için)
let noOriginalNextSibling = null;

// Butonun rastgele ışınlanması yerine mevcut konumunun yakınında dolaşması için
// izin verilen alan: her kaçışta bu yarıçap aralığında kısa bir mesafe kat eder
const ROAM_MIN_DIST = 90;
const ROAM_MAX_DIST = 220;
const MIN_NO_SCALE = 0.55; // Küçülse de her zaman görünür ve fark edilir kalsın

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeNoButton(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (isEscaping) return; // Kilit açık değilse tetiklemeyi yoksay
  isEscaping = true;
  setTimeout(() => { isEscaping = false; }, 320);

  escapeCount++;

  // Hayır azıcık küçülsün, Evet azıcık büyüsün (sınır koyarak, asla kaybolmasın)
  noScale = Math.max(MIN_NO_SCALE, noScale - 0.05);
  yesScale = Math.min(1.9, yesScale + 0.09);
  btnNo.style.setProperty('--scale', noScale);
  btnYes.style.setProperty('--scale', yesScale);

  const rect = btnNo.getBoundingClientRect();
  const margin = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(vw - rect.width - margin, margin);
  const maxY = Math.max(vh - rect.height - margin, margin);

  // İlk kaçışta konumu flex akışından çıkarıp mevcut yerinde sabitle (ışınlanma değil, buradan başlayan bir hareket).
  // Not: .card üzerindeki backdrop-filter, position:fixed torunlar için viewport yerine kendisini
  // konumlama referansı yapar — bu yüzden butonu gerçekten viewport'a göre sabitlemek için body'ye taşıyoruz.
  if (!btnNo.classList.contains('escaping')) {
    noOriginalParent = btnNo.parentNode;
    noOriginalNextSibling = btnNo.nextSibling;
    document.body.appendChild(btnNo);
    btnNo.classList.add('escaping');
    btnNo.style.left = clamp(rect.left, margin, maxX) + 'px';
    btnNo.style.top = clamp(rect.top, margin, maxY) + 'px';
    void btnNo.offsetWidth; // reflow: geçiş animasyonunun buradan başlamasını garanti eder
  }

  // Şu anki konumdan kısa bir mesafe uzağa, rastgele bir yöne kaç (çevrede dolaşma hissi)
  const currentLeft = parseFloat(btnNo.style.left) || rect.left;
  const currentTop = parseFloat(btnNo.style.top) || rect.top;
  const angle = Math.random() * Math.PI * 2;
  const dist = ROAM_MIN_DIST + Math.random() * (ROAM_MAX_DIST - ROAM_MIN_DIST);

  const newLeft = clamp(currentLeft + Math.cos(angle) * dist, margin, maxX);
  const newTop = clamp(currentTop + Math.sin(angle) * dist, margin, maxY);

  btnNo.style.left = newLeft + 'px';
  btnNo.style.top = newTop + 'px';

  // Komik mesajı döngüyle değiştir
  funnyMessage.textContent = funnyMessages[(escapeCount - 1) % funnyMessages.length];

  // Soru emojisini de canlandır
  questionEmoji.textContent = ['💘', '😳', '🥹', '😅'][escapeCount % 4];
}

function isQuestionScreenActive() {
  return document.getElementById('screen-question').classList.contains('active');
}

// Masaüstünde imleç yaklaşınca (tam üzerine gelmeden), mobilde dokununca kaçsın
document.addEventListener('mousemove', (e) => {
  if (!isQuestionScreenActive() || isEscaping) return;
  const rect = btnNo.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  const proximityThreshold = Math.max(rect.width, rect.height) / 2 + 55;
  if (dist < proximityThreshold) escapeNoButton();
});

// Mobilde parmak yaklaşırken de aynı mantık (touchmove), artı gerçek dokunuşa karşı son güvenlik (touchstart)
document.addEventListener('touchmove', (e) => {
  if (!isQuestionScreenActive() || isEscaping) return;
  const touch = e.touches[0];
  if (!touch) return;
  const rect = btnNo.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(touch.clientX - cx, touch.clientY - cy);
  const proximityThreshold = Math.max(rect.width, rect.height) / 2 + 60;
  if (dist < proximityThreshold) escapeNoButton();
}, { passive: true });

btnNo.addEventListener('touchstart', escapeNoButton, { passive: false });
// Her ihtimale karşı: bir şekilde tıklama geçerse bile hiçbir yere yönlendirmesin, sadece tekrar kaçsın
btnNo.addEventListener('click', escapeNoButton);

// ============================================================
//  3) KONFETİ (canvas ile, harici kütüphane yok)
// ============================================================
function launchConfetti(canvasId, duration = 2600) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const colors = ['#ff6ec4', '#7873f5', '#ffd166', '#06d6a0', '#ff9a5a', '#f72585'];
  const particles = [];
  const count = 140;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.6,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3.5,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: -8 + Math.random() * 16,
    });
  }

  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

window.addEventListener('resize', () => {
  ['confetti-canvas', 'confetti-canvas-2'].forEach((id) => {
    const c = document.getElementById(id);
    if (c) {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
  });
});

// ============================================================
//  4) TARİH SEÇİMİ — önümüzdeki 14 gün
// ============================================================
const DAY_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const DAY_LONG = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const MONTH_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const MONTH_LONG = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

let selectedDateText = null;
let selectedTime = null;
let selectedTimeLabel = null;
let selectedPlace = null;

function generateDayPicker() {
  const wrap = document.getElementById('day-picker');
  wrap.innerHTML = '';

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const card = document.createElement('div');
    card.className = 'day-card';

    const dowLabel = i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : DAY_SHORT[d.getDay()];
    card.innerHTML = `
      <span class="dow">${dowLabel}</span>
      <span class="dom">${d.getDate()}</span>
      <span class="mon">${MONTH_SHORT[d.getMonth()]}</span>
    `;

    const fullText = `${DAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_LONG[d.getMonth()]}`;

    card.addEventListener('click', () => {
      document.querySelectorAll('.day-card.selected').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedDateText = fullText;
      checkPlanComplete();
    });

    wrap.appendChild(card);
  }
}

// ============================================================
//  5) SAAT VE MEKAN SEÇİMİ
// ============================================================
document.querySelectorAll('#time-picker .option-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#time-picker .option-card.selected').forEach((c) => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTime = btn.dataset.time;
    selectedTimeLabel = btn.dataset.label;
    checkPlanComplete();
  });
});

document.querySelectorAll('#place-picker .option-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#place-picker .option-card.selected').forEach((c) => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPlace = btn.dataset.place;
    checkPlanComplete();
  });
});

function checkPlanComplete() {
  const btn = document.getElementById('btn-confirm-plan');
  btn.disabled = !(selectedDateText && selectedTime);
}

// ============================================================
//  6) BİLET OLUŞTURMA VE WHATSAPP PAYLAŞIMI
// ============================================================
function buildTicket() {
  const place = selectedPlace || 'Sürpriz 🎁';
  document.getElementById('ticket-date').textContent = selectedDateText;
  document.getElementById('ticket-time').textContent = `${selectedTimeLabel} (${selectedTime})`;
  document.getElementById('ticket-place').textContent = place;
}

function buildWhatsappMessage() {
  const place = selectedPlace || 'Sürpriz 🎁';
  return (
    `🎫 RANDEVU BİLETİ\n` +
    `📆 Tarih: ${selectedDateText}\n` +
    `⏰ Saat: ${selectedTimeLabel} (${selectedTime})\n` +
    `📍 Mekan: ${place}\n\n` +
    `İptal edilemez! 😌 Görüşürüz 💘`
  );
}

// ============================================================
//  7) BUTON OLAYLARI
// ============================================================
document.getElementById('btn-start').addEventListener('click', () => {
  goToScreen('screen-question');
});

btnYes.addEventListener('click', () => {
  goToScreen('screen-yes');
  launchConfetti('confetti-canvas');
});

document.getElementById('btn-to-date').addEventListener('click', () => {
  goToScreen('screen-plan');
});

document.getElementById('btn-confirm-plan').addEventListener('click', () => {
  buildTicket();
  goToScreen('screen-ticket');
  launchConfetti('confetti-canvas-2');
});

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const text = encodeURIComponent(buildWhatsappMessage());
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
});

document.getElementById('btn-restart').addEventListener('click', () => {
  // Durumu sıfırla
  noScale = 1;
  yesScale = 1;
  escapeCount = 0;
  btnNo.style.setProperty('--scale', 1);
  btnYes.style.setProperty('--scale', 1);
  btnNo.classList.remove('escaping');
  btnNo.style.left = '';
  btnNo.style.top = '';
  funnyMessage.textContent = '';

  isEscaping = false;
  if (noOriginalParent) {
    noOriginalParent.insertBefore(btnNo, noOriginalNextSibling);
    noOriginalParent = null;
    noOriginalNextSibling = null;
  }

  document.querySelectorAll('.day-card.selected, .option-card.selected').forEach((c) => c.classList.remove('selected'));
  selectedDateText = null;
  selectedTime = null;
  selectedTimeLabel = null;
  selectedPlace = null;
  checkPlanComplete();

  goToScreen('screen-welcome');
});

// ============================================================
//  BAŞLANGIÇ
// ============================================================
createFloatingHearts();
generateDayPicker();
