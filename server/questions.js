
const LOVE_QUESTIONS = [
  {
    id: "q1",
    text: "İlk buluşmamız (date) neredeydi?",
    choices: ["İstanbul", "İzmir", "Ankara", "Eskişehir"],
    correctIndex: 1, // İzmir
  },
  {
    id: "q2",
    text: "İlk buluşmamızda ne yedik?",
    choices: ["Hamburger", "Sushi", "Makarna", "Pizza"],
    correctIndex: 3, // Pizza
  },
  {
    id: "q3",
    text: "Ege’nin boyu kaç cm?",
    choices: ["182", "185", "188", "190"],
    correctIndex: 2, // 188
  },
  {
    id: "q4",
    text: "Şevval’in en sevdiği renkler hangileridir?",
    choices: [
      "Mavi ve beyaz",
      "Siyah ve kırmızı",
      "Sarı ve turuncu",
      "Yeşil ve mor",
    ],
    correctIndex: 3, // Yeşil ve mor
  },
  {
    id: "q5",
    text: "Şevval Starbucks’tan genelde ne içer?",
    choices: [
      "Grande Latte",
      "Venti Cappuccino",
      "Tall Flat White",
      "Tall Americano",
    ],
    correctIndex: 3, // Tall Americano
  },
  {
    id: "q6",
    text: "Şevval’in doğum tarihi nedir?",
    choices: ["12.02.2003", "02.03.2005", "02.03.2004", "03.02.2004"],
    correctIndex: 2, // 02.03.2004
  },
  {
    id: "q7",
    text: "Ege kaç numara ayakkabı giyer?",
    choices: ["42", "43", "44", "45"],
    correctIndex: 3, // 45
  },
  {
    id: "q8",
    text: "Ege’nin en sevdiği renk hangisidir?",
    choices: ["Siyah", "Yeşil", "Kırmızı", "Mavi"],
    correctIndex: 3, // Mavi
  },
  {
    id: "q9",
    text: "Şevval’in kardeşinin adı nedir?",
    choices: ["Emre", "Aslı", "Azra", "Derya"],
    correctIndex: 2, // Azra
  },
  {
    id: "q10",
    text: "Şevval’in ailesi nerede yaşıyor?",
    choices: ["İzmit", "Gebze", "Yalova", "Karamürsel, Kocaeli"],
    correctIndex: 3, // Karamürsel, Kocaeli
  },
  {
    id: "q11",
    text: "Ege’nin evi nereye yakındır?",
    choices: ["AVM", "Üniversite", "Sahil", "Gar"],
    correctIndex: 3, // Gar
  },
  {
    id: "q12",
    text: "Ege’nin en sevdiği arkadaşı kimdir?",
    choices: ["Batu", "Burak", "Alp", "Beril"],
    correctIndex: 2, // Alp
  },
  {
    id: "q13",
    text: "Şevval’in en sevdiği arkadaşı kimdir?",
    choices: ["Onur", "CEYDA", "Arda", "EMRE"],
    correctIndex: 2, // Arda
  },
];

