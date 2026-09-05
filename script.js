// ============================================================
//  "İlk Randevu Daveti" / "First Date Invitation" — Vanilla JS
//  Ekran akışı, efektler, çok dilli (TR/EN/FR/DE) destek,
//  davet şablonları, renk temaları, karanlık mod ve ses efektleri
// ============================================================

const SUPPORTED_LANGS = ['tr', 'en', 'fr', 'de'];
const THEME_COLORS = ['pink', 'sunset', 'ocean', 'lavender', 'mint'];
const TEMPLATE_KEYS = ['date', 'anniversary', 'valentine', 'proposal'];

// JS tarafında sadece önizleme (renk seçici) için — asıl renkler style.css'teki
// :root[data-theme-color="..."] bloklarında tanımlı, ikisini birlikte güncel tutun.
const THEME_SWATCH_COLORS = {
  pink: ['#ff6ec4', '#7873f5'],
  sunset: ['#ff9a5a', '#ff5e7e'],
  ocean: ['#22c1c3', '#5b86e5'],
  lavender: ['#a18cd1', '#fbc2eb'],
  mint: ['#2bc48a', '#38c9c9'],
};

// ============================================================
//  0) ÇEVİRİLER (i18n) + DAVET ŞABLONLARI
// ============================================================
const I18N = {
  tr: {
    setupTitle: 'Önce Sen 💌',
    setupSubtitle: 'Karşı taraf cevaplayınca sana haber verelim',
    templateLabel: 'Ne için bir davetiye? 💌',
    themeLabel: 'Renk teman 🎨',
    nameLabel: 'Adın',
    namePlaceholder: 'Örn: Ahmet',
    phoneLabel: 'WhatsApp Numaran',
    phonePlaceholder: 'Örn: 905551234567',
    phoneHint: 'Başında ülke kodu olsun (90...), boşluk/artı fark etmez',
    recipientLabel: 'Kime gönderiyorsun? (opsiyonel)',
    recipientPlaceholder: 'Örn: Zeynep',
    generateBtn: 'Linki Oluştur 🔗',
    linkReadyLabel: 'Linkin hazır 🎉',
    copyBtn: 'Linki Kopyala 📋',
    copiedBtn: 'Kopyalandı ✅',
    shareBtn: "WhatsApp'tan Gönder 📤",
    qrLabel: 'Ya da QR kodu okutsun 📱',
    errorMsg: 'Adını ve ülke koduyla geçerli bir WhatsApp numarası gir 🙏',
    darkModeToggleLabel: 'Karanlık/Aydınlık mod',
    soundToggleLabel: 'Sesi aç/kapat',

    senderNote: (name) => `${name} sana bir soru soracak 💌`,
    welcomeSubtitle: 'Cevaplamadan önce derin bir nefes al 😌',
    startBtn: 'Hazırım 💪',
    yesBtn: 'Evet 🥰',
    noBtn: 'Hayır 😤',
    funnyMessages: [
      'Emin misin? 🥺',
      'Bir daha düşün 😏',
      'Kalbimi kırma 💔',
      'Kaçamazsın 😈',
      'Hızlısın ama ben daha hızlıyım 🏃',
      'Yakalayamayacaksın 😂',
      "Evet'e basmak zorundasın artık 😂",
      'Pes etsen mi acaba? 🙈',
    ],

    toDateBtn: 'Randevuyu Ayarlayalım 📅',

    planTitle: 'Hadi Planlayalım 🗓️',
    dayLabel: 'Hangi gün? 📆',
    timeLabel: 'Saat kaçta? ⏰',
    placeLabel: 'Nereye gidelim? 📍',
    confirmBtn: 'Randevuyu Onayla 🎫',
    today: 'Bugün',
    tomorrow: 'Yarın',
    dayShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    dayLong: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    monthShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    monthLong: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],

    timeOptions: [
      { key: 'coffee', time: '14:00', emoji: '☕', name: 'Kahve saati' },
      { key: 'sunset', time: '18:00', emoji: '🌅', name: 'Gün batımı' },
      { key: 'dinner', time: '20:00', emoji: '🍝', name: 'Akşam yemeği' },
    ],
    placeOptions: [
      { key: 'coffee', emoji: '☕', name: 'Kahve' },
      { key: 'food', emoji: '🍕', name: 'Yemek' },
      { key: 'movie', emoji: '🎬', name: 'Sinema' },
      { key: 'walk', emoji: '🚶', name: 'Yürüyüş' },
    ],
    surprisePlace: 'Sürpriz 🎁',

    templateOptions: [
      { key: 'date', emoji: '💘', name: 'İlk Randevu' },
      { key: 'anniversary', emoji: '🎉', name: 'Yıldönümü' },
      { key: 'valentine', emoji: '💝', name: 'Sevgililer Günü' },
      { key: 'proposal', emoji: '💍', name: 'Evlilik Teklifi' },
    ],
    themeOptions: [
      { key: 'pink', name: 'Pembe' },
      { key: 'sunset', name: 'Gün Batımı' },
      { key: 'ocean', name: 'Okyanus' },
      { key: 'lavender', name: 'Lavanta' },
      { key: 'mint', name: 'Nane' },
    ],

    ticketDateLabel: '📆 Tarih',
    ticketTimeLabel: '⏰ Saat',
    ticketPlaceLabel: '📍 Mekan',
    whatsappNotifyBtn: "WhatsApp'tan Bildir 📲",
    whatsappNotifySenderBtn: 'Gönderene Haber Ver 📲',
    downloadTicketBtn: 'Bileti İndir 📸',
    restartBtn: 'Baştan Başla 🔄',
    countdownDays: 'Gün',
    countdownHours: 'Saat',
    countdownMinutes: 'Dakika',
    countdownSeconds: 'Saniye',
    countdownPast: 'Vakit geldi! 🎉',

    waDateLabel: '📆 Tarih',
    waTimeLabel: '⏰ Saat',
    waPlaceLabel: '📍 Mekan',
    waFooter: 'İptal edilemez! 😌 Görüşürüz 💘',
    waIntroWithSender: (who) => `🎉 ${who}sana "Evet" dedi ve buluşma planını onayladı!`,
    waShareIntro: (link) => `Sana bir sorum var 👀 ${link}`,

    templates: {
      date: {
        pageTitle: 'Sana Bir Sorum Var 💌',
        welcomeTitle: 'Sana çok önemli<br />bir sorum var...',
        questionTitleDefault: 'Benimle çıkar mısın?',
        questionTitleFor: (name) => `${name}, benimle çıkar mısın?`,
        yesTitle: 'BİLİYORDUM! 🎊',
        yesSubtitle: 'Kalbim küt küt atıyor şu an 💓',
        ticketTitle: 'Randevumuz Ayarlandı! 🥳',
        ticketHeader: '🎫 RANDEVU BİLETİ',
        ticketFooter: 'İptal edilemez! 😌 Katılım zorunludur 💘',
        questionEmojiInitial: '💘',
      },
      anniversary: {
        pageTitle: 'Yıldönümümüzü Kutlayalım mı? 🎉',
        welcomeTitle: 'Sana özel<br />bir teklifim var...',
        questionTitleDefault: 'Yıldönümümüzü kutlar mısın?',
        questionTitleFor: (name) => `${name}, yıldönümümüzü kutlar mısın?`,
        yesTitle: 'HARİKA! 🎉',
        yesSubtitle: 'Bu yıldönümü unutulmaz olacak 🥳',
        ticketTitle: 'Kutlamamız Ayarlandı! 🥳',
        ticketHeader: '🎫 YILDÖNÜMÜ BİLETİ',
        ticketFooter: 'İptal edilemez! 😌 Katılım zorunludur 🎉',
        questionEmojiInitial: '🎉',
      },
      valentine: {
        pageTitle: 'Sevgililer Günüm Olur musun? 💝',
        welcomeTitle: 'Sana özel<br />bir sorum var...',
        questionTitleDefault: 'Sevgililer günüm olur musun?',
        questionTitleFor: (name) => `${name}, sevgililer günüm olur musun?`,
        yesTitle: 'MUTLU OLDUM! 💝',
        yesSubtitle: 'Kalbim seninle çarpıyor 💓',
        ticketTitle: 'Buluşmamız Ayarlandı! 🥳',
        ticketHeader: '🎫 SEVGİLİLER GÜNÜ BİLETİ',
        ticketFooter: 'İptal edilemez! 😌 Katılım zorunludur 💝',
        questionEmojiInitial: '💝',
      },
      proposal: {
        pageTitle: 'Sana Çok Önemli Bir Sorum Var 💍',
        welcomeTitle: 'Hayatımın<br />en önemli sorusu...',
        questionTitleDefault: 'Benimle evlenir misin?',
        questionTitleFor: (name) => `${name}, benimle evlenir misin?`,
        yesTitle: 'EVET DEDİ! 💍',
        yesSubtitle: 'Bu hayatımın en mutlu anı 🥹',
        ticketTitle: 'Nişan Planımız Hazır! 🥳',
        ticketHeader: '🎫 EVLİLİK TEKLİFİ BİLETİ',
        ticketFooter: 'İptal edilemez! 😌 Katılım zorunludur 💍',
        questionEmojiInitial: '💍',
      },
    },
  },

  en: {
    setupTitle: 'First, You 💌',
    setupSubtitle: "We'll let you know as soon as they answer",
    templateLabel: 'What kind of invite? 💌',
    themeLabel: 'Your color theme 🎨',
    nameLabel: 'Your Name',
    namePlaceholder: 'e.g. John',
    phoneLabel: 'Your WhatsApp Number',
    phonePlaceholder: 'e.g. 15551234567',
    phoneHint: "Include the country code (1...), spaces or plus signs don't matter",
    recipientLabel: 'Who are you sending this to? (optional)',
    recipientPlaceholder: 'e.g. Jane',
    generateBtn: 'Create Link 🔗',
    linkReadyLabel: 'Your link is ready 🎉',
    copyBtn: 'Copy Link 📋',
    copiedBtn: 'Copied ✅',
    shareBtn: 'Send via WhatsApp 📤',
    qrLabel: 'Or scan the QR code 📱',
    errorMsg: 'Enter your name and a valid WhatsApp number with country code 🙏',
    darkModeToggleLabel: 'Dark/Light mode',
    soundToggleLabel: 'Toggle sound',

    senderNote: (name) => `${name} has a question for you 💌`,
    welcomeSubtitle: 'Take a deep breath before answering 😌',
    startBtn: "I'm Ready 💪",
    yesBtn: 'Yes 🥰',
    noBtn: 'No 😤',
    funnyMessages: [
      'Are you sure? 🥺',
      'Think again 😏',
      "Don't break my heart 💔",
      "You can't escape 😈",
      "You're fast, but I'm faster 🏃",
      "You'll never catch it 😂",
      'You have to click Yes now 😂',
      'Maybe you should just give up? 🙈',
    ],

    toDateBtn: "Let's Plan the Date 📅",

    planTitle: "Let's Plan It 🗓️",
    dayLabel: 'Which day? 📆',
    timeLabel: 'What time? ⏰',
    placeLabel: 'Where to? 📍',
    confirmBtn: 'Confirm the Date 🎫',
    today: 'Today',
    tomorrow: 'Tomorrow',
    dayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayLong: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    timeOptions: [
      { key: 'coffee', time: '14:00', emoji: '☕', name: 'Coffee time' },
      { key: 'sunset', time: '18:00', emoji: '🌅', name: 'Sunset' },
      { key: 'dinner', time: '20:00', emoji: '🍝', name: 'Dinner' },
    ],
    placeOptions: [
      { key: 'coffee', emoji: '☕', name: 'Coffee' },
      { key: 'food', emoji: '🍕', name: 'Food' },
      { key: 'movie', emoji: '🎬', name: 'Movies' },
      { key: 'walk', emoji: '🚶', name: 'Walk' },
    ],
    surprisePlace: 'Surprise 🎁',

    templateOptions: [
      { key: 'date', emoji: '💘', name: 'First Date' },
      { key: 'anniversary', emoji: '🎉', name: 'Anniversary' },
      { key: 'valentine', emoji: '💝', name: "Valentine's Day" },
      { key: 'proposal', emoji: '💍', name: 'Marriage Proposal' },
    ],
    themeOptions: [
      { key: 'pink', name: 'Pink' },
      { key: 'sunset', name: 'Sunset' },
      { key: 'ocean', name: 'Ocean' },
      { key: 'lavender', name: 'Lavender' },
      { key: 'mint', name: 'Mint' },
    ],

    ticketDateLabel: '📆 Date',
    ticketTimeLabel: '⏰ Time',
    ticketPlaceLabel: '📍 Place',
    whatsappNotifyBtn: 'Notify via WhatsApp 📲',
    whatsappNotifySenderBtn: 'Notify Sender 📲',
    downloadTicketBtn: 'Download Ticket 📸',
    restartBtn: 'Start Over 🔄',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Seconds',
    countdownPast: "It's time! 🎉",

    waDateLabel: '📆 Date',
    waTimeLabel: '⏰ Time',
    waPlaceLabel: '📍 Place',
    waFooter: 'No cancellations! 😌 See you there 💘',
    waIntroWithSender: (who) => `🎉 ${who}said "Yes" and confirmed the plan!`,
    waShareIntro: (link) => `I have a question for you 👀 ${link}`,

    templates: {
      date: {
        pageTitle: 'I Have a Question For You 💌',
        welcomeTitle: 'I have a very<br />important question for you...',
        questionTitleDefault: 'Will you go on a date with me?',
        questionTitleFor: (name) => `${name}, will you go on a date with me?`,
        yesTitle: 'I KNEW IT! 🎊',
        yesSubtitle: 'My heart is racing right now 💓',
        ticketTitle: 'Our Date is Set! 🥳',
        ticketHeader: '🎫 DATE TICKET',
        ticketFooter: 'No cancellations! 😌 Attendance is mandatory 💘',
        questionEmojiInitial: '💘',
      },
      anniversary: {
        pageTitle: 'Will You Celebrate With Me? 🎉',
        welcomeTitle: 'I have a special<br />question for you...',
        questionTitleDefault: 'Will you celebrate our anniversary with me?',
        questionTitleFor: (name) => `${name}, will you celebrate our anniversary with me?`,
        yesTitle: 'AMAZING! 🎉',
        yesSubtitle: 'This anniversary will be unforgettable 🥳',
        ticketTitle: 'Our Celebration is Set! 🥳',
        ticketHeader: '🎫 ANNIVERSARY TICKET',
        ticketFooter: 'No cancellations! 😌 Attendance is mandatory 🎉',
        questionEmojiInitial: '🎉',
      },
      valentine: {
        pageTitle: 'Will You Be My Valentine? 💝',
        welcomeTitle: 'I have a special<br />question for you...',
        questionTitleDefault: 'Will you be my Valentine?',
        questionTitleFor: (name) => `${name}, will you be my Valentine?`,
        yesTitle: "I'M SO HAPPY! 💝",
        yesSubtitle: 'My heart beats for you 💓',
        ticketTitle: 'Our Date is Set! 🥳',
        ticketHeader: '🎫 VALENTINE TICKET',
        ticketFooter: 'No cancellations! 😌 Attendance is mandatory 💝',
        questionEmojiInitial: '💝',
      },
      proposal: {
        pageTitle: 'I Have a Very Important Question 💍',
        welcomeTitle: 'The most important<br />question of my life...',
        questionTitleDefault: 'Will you marry me?',
        questionTitleFor: (name) => `${name}, will you marry me?`,
        yesTitle: 'SHE SAID YES! 💍',
        yesSubtitle: 'The happiest moment of my life 🥹',
        ticketTitle: 'Our Plan is Set! 🥳',
        ticketHeader: '🎫 PROPOSAL TICKET',
        ticketFooter: 'No cancellations! 😌 Attendance is mandatory 💍',
        questionEmojiInitial: '💍',
      },
    },
  },

  fr: {
    setupTitle: "D'abord, toi 💌",
    setupSubtitle: 'On te prévient dès que la personne répond',
    templateLabel: "Quel type d'invitation ? 💌",
    themeLabel: 'Ta palette de couleurs 🎨',
    nameLabel: 'Ton prénom',
    namePlaceholder: 'Ex : Antoine',
    phoneLabel: 'Ton numéro WhatsApp',
    phonePlaceholder: 'Ex : 33612345678',
    phoneHint: "Indique l'indicatif du pays (33...), espaces et signe + sans importance",
    recipientLabel: 'À qui envoies-tu ceci ? (facultatif)',
    recipientPlaceholder: 'Ex : Camille',
    generateBtn: 'Créer le lien 🔗',
    linkReadyLabel: 'Ton lien est prêt 🎉',
    copyBtn: 'Copier le lien 📋',
    copiedBtn: 'Copié ✅',
    shareBtn: 'Envoyer via WhatsApp 📤',
    qrLabel: 'Ou scanne le QR code 📱',
    errorMsg: "Entre ton prénom et un numéro WhatsApp valide avec l'indicatif du pays 🙏",
    darkModeToggleLabel: 'Mode sombre/clair',
    soundToggleLabel: 'Activer/couper le son',

    senderNote: (name) => `${name} a une question pour toi 💌`,
    welcomeSubtitle: 'Respire un grand coup avant de répondre 😌',
    startBtn: 'Je suis prêt(e) 💪',
    yesBtn: 'Oui 🥰',
    noBtn: 'Non 😤',
    funnyMessages: [
      "T'es sûr(e) ? 🥺",
      'Réfléchis encore 😏',
      'Ne brise pas mon cœur 💔',
      "Tu ne peux pas t'échapper 😈",
      "T'es rapide, mais je le suis plus 🏃",
      "Tu ne l'attraperas jamais 😂",
      'Tu dois cliquer sur Oui maintenant 😂',
      'Et si tu abandonnais ? 🙈',
    ],

    toDateBtn: 'Planifions le rendez-vous 📅',

    planTitle: 'On planifie ça 🗓️',
    dayLabel: 'Quel jour ? 📆',
    timeLabel: 'À quelle heure ? ⏰',
    placeLabel: 'On va où ? 📍',
    confirmBtn: 'Confirmer le rendez-vous 🎫',
    today: "Aujourd'hui",
    tomorrow: 'Demain',
    dayShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dayLong: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    monthShort: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    monthLong: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],

    timeOptions: [
      { key: 'coffee', time: '14:00', emoji: '☕', name: 'Heure du café' },
      { key: 'sunset', time: '18:00', emoji: '🌅', name: 'Coucher de soleil' },
      { key: 'dinner', time: '20:00', emoji: '🍝', name: 'Dîner' },
    ],
    placeOptions: [
      { key: 'coffee', emoji: '☕', name: 'Café' },
      { key: 'food', emoji: '🍕', name: 'Repas' },
      { key: 'movie', emoji: '🎬', name: 'Cinéma' },
      { key: 'walk', emoji: '🚶', name: 'Balade' },
    ],
    surprisePlace: 'Surprise 🎁',

    templateOptions: [
      { key: 'date', emoji: '💘', name: 'Premier rendez-vous' },
      { key: 'anniversary', emoji: '🎉', name: 'Anniversaire' },
      { key: 'valentine', emoji: '💝', name: 'Saint-Valentin' },
      { key: 'proposal', emoji: '💍', name: 'Demande en mariage' },
    ],
    themeOptions: [
      { key: 'pink', name: 'Rose' },
      { key: 'sunset', name: 'Coucher de soleil' },
      { key: 'ocean', name: 'Océan' },
      { key: 'lavender', name: 'Lavande' },
      { key: 'mint', name: 'Menthe' },
    ],

    ticketDateLabel: '📆 Date',
    ticketTimeLabel: '⏰ Heure',
    ticketPlaceLabel: '📍 Lieu',
    whatsappNotifyBtn: 'Notifier via WhatsApp 📲',
    whatsappNotifySenderBtn: "Prévenir l'expéditeur 📲",
    downloadTicketBtn: 'Télécharger le billet 📸',
    restartBtn: 'Recommencer 🔄',
    countdownDays: 'Jours',
    countdownHours: 'Heures',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Secondes',
    countdownPast: "C'est l'heure ! 🎉",

    waDateLabel: '📆 Date',
    waTimeLabel: '⏰ Heure',
    waPlaceLabel: '📍 Lieu',
    waFooter: 'Aucune annulation ! 😌 À bientôt 💘',
    waIntroWithSender: (who) => `🎉 ${who}a dit "Oui" et a confirmé le plan !`,
    waShareIntro: (link) => `J'ai une question pour toi 👀 ${link}`,

    templates: {
      date: {
        pageTitle: "J'ai une question pour toi 💌",
        welcomeTitle: "J'ai une question<br />très importante pour toi...",
        questionTitleDefault: 'Veux-tu sortir avec moi ?',
        questionTitleFor: (name) => `${name}, veux-tu sortir avec moi ?`,
        yesTitle: 'JE LE SAVAIS ! 🎊',
        yesSubtitle: 'Mon cœur bat la chamade là 💓',
        ticketTitle: 'Notre rendez-vous est fixé ! 🥳',
        ticketHeader: '🎫 BILLET DE RENDEZ-VOUS',
        ticketFooter: 'Aucune annulation ! 😌 Présence obligatoire 💘',
        questionEmojiInitial: '💘',
      },
      anniversary: {
        pageTitle: 'Fêtons Notre Anniversaire ? 🎉',
        welcomeTitle: "J'ai une question<br />spéciale pour toi...",
        questionTitleDefault: 'Veux-tu fêter notre anniversaire avec moi ?',
        questionTitleFor: (name) => `${name}, veux-tu fêter notre anniversaire avec moi ?`,
        yesTitle: 'GÉNIAL ! 🎉',
        yesSubtitle: 'Cet anniversaire sera inoubliable 🥳',
        ticketTitle: 'Notre célébration est fixée ! 🥳',
        ticketHeader: "🎫 BILLET D'ANNIVERSAIRE",
        ticketFooter: 'Aucune annulation ! 😌 Présence obligatoire 🎉',
        questionEmojiInitial: '🎉',
      },
      valentine: {
        pageTitle: 'Veux-tu Être Mon Valentin(e) ? 💝',
        welcomeTitle: "J'ai une question<br />spéciale pour toi...",
        questionTitleDefault: 'Veux-tu être mon valentin(e) ?',
        questionTitleFor: (name) => `${name}, veux-tu être mon valentin(e) ?`,
        yesTitle: 'JE SUIS RAVI(E) ! 💝',
        yesSubtitle: 'Mon cœur bat pour toi 💓',
        ticketTitle: 'Notre rendez-vous est fixé ! 🥳',
        ticketHeader: '🎫 BILLET DE SAINT-VALENTIN',
        ticketFooter: 'Aucune annulation ! 😌 Présence obligatoire 💝',
        questionEmojiInitial: '💝',
      },
      proposal: {
        pageTitle: "J'ai une question très importante 💍",
        welcomeTitle: 'La question la plus<br />importante de ma vie...',
        questionTitleDefault: "Veux-tu m'épouser ?",
        questionTitleFor: (name) => `${name}, veux-tu m'épouser ?`,
        yesTitle: 'ELLE A DIT OUI ! 💍',
        yesSubtitle: 'Le moment le plus heureux de ma vie 🥹',
        ticketTitle: 'Notre plan est fixé ! 🥳',
        ticketHeader: '🎫 BILLET DE DEMANDE EN MARIAGE',
        ticketFooter: 'Aucune annulation ! 😌 Présence obligatoire 💍',
        questionEmojiInitial: '💍',
      },
    },
  },

  de: {
    setupTitle: 'Zuerst du 💌',
    setupSubtitle: 'Wir sagen dir Bescheid, sobald geantwortet wird',
    templateLabel: 'Welche Art Einladung? 💌',
    themeLabel: 'Deine Farbwahl 🎨',
    nameLabel: 'Dein Name',
    namePlaceholder: 'z. B. Max',
    phoneLabel: 'Deine WhatsApp-Nummer',
    phonePlaceholder: 'z. B. 4915123456789',
    phoneHint: 'Mit Landesvorwahl (49...), Leerzeichen/Plus spielen keine Rolle',
    recipientLabel: 'An wen schickst du das? (optional)',
    recipientPlaceholder: 'z. B. Anna',
    generateBtn: 'Link erstellen 🔗',
    linkReadyLabel: 'Dein Link ist fertig 🎉',
    copyBtn: 'Link kopieren 📋',
    copiedBtn: 'Kopiert ✅',
    shareBtn: 'Über WhatsApp senden 📤',
    qrLabel: 'Oder QR-Code scannen 📱',
    errorMsg: 'Gib deinen Namen und eine gültige WhatsApp-Nummer mit Landesvorwahl ein 🙏',
    darkModeToggleLabel: 'Dunkler/Heller Modus',
    soundToggleLabel: 'Ton ein/aus',

    senderNote: (name) => `${name} hat eine Frage an dich 💌`,
    welcomeSubtitle: 'Atme tief durch, bevor du antwortest 😌',
    startBtn: 'Ich bin bereit 💪',
    yesBtn: 'Ja 🥰',
    noBtn: 'Nein 😤',
    funnyMessages: [
      'Bist du sicher? 🥺',
      'Denk nochmal nach 😏',
      'Brich mir nicht das Herz 💔',
      'Du kannst nicht entkommen 😈',
      'Du bist schnell, aber ich bin schneller 🏃',
      'Du wirst ihn nie erwischen 😂',
      'Du musst jetzt auf Ja klicken 😂',
      'Vielleicht solltest du einfach aufgeben? 🙈',
    ],

    toDateBtn: 'Lass uns das Date planen 📅',

    planTitle: 'Lass uns planen 🗓️',
    dayLabel: 'Welcher Tag? 📆',
    timeLabel: 'Wie spät? ⏰',
    placeLabel: 'Wohin gehen wir? 📍',
    confirmBtn: 'Date bestätigen 🎫',
    today: 'Heute',
    tomorrow: 'Morgen',
    dayShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayLong: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    monthShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    monthLong: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

    timeOptions: [
      { key: 'coffee', time: '14:00', emoji: '☕', name: 'Kaffeezeit' },
      { key: 'sunset', time: '18:00', emoji: '🌅', name: 'Sonnenuntergang' },
      { key: 'dinner', time: '20:00', emoji: '🍝', name: 'Abendessen' },
    ],
    placeOptions: [
      { key: 'coffee', emoji: '☕', name: 'Kaffee' },
      { key: 'food', emoji: '🍕', name: 'Essen' },
      { key: 'movie', emoji: '🎬', name: 'Kino' },
      { key: 'walk', emoji: '🚶', name: 'Spaziergang' },
    ],
    surprisePlace: 'Überraschung 🎁',

    templateOptions: [
      { key: 'date', emoji: '💘', name: 'Erstes Date' },
      { key: 'anniversary', emoji: '🎉', name: 'Jahrestag' },
      { key: 'valentine', emoji: '💝', name: 'Valentinstag' },
      { key: 'proposal', emoji: '💍', name: 'Heiratsantrag' },
    ],
    themeOptions: [
      { key: 'pink', name: 'Pink' },
      { key: 'sunset', name: 'Sonnenuntergang' },
      { key: 'ocean', name: 'Ozean' },
      { key: 'lavender', name: 'Lavendel' },
      { key: 'mint', name: 'Minze' },
    ],

    ticketDateLabel: '📆 Datum',
    ticketTimeLabel: '⏰ Uhrzeit',
    ticketPlaceLabel: '📍 Ort',
    whatsappNotifyBtn: 'Per WhatsApp benachrichtigen 📲',
    whatsappNotifySenderBtn: 'Absender benachrichtigen 📲',
    downloadTicketBtn: 'Ticket herunterladen 📸',
    restartBtn: 'Neu starten 🔄',
    countdownDays: 'Tage',
    countdownHours: 'Stunden',
    countdownMinutes: 'Minuten',
    countdownSeconds: 'Sekunden',
    countdownPast: 'Es ist Zeit! 🎉',

    waDateLabel: '📆 Datum',
    waTimeLabel: '⏰ Uhrzeit',
    waPlaceLabel: '📍 Ort',
    waFooter: 'Keine Absage möglich! 😌 Bis dann 💘',
    waIntroWithSender: (who) => `🎉 ${who}hat "Ja" gesagt und den Plan bestätigt!`,
    waShareIntro: (link) => `Ich habe eine Frage an dich 👀 ${link}`,

    templates: {
      date: {
        pageTitle: 'Ich habe eine Frage an dich 💌',
        welcomeTitle: 'Ich habe eine sehr<br />wichtige Frage an dich...',
        questionTitleDefault: 'Gehst du mit mir aus?',
        questionTitleFor: (name) => `${name}, gehst du mit mir aus?`,
        yesTitle: 'ICH WUSSTE ES! 🎊',
        yesSubtitle: 'Mein Herz rast gerade 💓',
        ticketTitle: 'Unser Date steht! 🥳',
        ticketHeader: '🎫 DATE-TICKET',
        ticketFooter: 'Keine Absage möglich! 😌 Teilnahme verpflichtend 💘',
        questionEmojiInitial: '💘',
      },
      anniversary: {
        pageTitle: 'Feiern Wir Unseren Jahrestag? 🎉',
        welcomeTitle: 'Ich habe eine besondere<br />Frage an dich...',
        questionTitleDefault: 'Feierst du unseren Jahrestag mit mir?',
        questionTitleFor: (name) => `${name}, feierst du unseren Jahrestag mit mir?`,
        yesTitle: 'FANTASTISCH! 🎉',
        yesSubtitle: 'Dieser Jahrestag wird unvergesslich 🥳',
        ticketTitle: 'Unsere Feier steht! 🥳',
        ticketHeader: '🎫 JAHRESTAG-TICKET',
        ticketFooter: 'Keine Absage möglich! 😌 Teilnahme verpflichtend 🎉',
        questionEmojiInitial: '🎉',
      },
      valentine: {
        pageTitle: 'Willst Du Mein Valentinstag Sein? 💝',
        welcomeTitle: 'Ich habe eine besondere<br />Frage an dich...',
        questionTitleDefault: 'Willst du mein Valentinstag sein?',
        questionTitleFor: (name) => `${name}, willst du mein Valentinstag sein?`,
        yesTitle: 'ICH FREUE MICH SO! 💝',
        yesSubtitle: 'Mein Herz schlägt für dich 💓',
        ticketTitle: 'Unser Date steht! 🥳',
        ticketHeader: '🎫 VALENTINSTAG-TICKET',
        ticketFooter: 'Keine Absage möglich! 😌 Teilnahme verpflichtend 💝',
        questionEmojiInitial: '💝',
      },
      proposal: {
        pageTitle: 'Ich habe eine sehr wichtige Frage 💍',
        welcomeTitle: 'Die wichtigste Frage<br />meines Lebens...',
        questionTitleDefault: 'Willst du mich heiraten?',
        questionTitleFor: (name) => `${name}, willst du mich heiraten?`,
        yesTitle: 'SIE HAT JA GESAGT! 💍',
        yesSubtitle: 'Der glücklichste Moment meines Lebens 🥹',
        ticketTitle: 'Unser Plan steht! 🥳',
        ticketHeader: '🎫 HEIRATSANTRAG-TICKET',
        ticketFooter: 'Keine Absage möglich! 😌 Teilnahme verpflichtend 💍',
        questionEmojiInitial: '💍',
      },
    },
  },
};

