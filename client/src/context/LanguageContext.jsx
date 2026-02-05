import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Login
    login: {
      title: "Quiz Clasher",
      subtitle: "Test your partner or friend group with quizzes you design yourself. Choose a unique username to continue.",
      usernameLabel: "Username",
      usernamePlaceholder: "e.g: ege123",
      loginButton: "Login",
      usernameNote: "This name is stored on your device and matched with quizzes you create.",
    },
    // Menu
    menu: {
      welcome: "Welcome, {username}",
      subtitle: "Select your quiz, play, or create your own.",
      createOwn: "Create your own quiz",
      createOwnHint: "Write your own questions, create your quiz",
      preUploaded: "Pre-uploaded quizzes",
      preUploadedHint: "Ready sports, history and more",
      back: "← Back",
      comingSoon: "Coming Soon",
      suggestions: "💬 Suggestions",
      loveDesc: "Questions special to your relationship",
      customDesc: "Create your own quiz from scratch",
      loveCouple: "Love Couple",
      sport: "Sport",
      history: "History",
      bilkent: "Bilkent",
      memes: "Memes",
    },
    // Lobby
    lobby: {
      title: "Quiz Clasher",
      subtitle: "Set up your room with your knowledge, invite warriors and be the commander who gives the fastest correct answer. Room starts with {maxPlayers} players, first to reach {winScore} points takes the throne.",
      warriorName: "Warrior name",
      warriorPlaceholder: "E.g. Fatih, Mete Han...",
      roomOperations: "Room operations",
      newRoom: "NEW ROOM",
      roomCode: "ROOM CODE",
      joinRoom: "JOIN ROOM",
      roomCodeLabel: "Room code",
      phase: "Phase",
      players: "Players",
      points: "points",
      roomLeader: "Room leader",
      unknown: "Unknown",
      startGameNow: "Start game now",
      highScore: "high score",
      roomHint: "* Room starts automatically when it reaches {maxPlayers} players, room leader can start early with at least {minPlayers} players. Question duration ~{duration}s, first to reach {winScore} points wins.",
    },
    // Game
    game: {
      preparing: "Game preparing",
      preparingSubtitle: "Battlefield is being set up... First question will come automatically when your room is full.",
      round: "Round",
      sendAnswer: "Send answer",
      you: "You",
      answerLocked: "Your answer is locked",
      selectAndSend: "Select and send your answer",
      roomChat: "Room chat",
      chatPlaceholder: "Commanders can share their tactics here while writing answers.",
      messagePlaceholder: "Write message...",
      send: "Send",
    },
    // Result
    result: {
      loading: "Result loading",
      loadingSubtitle: "Collecting moves from the battlefield...",
      roundResult: "Round {round} result",
      correctAnswer: "Correct answer",
      answer: "answer",
      time: "time",
      correct: "correct",
      wrong: "wrong",
      leaderboard: "Overall Scoreboard",
      totalScore: "total score",
      gameOver: "Game over!",
      winner: "{name} ({score} points) is the winner of this battle.",
      nextRound: "New round will start automatically in a few seconds. Get ready commander!",
      you: "you",
    },
    // Create Your Own
    createOwn: {
      title: "Create your own quiz",
      subtitle: "Create your own quiz from scratch. Write 1 correct and 3 wrong answers for each question. You can play after filling at least {count} questions.",
      editQuestions: "Edit questions",
      completed: "Completed ({count})",
      startQuiz: "Start quiz",
      questionText: "Question text",
      correctAnswer: "✓ Correct answer",
      wrongAnswer: "✗ Wrong answer {num}",
      delete: "Delete",
      addQuestion: "+ Add new question",
      save: "Save",
      questionPlaceholder: "E.g: What is the capital of Turkey?",
      correctPlaceholder: "Write correct option",
      wrongPlaceholder: "Wrong option",
      noCompleted: "No completed questions yet. Add and fill questions in the edit tab.",
      result: "Result",
      backToQuiz: "Back to quiz list",
      question: "Question",
      needMore: "At least {required} completed questions required. Currently there are {current}.",
      saved: "Quiz saved!",
      correct: "Correct",
      wrong: "Wrong",
    },
    // Love Couple
    loveCouple: {
      title: "Love Couple Quiz Builder",
      subtitle: "Write 1 correct, 3 wrong answers for the ready questions below. You can also add your own questions at the bottom. All answers are stored on this device specifically for user {username}.",
      editQuestions: "Edit questions",
      completedQuestions: "Completed questions ({count})",
      startQuiz: "Start Love Couple Quiz",
      question: "Question",
      correctAnswer: "✓ Correct answer",
      wrongAnswer: "✗ Wrong answer {num}",
      correctPlaceholder: "Write correct option",
      wrongPlaceholder: "Wrong option",
      yourQuestions: "Your Questions",
      yourQuestionsDesc: "This is completely private to you. You can add as many questions as you want, write 1 correct and 3 wrong answers for each.",
      addQuestion: "Add new question",
      saveAll: "Save all",
      noCompleted: "No fully completed questions yet. You must fill all answers in the editor tab first.",
      correct: "Correct",
      wrong: "Wrong",
      results: "Results",
      playAgain: "Play Again 🔄",
      needMore: "You need at least {required} completed questions before starting the game. Currently there are {count}.",
      saved: "Love Couple quiz saved! Now you can use these questions in the game.",
      perfect: "PERFECT! You are a true love expert! 🔥",
      great: "Great! You know each other very well! 💕",
      good: "You're doing well! Practice a bit more! 😊",
      okay: "Hmm... You need to know each other better! 🤔",
      bad: "Wow... Do you really know each other? 😅",
    },
    // Sport & History (shared)
    quiz: {
      startQuiz: "Start Quiz",
      question: "Question",
      result: "Result",
      backToMenu: "Back to Menu",
      score: "Score",
      correct: "Correct",
      wrong: "Wrong",
      sportQuiz: "Sport Quiz",
      sportSubtitle: "{count} questions, {time} seconds each. Are you ready?",
      historyQuiz: "History Quiz",
      historySubtitle: "{count} questions, {time} seconds each. From ancient times to today.",
      addEditSportQuestions: "Add / edit my own sport questions",
      addEditHistoryQuestions: "Add / edit my own history questions",
      yourSportQuestions: "Your Sport Questions",
      yourHistoryQuestions: "Your History Questions",
      sportBuilderDesc: "Write 1 correct and 3 wrong answers (options) for each question. They will all appear as options in your quiz.",
      historyBuilderDesc: "Write 1 correct and 3 wrong answers (options) for each question.",
      sportQuestionPlaceholder: "E.g: Which team won the 2022 World Cup?",
      historyQuestionPlaceholder: "E.g: In which year was the Ottoman Empire founded?",
      addSportQuestion: "+ Add new sport question",
      addHistoryQuestion: "+ Add new history question",
      backToQuiz: "← Back to Quiz",
      playAgain: "Play Again",
      saved: "Questions saved!",
    },
    // Suggestions
    suggestions: {
      title: "Suggestions",
      subtitle: "Write new category, question or feature ideas here. Your message will go directly to egeural2005@gmail.com.",
      messageLabel: "Your message",
      messagePlaceholder: "Write your idea, suggestion or bug here...",
      sendEmail: "Send email",
      subject: "Quiz Clasher Suggestion",
      from: "From",
      anonymous: "anonymous",
    },
  },
  tr: {
    // Login
    login: {
      title: "Quiz Clasher",
      subtitle: "Kendi tasarladığın quizlerle sevgilini veya arkadaş grubunu test et. Devam etmek için kendine özel bir kullanıcı adı seç.",
      usernameLabel: "Kullanıcı adı",
      usernamePlaceholder: "ör: ege123",
      loginButton: "Giriş yap",
      usernameNote: "Bu isim cihazında saklanır ve hazırladığın quizlerle eşleştirilir.",
    },
    // Menu
    menu: {
      welcome: "Hoş geldin, {username}",
      subtitle: "Quiz'ini seç, oyna veya kendin oluştur.",
      createOwn: "Kendi Quiz'ini Oluştur",
      createOwnHint: "Kendi sorularını yaz, quiz'ini oluştur",
      preUploaded: "Hazır Quizler",
      preUploadedHint: "Hazır spor, tarih ve daha fazlası",
      back: "← Geri",
      comingSoon: "Yakında",
      suggestions: "💬 Öneriler",
      loveDesc: "İlişkinize özel sorular",
      customDesc: "Sıfırdan kendi quiz'in",
      loveCouple: "Aşk Çifti",
      sport: "Spor",
      history: "Tarih",
      bilkent: "Bilkent",
      memes: "Memes",
    },
    // Lobby
    lobby: {
      title: "Quiz Clasher",
      subtitle: "Tarih bilginle odanı kur, savaşçıları davet et ve en hızlı doğru cevabı veren komutan ol. Oda {maxPlayers} kişiyle başlar, ilk {winScore} puana ulaşan tahtı alır.",
      warriorName: "Savaşçı ismi",
      warriorPlaceholder: "Örn. Fatih, Mete Han...",
      roomOperations: "Oda işlemleri",
      newRoom: "YENİ ODA",
      roomCode: "ODA KODU",
      joinRoom: "ODAYA KATIL",
      roomCodeLabel: "Oda kodu",
      phase: "Faz",
      players: "Oyuncu",
      points: "puan",
      roomLeader: "Oda lideri",
      unknown: "Bilinmiyor",
      startGameNow: "Oyunu şimdi başlat",
      highScore: "yüksek skor",
      roomHint: "* Oda {maxPlayers} kişi olduğunda otomatik başlar, oda lideri en az {minPlayers} kişiyle erken başlatabilir. Soru süresi ~{duration}s, ilk {winScore} puana ulaşan kazanır.",
    },
    // Game
    game: {
      preparing: "Oyun hazırlanıyor",
      preparingSubtitle: "Savaş alanı kuruluyor... Odan dolduğunda ilk soru otomatik gelecek.",
      round: "Round",
      sendAnswer: "Cevabı gönder",
      you: "Sen",
      answerLocked: "Cevabın kilitlendi",
      selectAndSend: "• Cevabını seçip gönder",
      roomChat: "Oda sohbeti",
      chatPlaceholder: "Komutanlar cevaplarını yazarken burada taktiklerini paylaşabilir.",
      messagePlaceholder: "Mesaj yaz...",
      send: "Gönder",
    },
    // Result
    result: {
      loading: "Sonuç yükleniyor",
      loadingSubtitle: "Savaş meydanındaki hamleler toplanıyor...",
      roundResult: "Round {round} sonucu",
      correctAnswer: "Doğru cevap",
      answer: "cevap",
      time: "süre",
      correct: "doğru",
      wrong: "yanlış",
      leaderboard: "Genel Skor Tablosu",
      totalScore: "toplam skor",
      gameOver: "Oyun bitti!",
      winner: "{name} ({score} puan) bu savaşın galibi.",
      nextRound: "Yeni tur birkaç saniye içinde otomatik başlayacak. Hazır ol komutan!",
      you: "sen",
    },
    // Create Your Own
    createOwn: {
      title: "Create your own quiz",
      subtitle: "Sıfırdan kendi quiz'ini oluştur. Her soru için 1 doğru ve 3 yanlış cevap yaz. En az {count} soru doldurduktan sonra oynayabilirsin.",
      editQuestions: "Soruları düzenle",
      completed: "Tamamlanan ({count})",
      startQuiz: "Quiz'i başlat",
      questionText: "Soru metni",
      correctAnswer: "✓ Doğru cevap",
      wrongAnswer: "✗ Yanlış cevap {num}",
      delete: "Sil",
      addQuestion: "+ Yeni soru ekle",
      save: "Kaydet",
      questionPlaceholder: "Örn: Türkiye'nin başkenti neresidir?",
      correctPlaceholder: "Doğru şıkkı yaz",
      wrongPlaceholder: "Yanlış şık",
      noCompleted: "Henüz tamamlanmış soru yok. Düzenle sekmesinde soru ekleyip doldur.",
      result: "Sonuç",
      backToQuiz: "Quiz listesine dön",
      question: "Soru",
      needMore: "En az {required} tamamlanmış soru gerekli. Şu an {current} tane var.",
      saved: "Quiz'in kaydedildi!",
      correct: "Doğru",
      wrong: "Yanlış",
    },
    // Love Couple
    loveCouple: {
      title: "Love Couple Quiz Builder",
      subtitle: "Aşağıdaki hazır sorular için 1 doğru, 3 yanlış cevap yaz. İstersen en altta kendi sorularını da ekleyebilirsin. Tüm cevaplar {username} kullanıcına özel olarak bu cihazda saklanır.",
      editQuestions: "Soruları düzenle",
      completedQuestions: "Tamamlanan sorular ({count})",
      startQuiz: "Love Couple Quiz'i başlat",
      question: "Soru",
      questionText: "Soru metni",
      correctAnswer: "✓ Doğru cevap",
      wrongAnswer: "✗ Yanlış cevap {num}",
      correctPlaceholder: "Doğru şıkkı yaz",
      wrongPlaceholder: "Yanlış şık",
      customQuestionPlaceholder: "Kendi sorunu yaz",
      yourQuestions: "Kendi Soruların",
      yourQuestionsDesc: "Burası tamamen size özel. İstediğin kadar soru ekleyebilir, her biri için 1 doğru ve 3 yanlış cevap yazabilirsin.",
      addQuestion: "Yeni soru ekle",
      saveAll: "Tümünü kaydet",
      noCompleted: "Henüz tamamen doldurulmuş bir sorun yok. Önce editör sekmesinde tüm cevapları doldurmalısın.",
      correct: "Doğru",
      wrong: "Yanlış",
      results: "Sonuçlar",
      playAgain: "Tekrar Oyna 🔄",
      needMore: "Oyuna başlamadan önce en az {required} tamamlanmış soruya ihtiyacın var. Şu an {count} tane var.",
      saved: "Love Couple quiz'in kaydedildi! Artık bu soruları oyunda kullanabilirsin.",
      perfect: "MÜKEMMEL! Sen gerçek bir aşk uzmanısın! 🔥",
      great: "Harika! Birbirinizi çok iyi tanıyorsunuz! 💕",
      good: "İyi gidiyorsunuz! Biraz daha pratik yapın! 😊",
      okay: "Hmm... Birbirinizi daha iyi tanımanız lazım! 🤔",
      bad: "Vay be... Gerçekten tanıyor musunuz birbirinizi? 😅",
    },
    // Sport & History (shared)
    quiz: {
      startQuiz: "Quiz'i başlat",
      question: "Soru",
      result: "Sonuç",
      backToMenu: "Menüye dön",
      score: "Skor",
      correct: "Doğru",
      wrong: "Yanlış",
      sportQuiz: "Spor Quiz'i",
      sportSubtitle: "{count} soru, her biri {time} saniye. Hazır mısın?",
      historyQuiz: "Tarih Quiz'i",
      historySubtitle: "{count} soru, her biri {time} saniye. Antik çağdan günümüze.",
      addEditSportQuestions: "Kendi spor sorularımı ekle / düzenle",
      addEditHistoryQuestions: "Kendi tarih sorularımı ekle / düzenle",
      yourSportQuestions: "Kendi Spor Soruların",
      yourHistoryQuestions: "Kendi Tarih Soruların",
      sportBuilderDesc: "Her soru için 1 doğru ve 3 yanlış cevap (şık) yaz. Hepsi senin quiz'inde seçenek olarak görünecek.",
      historyBuilderDesc: "Her soru için 1 doğru ve 3 yanlış cevap (şık) yaz.",
      sportQuestionPlaceholder: "Örn: Hangi takım 2022 Dünya Kupası'nı kazandı?",
      historyQuestionPlaceholder: "Örn: Osmanlı Devleti hangi yılda kuruldu?",
      addSportQuestion: "+ Yeni spor sorusu ekle",
      addHistoryQuestion: "+ Yeni tarih sorusu ekle",
      backToQuiz: "← Quiz'e dön",
      playAgain: "Tekrar oyna",
      saved: "Soruların kaydedildi!",
    },
    // Suggestions
    suggestions: {
      title: "Suggestions",
      subtitle: "Yeni kategori, soru veya özellik fikirlerini buradan yaz. Mesajın direkt olarak egeural2005@gmail.com adresine gidecek.",
      messageLabel: "Mesajın",
      messagePlaceholder: "Fikrini, önerini veya hatayı buraya yaz...",
      sendEmail: "Mail gönder",
      subject: "Quiz Clasher Öneri",
      from: "Gönderen",
      anonymous: "anonim",
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("quiz_clasher_lang");
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem("quiz_clasher_lang", language);
  }, [language]);

  const t = (key, params = {}) => {
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    if (typeof value === "string" && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