const SPORT_RAW = [
  {
    id: "s1",
    text: "Which country won the 2018 FIFA World Cup?",
    correct: "France",
    wrong1: "Germany",
    wrong2: "Brazil",
    wrong3: "Argentina",      
  },
  {
    id: "s2",
    text: "How many players are on the field per team in football?",
    correct: "11",
    wrong1: "9",
    wrong2: "10",
    wrong3: "12",
  },
  {
    id: "s3",
    text: "What is the maximum length of a standard football match (excluding extra time)?",
    correct: "90 minutes",
    wrong1: "60 minutes",
    wrong2: "80 minutes",
    wrong3: "100 minutes",
  },
  {
    id: "s4",
    text: "Who won the Ballon d’Or in 2023?",
    correct: "Lionel Messi",
    wrong1: "Kylian Mbappé",
    wrong2: "Erling Haaland",
    wrong3: "Kevin De Bruyne",      
  },
  {
    id: "s5",
    text: "What club has won the most UEFA Champions League titles?",
    correct: "Real Madrid",
    wrong1: "Barcelona",
    wrong2: "AC Milan",
    wrong3: "Liverpool",
  },
  {
    id: "s6",
    text: "What is it called when a player scores three goals in one match?",
    correct: "Hat-trick",
    wrong1: "Brace",
    wrong2: "Triple-shot",
    wrong3: "Treble-kick",
  },
  {
    id: "s7",
    text: "Which country hosted the 2022 FIFA World Cup?",
    correct: "Qatar",
    wrong1: "Russia",
    wrong2: "USA",
    wrong3: "Saudi Arabia",
  },
  {
    id: "s8",
    text: "What color card means a player is sent off?",
    correct: "Red",
    wrong1: "Yellow",
    wrong2: "Blue",
    wrong3: "White",
  },
  {
    id: "s9",
    text: "Which position is allowed to use hands inside the penalty area?",
    correct: "Goalkeeper",
    wrong1: "Defender",
    wrong2: "Midfielder",
    wrong3: "Striker",
  },
  {
    id: "s10",
    text: "What is the name of football’s governing body?",
    correct: "FIFA",
    wrong1: "UEFA",
    wrong2: "CONMEBOL",
    wrong3: "FA",
  },
  {
    id: "s11",
    text: "How many players are on the court per team in basketball?",
    correct: "5",
    wrong1: "4",
    wrong2: "6",
    wrong3: "7",
  },
  {
    id: "s12",
    text: "How many points is a free throw worth?",
    correct: "1",
    wrong1: "2",
    wrong2: "3",
    wrong3: "0",
  },
  {
    id: "s13",
    text: "Which league is considered the top basketball league in the world?",
    correct: "NBA",
    wrong1: "EuroLeague",
    wrong2: "NCAA",
    wrong3: "CBA",
  },
  {
    id: "s14",
    text: "What is the standard shot clock duration in the NBA?",
    correct: "24 seconds",
    wrong1: "30 seconds",
    wrong2: "14 seconds",
    wrong3: "35 seconds",
  },
  {
    id: "s15",
    text: "Who is the NBA’s all-time leading scorer (as of 2024)?",
    correct: "LeBron James",
    wrong1: "Kareem Abdul-Jabbar",
    wrong2: "Michael Jordan",
    wrong3: "Kobe Bryant",
  },
  {
    id: "s21",
    text: "How many points are needed to win a game in tennis (without deuce)?",
    correct: "4",
    wrong1: "3",
    wrong2: "5",
    wrong3: "6",
  },
  {
    id: "s22",
    text: "What surface is Wimbledon played on?",
    correct: "Grass",
    wrong1: "Clay",
    wrong2: "Hard",
    wrong3: "Carpet",
  },
  {
    id: "s23",
    text: "How many Grand Slam tournaments are there each year?",
    correct: "4",
    wrong1: "3",
    wrong2: "5",
    wrong3: "6",
  },
  {
    id: "s24",
    text: "What is a score of zero called in tennis?",
    correct: "Love",
    wrong1: "Nil",
    wrong2: "Zero",
    wrong3: "Blank",
  },
  {
    id: "s25",
    text: "Who has won the most men’s Grand Slam titles?",
    correct: "Novak Djokovic",
    wrong1: "Roger Federer",
    wrong2: "Rafael Nadal",
    wrong3: "Andy Murray",
  },
  {
    id: "s31",
    text: "How long is a marathon?",
    correct: "42.195 km",
    wrong1: "40 km",
    wrong2: "45 km",
    wrong3: "50 km",
  },
  {
    id: "s32",
    text: "What is the fastest sprint distance in track events?",
    correct: "100 meters",
    wrong1: "60 meters",
    wrong2: "200 meters",
    wrong3: "400 meters",
  },
  {
    id: "s33",
    text: "How often are the Summer Olympics held?",
    correct: "Every 4 years",
    wrong1: "Every 2 years",
    wrong2: "Every 6 years",
    wrong3: "Every year",
  },
  {
    id: "s34",
    text: "Which country has won the most Olympic medals overall?",
    correct: "United States",
    wrong1: "Russia",
    wrong2: "China",
    wrong3: "Germany",
  },
  {
    id: "s35",
    text: "Who holds the men's high jump world record?",
    correct: "Javier Sotomayor",
    wrong1: "Mutaz Essa Barshim",
    wrong2: "Stefan Holm",
    wrong3: "Patrick Sjöberg",
  },
  {
    id: "s41",
    text: "How many points is a touchdown worth?",
    correct: "6",
    wrong1: "3",
    wrong2: "5",
    wrong3: "7",
  },
  {
    id: "s42",
    text: "How many downs does a team have to advance 10 yards?",
    correct: "4",
    wrong1: "3",
    wrong2: "5",
    wrong3: "6",
  },
  {
    id: "s43",
    text: "What league hosts the Super Bowl?",
    correct: "NFL",
    wrong1: "NCAA",
    wrong2: "CFL",
    wrong3: "XFL",
  },
  {
    id: "s51",
    text: "What does F1 stand for?",
    correct: "Formula One",
    wrong1: "Fast One",
    wrong2: "First One",
    wrong3: "Formula Speed",
  },
  {
    id: "s52",
    text: "How is an F1 race distance defined?",
    correct: "Laps enough to exceed 305 km",
    wrong1: "Exactly 50 laps",
    wrong2: "Exactly 200 km",
    wrong3: "Fixed at 2 hours",
  },
  {
    id: "s53",
    text: "What flag signals the end of a race?",
    correct: "Checkered flag",
    wrong1: "Red flag",
    wrong2: "Green flag",
    wrong3: "Yellow flag",
  },
  {
    id: "s61",
    text: "How many rounds are in a standard boxing title fight?",
    correct: "12",
    wrong1: "10",
    wrong2: "8",
    wrong3: "15",
  },
  {
    id: "s62",
    text: "What does KO stand for?",
    correct: "Knockout",
    wrong1: "Kickout",
    wrong2: "Knockover",
    wrong3: "Keep out",
  },
  {
    id: "s71",
    text: "What sport uses a puck?",
    correct: "Ice hockey",
    wrong1: "Rugby",
    wrong2: "Field hockey",
    wrong3: "Lacrosse",
  },
  {
    id: "s72",
    text: "How many players are on a volleyball team on court?",
    correct: "6",
    wrong1: "5",
    wrong2: "7",
    wrong3: "8",
  },
  {
    id: "s81",
    text: "What sport uses the term “alley-oop”?",
    correct: "Basketball",
    wrong1: "Tennis",
    wrong2: "Volleyball",
    wrong3: "Handball",
  },
  {
    id: "s82",
    text: "What sport awards a green jacket?",
    correct: "Golf (The Masters)",
    wrong1: "Tennis",
    wrong2: "Snooker",
    wrong3: "Bowling",
  },
];