function detectInitialLang() {
  const fromUrl = linkParamsRaw.get('lg');
  if (fromUrl && SUPPORTED_LANGS.includes(fromUrl)) return fromUrl;
  try {
    const fromStorage = localStorage.getItem('fd_lang');
    if (fromStorage && SUPPORTED_LANGS.includes(fromStorage)) return fromStorage;
  } catch (e) { /* localStorage kapalı olabilir (gizli sekme vb.) */ }
  const nav = ((navigator.language || 'en').slice(0, 2)).toLowerCase();
  return SUPPORTED_LANGS.includes(nav) ? nav : 'en';
}

function detectInitialTemplate() {
  const fromUrl = linkParamsRaw.get('tp');
  return (fromUrl && TEMPLATE_KEYS.includes(fromUrl)) ? fromUrl : 'date';
}

function detectInitialThemeColor() {
  const fromUrl = linkParamsRaw.get('th');
  if (fromUrl && THEME_COLORS.includes(fromUrl)) return fromUrl;
  try {
    const fromStorage = localStorage.getItem('fd_theme');
    if (fromStorage && THEME_COLORS.includes(fromStorage)) return fromStorage;
  } catch (e) { /* yoksay */ }
  return 'pink';
}

function detectInitialMode() {
  try {
    const stored = localStorage.getItem('fd_mode');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) { /* yoksay */ }
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

function detectInitialSound() {
  try {
    if (localStorage.getItem('fd_sound') === 'off') return false;
  } catch (e) { /* yoksay */ }
  return true;
}

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  const tmpl = dict.templates && dict.templates[currentTemplate];
  if (tmpl && key in tmpl) return tmpl[key];
  return dict[key];
}

// ---------- Ekranlar arası geçiş ----------
function goToScreen(id) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(id);
  if (current === next) return;
  if (current) current.classList.remove('active');
  next.classList.add('active');
}

// ============================================================
//  1) LİNK KİŞİSELLEŞTİRME — gönderen linke kendi bilgilerini
//  (sn, sp, rn, lg: dil, tp: davet şablonu, th: renk teması) URL
//  parametresi olarak koyar; karşı taraf o linki açtığında burada okunur.
// ============================================================
const linkParamsRaw = new URLSearchParams(window.location.search);
const senderName = linkParamsRaw.get('sn') || null;
const senderPhone = linkParamsRaw.get('sp') || null;
const recipientName = linkParamsRaw.get('rn') || null;

let currentLang = detectInitialLang();
let currentTemplate = detectInitialTemplate();
let currentThemeColor = detectInitialThemeColor();
let currentMode = detectInitialMode();
let soundEnabled = detectInitialSound();

function renderQuestionTitle() {
  const title = document.getElementById('question-title');
  title.textContent = recipientName ? t('questionTitleFor')(recipientName) : t('questionTitleDefault');
  const emoji = document.getElementById('question-emoji');
  if (!btnNo || !btnNo.classList.contains('escaping')) {
    emoji.textContent = t('questionEmojiInitial');
  }
}