const HISTORY_RAW = [
  { id: "h1", text: "Which civilization built the pyramids of Giza?", correct: "Ancient Egyptians", wrong1: "Ancient Greeks", wrong2: "Mesopotamians", wrong3: "Romans" },
  { id: "h2", text: "Who was the first emperor of Rome?", correct: "Augustus", wrong1: "Julius Caesar", wrong2: "Nero", wrong3: "Constantine" },
  { id: "h3", text: "Where did democracy originate?", correct: "Ancient Athens", wrong1: "Rome", wrong2: "Sparta", wrong3: "Persia" },
  { id: "h4", text: "What writing system was used in Mesopotamia?", correct: "Cuneiform", wrong1: "Hieroglyphics", wrong2: "Latin", wrong3: "Phoenician" },
  { id: "h5", text: "Which river was central to Egyptian civilization?", correct: "Nile", wrong1: "Tigris", wrong2: "Euphrates", wrong3: "Indus" },
  { id: "h6", text: "Who was the king of the Macedonian Empire?", correct: "Alexander the Great", wrong1: "Darius", wrong2: "Philip II", wrong3: "Pyrrhus" },
  { id: "h7", text: "What city was destroyed by Mount Vesuvius in 79 AD?", correct: "Pompeii", wrong1: "Rome", wrong2: "Herculaneum", wrong3: "Naples" },
  { id: "h8", text: "What empire built the Colosseum?", correct: "Roman Empire", wrong1: "Byzantine Empire", wrong2: "Greek", wrong3: "Persian" },
  { id: "h31", text: "What year did the Western Roman Empire fall?", correct: "476", wrong1: "410", wrong2: "455", wrong3: "500" },
  { id: "h32", text: "What system dominated medieval Europe?", correct: "Feudalism", wrong1: "Capitalism", wrong2: "Republicanism", wrong3: "Tribalism" },
  { id: "h33", text: "Who was crowned Holy Roman Emperor in 800?", correct: "Charlemagne", wrong1: "Otto I", wrong2: "Charles V", wrong3: "Frederick Barbarossa" },
  { id: "h34", text: "What pandemic devastated Europe in the 14th century?", correct: "Black Death", wrong1: "Smallpox", wrong2: "Cholera", wrong3: "Spanish Flu" },
  { id: "h61", text: "Who began the Protestant Reformation?", correct: "Martin Luther", wrong1: "John Calvin", wrong2: "Henry VIII", wrong3: "Erasmus" },
  { id: "h62", text: "What invention spread ideas rapidly?", correct: "Printing press", wrong1: "Telegraph", wrong2: "Radio", wrong3: "Internet" },
  { id: "h66", text: "Who reached the Americas in 1492?", correct: "Christopher Columbus", wrong1: "Vasco da Gama", wrong2: "Magellan", wrong3: "Amerigo Vespucci" },
  { id: "h91", text: "What year did the French Revolution begin?", correct: "1789", wrong1: "1776", wrong2: "1799", wrong3: "1815" },
  { id: "h92", text: "Who was the first US president?", correct: "George Washington", wrong1: "Thomas Jefferson", wrong2: "John Adams", wrong3: "Benjamin Franklin" },
  { id: "h96", text: "What year did World War I start?", correct: "1914", wrong1: "1918", wrong2: "1939", wrong3: "1917" },
  { id: "h101", text: "What year did WWII end?", correct: "1945", wrong1: "1944", wrong2: "1946", wrong3: "1943" },
  { id: "h106", text: "What wall fell in 1989?", correct: "Berlin Wall", wrong1: "Great Wall", wrong2: "Warsaw Wall", wrong3: "Iron Curtain" },
];

function formatRawQuestions(rawList) {
  return rawList.map((q) => {
    // Collect all options
    const options = [q.correct, q.wrong1, q.wrong2, q.wrong3].filter(Boolean);
    // Shuffle options
    const shuffled = options.sort(() => Math.random() - 0.5);
    // Find correct index
    const correctIndex = shuffled.findIndex((opt) => opt === q.correct);
    return {
      id: q.id,
      text: q.text,
      choices: shuffled,
      correctIndex,
    };
  });
}

// Pre-process questions once at startup
const QUESTIONS = {
  love: LOVE_QUESTIONS, // Already formatted
  sport: formatRawQuestions(SPORT_RAW),
  history: formatRawQuestions(HISTORY_RAW),
};

module.exports = {
  QUESTIONS,
  getQuestions: (category) => {
    const key = (category || "sport").toLowerCase();
    return QUESTIONS[key] || QUESTIONS.sport; // Default to Sport if unknown
  },
};