function personalizeForRecipient() {
  if (senderName) {
    const note = document.getElementById('sender-note');
    note.textContent = t('senderNote') ? t('senderNote')(senderName) : '';
    note.hidden = !senderName;
  }
  renderQuestionTitle();
}

// ============================================================
//  2) GÖRÜNÜM: DİL / ŞABLON / TEMA / KARANLIK MOD / SES
// ============================================================
function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  try { localStorage.setItem('fd_lang', lang); } catch (e) { /* yoksay */ }
  applyTranslations();
}

function setTemplate(key) {
  if (!TEMPLATE_KEYS.includes(key)) return;
  currentTemplate = key;
  applyTranslations();
}

function setThemeColor(key) {
  if (!THEME_COLORS.includes(key)) return;
  currentThemeColor = key;
  try { localStorage.setItem('fd_theme', key); } catch (e) { /* yoksay */ }
  applyThemeColor();
  renderThemePicker();
}

function applyThemeColor() {
  document.documentElement.dataset.themeColor = currentThemeColor;
}

function applyMode() {
  document.documentElement.dataset.mode = currentMode;
  const btn = document.getElementById('btn-dark-toggle');
  btn.textContent = currentMode === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-pressed', currentMode === 'dark' ? 'true' : 'false');
}

function toggleMode() {
  currentMode = currentMode === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('fd_mode', currentMode); } catch (e) { /* yoksay */ }
  applyMode();
}

function applySoundUI() {
  const btn = document.getElementById('btn-sound-toggle');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  btn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('fd_sound', soundEnabled ? 'on' : 'off'); } catch (e) { /* yoksay */ }
  applySoundUI();
  if (soundEnabled) playTone(660, 0.08, 'sine', 0.05);
}

function updateLangSwitcherUI() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function renderTemplatePicker() {
  const wrap = document.getElementById('template-picker');
  wrap.innerHTML = '';
  t('templateOptions').forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-card';
    if (opt.key === currentTemplate) btn.classList.add('selected');
    btn.setAttribute('aria-pressed', opt.key === currentTemplate ? 'true' : 'false');
    btn.innerHTML = `<span class="option-emoji">${opt.emoji}</span><span>${opt.name}</span>`;
    btn.addEventListener('click', () => { playClick(); setTemplate(opt.key); });
    wrap.appendChild(btn);
  });
}

function renderThemePicker() {
  const wrap = document.getElementById('theme-picker');
  wrap.innerHTML = '';
  t('themeOptions').forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-swatch';
    if (opt.key === currentThemeColor) btn.classList.add('selected');
    btn.setAttribute('aria-pressed', opt.key === currentThemeColor ? 'true' : 'false');
    btn.setAttribute('aria-label', opt.name);
    btn.title = opt.name;
    const colors = THEME_SWATCH_COLORS[opt.key] || THEME_SWATCH_COLORS.pink;
    btn.style.setProperty('--swatch-1', colors[0]);
    btn.style.setProperty('--swatch-2', colors[1]);
    btn.addEventListener('click', () => { playClick(); setThemeColor(opt.key); });
    wrap.appendChild(btn);
  });
}

function setupTopBarToggles() {
  document.getElementById('btn-dark-toggle').addEventListener('click', toggleMode);
  document.getElementById('btn-sound-toggle').addEventListener('click', toggleSound);
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => { playClick(); setLang(btn.dataset.lang); });
  });
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = t(el.getAttribute('data-i18n'));
    if (typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const val = t(el.getAttribute('data-i18n-html'));
    if (typeof val === 'string') el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const val = t(el.getAttribute('data-i18n-placeholder'));
    if (typeof val === 'string') el.placeholder = val;
  });

  document.getElementById('btn-dark-toggle').setAttribute('aria-label', t('darkModeToggleLabel'));
  document.getElementById('btn-sound-toggle').setAttribute('aria-label', t('soundToggleLabel'));

  personalizeForRecipient();
  updateLangSwitcherUI();
  renderTemplatePicker();
  renderThemePicker();
  generateDayPicker();
  renderTimePicker();
  renderPlacePicker();

  // Bilet zaten oluşturulmuşsa (kullanıcı bilet ekranındayken dil/şablon değiştirirse)
  // görüntülenen tarih/saat/mekan metnini de yeni dile göre tazele
  if (selectedDateText && selectedTimeKey) buildTicket();
}

function setupLinkGenerator() {
  const nameInput = document.getElementById('setup-name');
  const phoneInput = document.getElementById('setup-phone');
  const recipientInput = document.getElementById('setup-recipient');
  const errorEl = document.getElementById('setup-error');
  const resultBox = document.getElementById('setup-result');
  const linkInput = document.getElementById('generated-link-input');
  const copyBtn = document.getElementById('btn-copy-link');

  document.getElementById('btn-generate-link').addEventListener('click', () => {
    playClick();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.replace(/[^0-9]/g, '');
    const recipient = recipientInput.value.trim();

    if (!name || phone.length < 10) {
      errorEl.textContent = t('errorMsg');
      resultBox.hidden = true;
      return;
    }
    errorEl.textContent = '';

    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('sn', name);
    url.searchParams.set('sp', phone);
    if (recipient) url.searchParams.set('rn', recipient);
    url.searchParams.set('lg', currentLang);
    url.searchParams.set('tp', currentTemplate);
    url.searchParams.set('th', currentThemeColor);

    linkInput.value = url.toString();
    resultBox.hidden = false;
    renderQRCode(url.toString());
  });

  copyBtn.addEventListener('click', async () => {
    playClick();
    try {
      await navigator.clipboard.writeText(linkInput.value);
    } catch (e) {
      linkInput.removeAttribute('readonly');
      linkInput.select();
      document.execCommand('copy');
      linkInput.setAttribute('readonly', '');
    }
    copyBtn.textContent = t('copiedBtn');
    setTimeout(() => { copyBtn.textContent = t('copyBtn'); }, 1800);
  });

  document.getElementById('btn-share-link').addEventListener('click', () => {
    playClick();
    const text = encodeURIComponent(t('waShareIntro')(linkInput.value));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  });
}

function renderQRCode(url) {
  const box = document.getElementById('qr-code');
  box.innerHTML = '';
  if (typeof QRCode === 'undefined') return;
  new QRCode(box, {
    text: url,
    width: 120,
    height: 120,
    colorDark: '#3a1f35',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

// ============================================================
//  3) SES EFEKTLERİ (Web Audio API — harici ses dosyası yok)
// ============================================================
let audioCtx = null;

function getAudioCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type, volume) {
  if (!soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume || 0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playClick() {
  playTone(520, 0.07, 'triangle', 0.05);
}

function playEscape() {
  playTone(300, 0.09, 'sawtooth', 0.04);
}

function playYesChime() {
  playTone(523, 0.1, 'sine', 0.06);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.06), 90);
  setTimeout(() => playTone(784, 0.14, 'sine', 0.06), 180);
}

// ============================================================
//  4) ARKA PLANDAKİ SÜZÜLEN KALPLER
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
//  5) "HAYIR" BUTONUNUN KAÇMA DAVRANIŞI
// ============================================================
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const funnyMessage = document.getElementById('funny-message');
const questionEmoji = document.getElementById('question-emoji');

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
  playEscape();

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
  const messages = t('funnyMessages');
  funnyMessage.textContent = messages[(escapeCount - 1) % messages.length];

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
// Her ihtimale karşı: bir şekilde tıklama/klavye ile aktivasyon geçerse bile hiçbir yere yönlendirmesin, sadece tekrar kaçsın
btnNo.addEventListener('click', escapeNoButton);

// ============================================================
//  6) KONFETİ (canvas ile, harici kütüphane yok)
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
//  7) TARİH SEÇİMİ — önümüzdeki 14 gün
// ============================================================
let selectedDateText = null;
let selectedDayIndex = null;
let selectedDayDate = null;

function generateDayPicker() {
  const wrap = document.getElementById('day-picker');
  wrap.innerHTML = '';
  const dayShort = t('dayShort');
  const dayLong = t('dayLong');
  const monthShort = t('monthShort');
  const monthLong = t('monthLong');

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'day-card';
    if (i === selectedDayIndex) card.classList.add('selected');
    card.setAttribute('aria-pressed', i === selectedDayIndex ? 'true' : 'false');

    const dowLabel = i === 0 ? t('today') : i === 1 ? t('tomorrow') : dayShort[d.getDay()];
    card.innerHTML = `
      <span class="dow">${dowLabel}</span>
      <span class="dom">${d.getDate()}</span>
      <span class="mon">${monthShort[d.getMonth()]}</span>
    `;

    const fullText = `${dayLong[d.getDay()]}, ${d.getDate()} ${monthLong[d.getMonth()]}`;
    if (i === selectedDayIndex) {
      selectedDateText = fullText;
      selectedDayDate = d;
    }

    card.addEventListener('click', () => {
      playClick();
      document.querySelectorAll('.day-card.selected').forEach((c) => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      selectedDayIndex = i;
      selectedDateText = fullText;
      selectedDayDate = d;
      checkPlanComplete();
    });

    wrap.appendChild(card);
  }
}

// ============================================================
//  8) SAAT VE MEKAN SEÇİMİ
// ============================================================
let selectedTimeKey = null;
let selectedPlaceKey = null;

function renderTimePicker() {
  const wrap = document.getElementById('time-picker');
  wrap.innerHTML = '';
  t('timeOptions').forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-card';
    if (opt.key === selectedTimeKey) btn.classList.add('selected');
    btn.setAttribute('aria-pressed', opt.key === selectedTimeKey ? 'true' : 'false');
    btn.innerHTML = `
      <span class="option-emoji">${opt.emoji}</span>
      <span>${opt.name}</span>
      <span class="option-sub">${opt.time}</span>
    `;
    btn.addEventListener('click', () => {
      playClick();
      document.querySelectorAll('#time-picker .option-card.selected').forEach((c) => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedTimeKey = opt.key;
      checkPlanComplete();
    });
    wrap.appendChild(btn);
  });
}

function renderPlacePicker() {
  const wrap = document.getElementById('place-picker');
  wrap.innerHTML = '';
  t('placeOptions').forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-card';
    if (opt.key === selectedPlaceKey) btn.classList.add('selected');
    btn.setAttribute('aria-pressed', opt.key === selectedPlaceKey ? 'true' : 'false');
    btn.innerHTML = `
      <span class="option-emoji">${opt.emoji}</span>
      <span>${opt.name}</span>
    `;
    btn.addEventListener('click', () => {
      playClick();
      document.querySelectorAll('#place-picker .option-card.selected').forEach((c) => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      selectedPlaceKey = opt.key;
      checkPlanComplete();
    });
    wrap.appendChild(btn);
  });
}

function getSelectedTimeOption() {
  return t('timeOptions').find((o) => o.key === selectedTimeKey) || null;
}

function getSelectedPlaceOption() {
  return t('placeOptions').find((o) => o.key === selectedPlaceKey) || null;
}

function checkPlanComplete() {
  const btn = document.getElementById('btn-confirm-plan');
  btn.disabled = !(selectedDateText && selectedTimeKey);
}

// ============================================================
//  9) GERİ SAYIM (bilet ekranı)
// ============================================================
let countdownIntervalId = null;

function getTargetDateTime() {
  if (!selectedDayDate || !selectedTimeKey) return null;
  const opt = getSelectedTimeOption();
  if (!opt) return null;
  const [hh, mm] = opt.time.split(':').map(Number);
  const target = new Date(selectedDayDate);
  target.setHours(hh, mm, 0, 0);
  return target;
}

function countdownUnit(value, label) {
  return `<div class="countdown-unit"><span class="countdown-num">${value}</span><span class="countdown-label">${label}</span></div>`;
}

function renderCountdownTick() {
  const el = document.getElementById('countdown');
  const target = getTargetDateTime();
  if (!target) { el.innerHTML = ''; return; }

  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    el.innerHTML = countdownUnit('🎉', t('countdownPast'));
    stopCountdown();
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  el.innerHTML =
    countdownUnit(days, t('countdownDays')) +
    countdownUnit(hours, t('countdownHours')) +
    countdownUnit(minutes, t('countdownMinutes')) +
    countdownUnit(seconds, t('countdownSeconds'));
}

function stopCountdown() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
}

function startCountdown() {
  stopCountdown();
  renderCountdownTick();
  countdownIntervalId = setInterval(renderCountdownTick, 1000);
}

// ============================================================
//  10) BİLET OLUŞTURMA, İNDİRME VE WHATSAPP PAYLAŞIMI
// ============================================================
function buildTicket() {
  const timeOpt = getSelectedTimeOption();
  const placeOpt = getSelectedPlaceOption();
  const placeLabel = placeOpt ? `${placeOpt.name} ${placeOpt.emoji}` : t('surprisePlace');

  document.getElementById('ticket-date').textContent = selectedDateText;
  document.getElementById('ticket-time').textContent = timeOpt ? `${timeOpt.name} (${timeOpt.time})` : '-';
  document.getElementById('ticket-place').textContent = placeLabel;

  // Bilet, gönderene doğrudan haber verilecek şekilde açıldıysa buton metnini ona göre değiştir
  const waBtn = document.getElementById('btn-whatsapp');
  waBtn.textContent = senderPhone ? t('whatsappNotifySenderBtn') : t('whatsappNotifyBtn');

  startCountdown();
}

function buildWhatsappMessage() {
  const timeOpt = getSelectedTimeOption();
  const placeOpt = getSelectedPlaceOption();
  const placeLabel = placeOpt ? `${placeOpt.name} ${placeOpt.emoji}` : t('surprisePlace');
  const who = recipientName ? `${recipientName} ` : '';
  const intro = senderPhone ? t('waIntroWithSender')(who) : t('ticketHeader');
  return (
    `${intro}\n\n` +
    `${t('waDateLabel')}: ${selectedDateText}\n` +
    `${t('waTimeLabel')}: ${timeOpt ? `${timeOpt.name} (${timeOpt.time})` : '-'}\n` +
    `${t('waPlaceLabel')}: ${placeLabel}\n\n` +
    `${t('waFooter')}`
  );
}

function downloadTicketImage() {
  playClick();
  if (typeof html2canvas === 'undefined') return;
  const target = document.getElementById('ticket-capture');
  html2canvas(target, { backgroundColor: null, scale: 2 }).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'date-ticket.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// ============================================================
//  11) BUTON OLAYLARI
// ============================================================
document.getElementById('btn-start').addEventListener('click', () => {
  playClick();
  goToScreen('screen-question');
});

btnYes.addEventListener('click', () => {
  playYesChime();
  goToScreen('screen-yes');
  launchConfetti('confetti-canvas');
});

document.getElementById('btn-to-date').addEventListener('click', () => {
  playClick();
  goToScreen('screen-plan');
});

document.getElementById('btn-confirm-plan').addEventListener('click', () => {
  playYesChime();
  buildTicket();
  goToScreen('screen-ticket');
  launchConfetti('confetti-canvas-2');
});

document.getElementById('btn-whatsapp').addEventListener('click', () => {
  playClick();
  const text = encodeURIComponent(buildWhatsappMessage());
  const target = senderPhone
    ? `https://api.whatsapp.com/send?phone=${senderPhone}&text=${text}`
    : `https://api.whatsapp.com/send?text=${text}`;
  window.open(target, '_blank');
});

document.getElementById('btn-download-ticket').addEventListener('click', downloadTicketImage);

document.getElementById('btn-restart').addEventListener('click', () => {
  playClick();
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

  document.querySelectorAll('.day-card.selected, .option-card.selected').forEach((c) => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
  selectedDateText = null;
  selectedDayIndex = null;
  selectedDayDate = null;
  selectedTimeKey = null;
  selectedPlaceKey = null;
  checkPlanComplete();
  stopCountdown();
  document.getElementById('countdown').innerHTML = '';

  goToScreen('screen-welcome');
});

// ============================================================
//  BAŞLANGIÇ
// ============================================================
createFloatingHearts();
setupTopBarToggles();
setupLinkGenerator();
applyThemeColor();
applyMode();
applySoundUI();
applyTranslations();

// Linkte gönderen bilgisi varsa bu bir alıcı ziyaretidir: doğrudan soruya geç.
// Yoksa önce linki oluşturacak kişiye kurulum ekranını göster.
if (senderPhone) {
  goToScreen('screen-welcome');
} else {
  goToScreen('screen-setup');
}
