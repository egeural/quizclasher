import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STORAGE_KEY_PREFIX = "bf_sportquiz_";

const SPORT_GROUPS = [
  {
    id: "football",
    title: "Football (Soccer)",
    questions: [
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
        text:
          "What is the maximum length of a standard football match (excluding extra time)?",
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
        text:
          "What is it called when a player scores three goals in one match?",
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
        text:
          "Which position is allowed to use hands inside the penalty area?",
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
    ],
  },
  {
    id: "basketball",
    title: "Basketball",
    questions: [
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
        text:
          "Which league is considered the top basketball league in the world?",
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
        text:
          "Who is the NBA’s all-time leading scorer (as of 2024)?",
        correct: "LeBron James",
        wrong1: "Kareem Abdul-Jabbar",
        wrong2: "Michael Jordan",
        wrong3: "Kobe Bryant",
      },
      {
        id: "s16",
        text: "How long is an NBA game (excluding breaks)?",
        correct: "48 minutes",
        wrong1: "40 minutes",
        wrong2: "60 minutes",
        wrong3: "90 minutes",
      },
      {
        id: "s17",
        text: "What is a “triple-double”?",
        correct: "Double digits in three statistical categories",
        wrong1: "Three pointers in a row",
        wrong2: "Three fouls in a game",
        wrong3: "Three turnovers",
      },
      {
        id: "s18",
        text: "What happens after a tie at the end of regulation?",
        correct: "Overtime",
        wrong1: "Replay",
        wrong2: "Shootout",
        wrong3: "Game ends as a tie",
      },
      {
        id: "s19",
        text:
          "How many fouls cause a player to foul out in the NBA?",
        correct: "6",
        wrong1: "5",
        wrong2: "7",
        wrong3: "8",
      },
      {
        id: "s20",
        text: "What does “and-one” mean?",
        correct: "Scoring while fouled plus a free throw",
        wrong1: "Scoring one point only",
        wrong2: "Missing a free throw",
        wrong3: "Winning by one point",
      },
    ],
  },
  {
    id: "tennis",
    title: "Tennis",
    questions: [
      {
        id: "s21",
        text:
          "How many points are needed to win a game in tennis (without deuce)?",
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
        id: "s26",
        text: "What is the term for 40–40?",
        correct: "Deuce",
        wrong1: "Tie",
        wrong2: "Draw",
        wrong3: "Even",
      },
      {
        id: "s27",
        text: "What happens after deuce?",
        correct: "Advantage",
        wrong1: "Replay",
        wrong2: "Timeout",
        wrong3: "Break",
      },
      {
        id: "s28",
        text: "What is a let?",
        correct: "A serve replay due to interruption",
        wrong1: "A double fault",
        wrong2: "A winning shot",
        wrong3: "A foot fault",
      },
      {
        id: "s29",
        text: "Which Grand Slam is played on clay?",
        correct: "French Open",
        wrong1: "Wimbledon",
        wrong2: "Australian Open",
        wrong3: "US Open",
      },
      {
        id: "s30",
        text: "How many sets are played in a men’s Grand Slam match?",
        correct: "Best of 5",
        wrong1: "Best of 3",
        wrong2: "Single set",
        wrong3: "Best of 7",
      },
    ],
  },
  {
    id: "olympics",
    title: "Athletics / Olympics",
    questions: [
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
        id: "s36",
        text: "What does a false start result in?",
        correct: "Disqualification",
        wrong1: "Time penalty",
        wrong2: "Warning only",
        wrong3: "Restart without penalty",
      },
      {
        id: "s37",
        text:
          "What event combines running, jumping, and throwing?",
        correct: "Decathlon",
        wrong1: "Triathlon",
        wrong2: "Heptathlon",
        wrong3: "Pentathlon",
      },
      {
        id: "s38",
        text: "How many lanes are on a standard running track?",
        correct: "8",
        wrong1: "6",
        wrong2: "7",
        wrong3: "9",
      },
      {
        id: "s39",
        text:
          "What is the object passed between runners in a relay race?",
        correct: "Baton",
        wrong1: "Stick",
        wrong2: "Flag",
        wrong3: "Marker",
      },
      {
        id: "s40",
        text: "What unit is used to measure throwing events?",
        correct: "Meters",
        wrong1: "Seconds",
        wrong2: "Points",
        wrong3: "Yards",
      },
    ],
  },
  {
    id: "american-football",
    title: "American Football",
    questions: [
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
        text:
          "How many downs does a team have to advance 10 yards?",
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
        id: "s44",
        text: "How long is an NFL game?",
        correct: "60 minutes",
        wrong1: "48 minutes",
        wrong2: "90 minutes",
        wrong3: "75 minutes",
      },
      {
        id: "s45",
        text: "What is the shape of an American football?",
        correct: "Prolate spheroid",
        wrong1: "Sphere",
        wrong2: "Oval",
        wrong3: "Cylinder",
      },
      {
        id: "s46",
        text: "How many players are on the field per team?",
        correct: "11",
        wrong1: "10",
        wrong2: "12",
        wrong3: "9",
      },
      {
        id: "s47",
        text:
          "What is it called when the quarterback is tackled behind the line?",
        correct: "Sack",
        wrong1: "Tackle",
        wrong2: "Blitz",
        wrong3: "Safety",
      },
      {
        id: "s48",
        text: "What does MVP stand for?",
        correct: "Most Valuable Player",
        wrong1: "Most Versatile Player",
        wrong2: "Main Valuable Person",
        wrong3: "Major Victory Player",
      },
      {
        id: "s49",
        text: "How many points is a field goal worth?",
        correct: "3",
        wrong1: "2",
        wrong2: "4",
        wrong3: "1",
      },
      {
        id: "s50",
        text:
          "What is the final game of the NFL season called?",
        correct: "Super Bowl",
        wrong1: "Final Bowl",
        wrong2: "Championship Game",
        wrong3: "Grand Final",
      },
    ],
  },
  {
    id: "motorsports",
    title: "Motorsports",
    questions: [
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
        text:
          "How is an F1 race distance defined?",
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
        id: "s54",
        text: "Which country hosts the Monaco Grand Prix?",
        correct: "Monaco",
        wrong1: "France",
        wrong2: "Italy",
        wrong3: "Spain",
      },
      {
        id: "s55",
        text: "What is the tire change area called?",
        correct: "Pit lane",
        wrong1: "Service zone",
        wrong2: "Grid lane",
        wrong3: "Garage lane",
      },
      {
        id: "s56",
        text: "What is pole position?",
        correct: "First place on the starting grid",
        wrong1: "Fastest lap during the race",
        wrong2: "Leader after first lap",
        wrong3: "Winner of previous race",
      },
      {
        id: "s57",
        text: "How many points does a race winner get in F1?",
        correct: "25",
        wrong1: "20",
        wrong2: "15",
        wrong3: "30",
      },
      {
        id: "s58",
        text:
          "What safety device protects the driver’s head in F1?",
        correct: "Halo",
        wrong1: "Cage",
        wrong2: "Shield",
        wrong3: "Ring",
      },
      {
        id: "s59",
        text:
          "What happens during a safety car period?",
        correct: "Cars slow and bunch up",
        wrong1: "Race is fully stopped",
        wrong2: "Overtaking is encouraged",
        wrong3: "Only leader continues",
      },
      {
        id: "s60",
        text: "What surface are F1 races run on?",
        correct: "Asphalt",
        wrong1: "Gravel",
        wrong2: "Grass",
        wrong3: "Sand",
      },
    ],
  },
  {
    id: "combat",
    title: "Combat Sports",
    questions: [
      {
        id: "s61",
        text:
          "How many rounds are in a standard boxing title fight?",
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
        id: "s63",
        text: "What sport uses an octagonal cage?",
        correct: "MMA",
        wrong1: "Boxing",
        wrong2: "Kickboxing",
        wrong3: "Wrestling",
      },
      {
        id: "s64",
        text:
          "What organization is the largest in MMA?",
        correct: "UFC",
        wrong1: "Bellator",
        wrong2: "ONE Championship",
        wrong3: "PFL",
      },
      {
        id: "s65",
        text: "How many minutes is one MMA round?",
        correct: "5",
        wrong1: "3",
        wrong2: "4",
        wrong3: "6",
      },
      {
        id: "s66",
        text:
          "What belt color represents the highest rank in judo?",
        correct: "Black",
        wrong1: "Brown",
        wrong2: "Red",
        wrong3: "Blue",
      },
      {
        id: "s67",
        text: "What ends a boxing match immediately?",
        correct: "Knockout",
        wrong1: "Warning",
        wrong2: "Low blow",
        wrong3: "Corner throw",
      },
      {
        id: "s68",
        text: "What is a submission?",
        correct: "Forcing opponent to tap out",
        wrong1: "Winning on points",
        wrong2: "Winning by knockout",
        wrong3: "Winning by disqualification",
      },
      {
        id: "s69",
        text: "What does TKO mean?",
        correct: "Technical Knockout",
        wrong1: "Total Knockout",
        wrong2: "Technical Kick-out",
        wrong3: "Timed Knockout",
      },
      {
        id: "s70",
        text: "Which country originated karate?",
        correct: "Japan",
        wrong1: "China",
        wrong2: "Korea",
        wrong3: "Thailand",
      },
    ],
  },
  {
    id: "mixed",
    title: "Mixed / General Sports",
    questions: [
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
        text:
          "How many players are on a volleyball team on court?",
        correct: "6",
        wrong1: "5",
        wrong2: "7",
        wrong3: "8",
      },
      {
        id: "s73",
        text: "What sport is played at Wimbledon?",
        correct: "Tennis",
        wrong1: "Cricket",
        wrong2: "Rugby",
        wrong3: "Golf",
      },
      {
        id: "s74",
        text: "What country invented table tennis?",
        correct: "England",
        wrong1: "China",
        wrong2: "Japan",
        wrong3: "Germany",
      },
      {
        id: "s75",
        text: "What is the maximum break in snooker?",
        correct: "147",
        wrong1: "155",
        wrong2: "140",
        wrong3: "120",
      },
      {
        id: "s76",
        text:
          "What sport uses terms like “strike” and “spare”?",
        correct: "Bowling",
        wrong1: "Baseball",
        wrong2: "Cricket",
        wrong3: "Darts",
      },
      {
        id: "s77",
        text: "What is the duration of a standard rugby match?",
        correct: "80 minutes",
        wrong1: "60 minutes",
        wrong2: "70 minutes",
        wrong3: "90 minutes",
      },
      {
        id: "s78",
        text: "What sport includes the Tour de France?",
        correct: "Cycling",
        wrong1: "Running",
        wrong2: "Triathlon",
        wrong3: "Motorsports",
      },
      {
        id: "s79",
        text: "What is the main objective in golf?",
        correct: "Finish course in fewest strokes",
        wrong1: "Hit the ball the farthest",
        wrong2: "Finish the fastest",
        wrong3: "Get the highest score",
      },
      {
        id: "s80",
        text: "What does VAR stand for in football?",
        correct: "Video Assistant Referee",
        wrong1: "Virtual Assistant Review",
        wrong2: "Video Analysis Replay",
        wrong3: "Verified Action Referee",
      },
    ],
  },
  {
    id: "fun",
    title: "Fun but Legit",
    questions: [
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
      {
        id: "s83",
        text:
          "What is the maximum score in a single dart throw?",
        correct: "60",
        wrong1: "50",
        wrong2: "40",
        wrong3: "100",
      },
      {
        id: "s84",
        text: "Which sport uses a pommel horse?",
        correct: "Gymnastics",
        wrong1: "Equestrian",
        wrong2: "Wrestling",
        wrong3: "CrossFit",
      },
      {
        id: "s85",
        text:
          "What sport is Serena Williams famous for?",
        correct: "Tennis",
        wrong1: "Basketball",
        wrong2: "Athletics",
        wrong3: "Volleyball",
      },
      {
        id: "s86",
        text: "What does a referee use to stop play?",
        correct: "Whistle",
        wrong1: "Flag",
        wrong2: "Card",
        wrong3: "Horn",
      },
      {
        id: "s87",
        text: "What sport is played in the Stanley Cup?",
        correct: "Ice hockey",
        wrong1: "Basketball",
        wrong2: "Baseball",
        wrong3: "American football",
      },
      {
        id: "s88",
        text: "What does a yellow flag mean in F1?",
        correct: "Danger, slow down",
        wrong1: "Race over",
        wrong2: "Overtake allowed",
        wrong3: "Pit lane closed",
      },
      {
        id: "s89",
        text: "What sport includes a slam dunk?",
        correct: "Basketball",
        wrong1: "Volleyball",
        wrong2: "Handball",
        wrong3: "Rugby",
      },
      {
        id: "s90",
        text: "What is the main governing body of world football?",
        correct: "FIFA",
        wrong1: "UEFA",
        wrong2: "IOC",
        wrong3: "FA",
      },
    ],
  },
  {
    id: "final",
    title: "Final Stretch",
    questions: [
      {
        id: "s91",
        text:
          "How many players are on a baseball team on the field?",
        correct: "9",
        wrong1: "8",
        wrong2: "10",
        wrong3: "11",
      },
      {
        id: "s92",
        text: "What sport uses innings?",
        correct: "Baseball",
        wrong1: "Cricket",
        wrong2: "Softball",
        wrong3: "Rugby",
      },
      {
        id: "s93",
        text: "What country dominates sumo wrestling?",
        correct: "Japan",
        wrong1: "China",
        wrong2: "Mongolia",
        wrong3: "Korea",
      },
      {
        id: "s94",
        text: "What is the object hit in baseball?",
        correct: "Ball",
        wrong1: "Puck",
        wrong2: "Shuttlecock",
        wrong3: "Disc",
      },
      {
        id: "s95",
        text:
          "What sport uses a net, shuttlecock, and racket?",
        correct: "Badminton",
        wrong1: "Tennis",
        wrong2: "Squash",
        wrong3: "Table tennis",
      },
      {
        id: "s96",
        text: "What is the highest possible score in gymnastics?",
        correct: "No fixed maximum",
        wrong1: "10.0",
        wrong2: "9.9",
        wrong3: "100",
      },
      {
        id: "s97",
        text: "What sport uses the Davis Cup?",
        correct: "Tennis",
        wrong1: "Rugby",
        wrong2: "Golf",
        wrong3: "Cricket",
      },
      {
        id: "s98",
        text: "What does a draw mean?",
        correct: "Tie",
        wrong1: "Win",
        wrong2: "Loss",
        wrong3: "Forfeit",
      },
      {
        id: "s99",
        text: "What sport includes the Ryder Cup?",
        correct: "Golf",
        wrong1: "Tennis",
        wrong2: "Cricket",
        wrong3: "Rugby",
      },
      {
        id: "s100",
        text: "What is sportsmanship?",
        correct: "Fair and respectful behavior",
        wrong1: "Aggressive play only",
        wrong2: "Winning at all costs",
        wrong3: "Ignoring the rules",
      },
    ],
  },
];

const SPORT_QUIZ_COUNT = 10;
const SPORT_QUIZ_TIME = 20;

const ALL_SPORT_QUESTIONS = SPORT_GROUPS.flatMap((g) =>
  g.questions.map((q) => ({ ...q }))
);

function buildSportQuiz() {
  const shuffled = [...ALL_SPORT_QUESTIONS].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, SPORT_QUIZ_COUNT);
  return picked.map((q) => {
    const opts = [
      { text: q.correct, isCorrect: true },
      { text: q.wrong1, isCorrect: false },
      { text: q.wrong2, isCorrect: false },
      { text: q.wrong3, isCorrect: false },
    ].sort(() => Math.random() - 0.5);
    return { ...q, options: opts };
  });
}

function advanceSportQuiz(state, pickedIndex) {
  const current = state.questions[state.currentIndex];
  const picked =
    typeof pickedIndex === "number" && pickedIndex >= 0
      ? current.options[pickedIndex]
      : null;
  const isCorrect = picked ? picked.isCorrect : false;
  const newAnswers = [
    ...state.answers,
    { questionId: current.id, pickedIndex, isCorrect },
  ];
  const nextIndex = state.currentIndex + 1;
  const finished = nextIndex >= state.questions.length;
  return {
    ...state,
    answers: newAnswers,
    currentIndex: finished ? state.currentIndex : nextIndex,
    timeLeft: finished ? 0 : SPORT_QUIZ_TIME,
    finished,
  };
}

export default function Sport() {
  const nav = useNavigate();
  const location = useLocation();
  const username = window.localStorage.getItem("bf_username") || "guest";
  const storageKey = STORAGE_KEY_PREFIX + username;
  const [customQs, setCustomQs] = useState([]);
  const [view, setView] = useState("start"); // "start" | "play" | "builder"
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCustomQs(parsed.customQs || []);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const addCustom = () => {
    setCustomQs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "",
        correct: "",
        wrong1: "",
        wrong2: "",
        wrong3: "",
      },
    ]);
  };

  const updateCustom = (id, field, value) => {
    setCustomQs((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const saveAll = () => {
    const payload = { customQs, savedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    alert("Sport soruların kaydedildi!");
  };

  const startQuiz = () => {
    const qs = buildSportQuiz();
    setQuiz({
      questions: qs,
      currentIndex: 0,
      timeLeft: SPORT_QUIZ_TIME,
      answers: [],
      finished: false,
    });
    setView("play");
  };

  useEffect(() => {
    if (view !== "start" || quiz || !location.state?.autoStart) return;
    const qs = buildSportQuiz();
    setQuiz({
      questions: qs,
      currentIndex: 0,
      timeLeft: SPORT_QUIZ_TIME,
      answers: [],
      finished: false,
    });
    setView("play");
    nav("/sport", { replace: true, state: {} });
  }, [location.state?.autoStart]);

  if (view === "play" && quiz) {
    return (
      <SportQuizPlay
        quiz={quiz}
        setQuiz={setQuiz}
        onBack={() => nav("/menu")}
        onPlayAgain={startQuiz}
      />
    );
  }

  if (view === "start") {
    return (
      <div className="glass-card glass-card--wide">
        <h1 className="glass-card__title">⚽ Sport Quiz</h1>
        <p className="glass-card__subtitle">
          {SPORT_QUIZ_COUNT} soru, her biri {SPORT_QUIZ_TIME} saniye. Hazır mısın?
        </p>
        <div className="sport-start-actions">
          <button
            type="button"
            className="btn btn-secondary sport-start-btn"
            onClick={startQuiz}
          >
            Quiz'i başlat
          </button>
          <button
            type="button"
            className="menu-footer__link"
            onClick={() => setView("builder")}
          >
            Kendi spor sorularımı ekle / düzenle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--wide">
      <div className="love-menu" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setView("start")}
        >
          ← Quiz'e dön
        </button>
      </div>
      <h2 className="sport-section__title">Kendi Spor Soruların</h2>
      <p className="glass-card__subtitle" style={{ marginBottom: 12 }}>
        Her soru için 1 doğru ve 3 yanlış cevap (şık) yaz. Hepsi senin
        quiz'inde seçenek olarak görünecek.
      </p>

      <div className="quiz-edit-list">
        {customQs.map((q) => (
          <div key={q.id} className="quiz-edit-card">
            <div className="quiz-edit-card__row">
              <label className="choice-label">Soru metni</label>
              <input
                className="text-input choice-input"
                value={q.text}
                onChange={(e) => updateCustom(q.id, "text", e.target.value)}
                placeholder="Örn: Hangi takım 2022 Dünya Kupası'nı kazandı?"
              />
            </div>
            <div className="choice-grid">
              <div className="quiz-edit-card__row choice-row--correct">
                <label className="choice-label">✓ Doğru cevap</label>
                <input
                  className="text-input choice-input"
                  value={q.correct}
                  onChange={(e) => updateCustom(q.id, "correct", e.target.value)}
                  placeholder="Doğru şıkkı yaz"
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">✗ Yanlış cevap 1</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong1}
                  onChange={(e) => updateCustom(q.id, "wrong1", e.target.value)}
                  placeholder="Yanlış şık"
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">✗ Yanlış cevap 2</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong2}
                  onChange={(e) => updateCustom(q.id, "wrong2", e.target.value)}
                  placeholder="Yanlış şık"
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">✗ Yanlış cevap 3</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong3}
                  onChange={(e) => updateCustom(q.id, "wrong3", e.target.value)}
                  placeholder="Yanlış şık"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-ghost" onClick={addCustom}>
        + Yeni spor sorusu ekle
      </button>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-secondary" onClick={saveAll}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

function SportQuizPlay({ quiz, setQuiz, onBack, onPlayAgain }) {
  const current = quiz.questions[quiz.currentIndex];

  useEffect(() => {
    if (quiz.finished) return;
    const id = setInterval(() => {
      setQuiz((prev) => {
        if (!prev || prev.finished) return prev;
        if (prev.timeLeft <= 1) return advanceSportQuiz(prev, null);
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [quiz.finished, quiz.currentIndex, setQuiz]);

  const handlePick = (idx) => {
    if (quiz.finished || quiz.timeLeft <= 0) return;
    setQuiz((prev) => advanceSportQuiz(prev, idx));
  };

  if (quiz.finished) {
    const correctCount = quiz.answers.filter((a) => a.isCorrect).length;
    const total = quiz.questions.length;
    const pct = Math.round((correctCount / total) * 100);
    const sportGiphy =
      pct >= 80 ? "/giphy.gif" : pct >= 60 ? "/giphy2.gif" : pct >= 40 ? "/giphy3.gif" : "/giphy1.gif";
    return (
      <div className="glass-card glass-card--wide">
        <div className="love-quiz-results">
          <div className="love-results__content">
            <img src={sportGiphy} alt="" className="result-giphy" />
            <div className="love-results__emoji">⚽</div>
            <h1 className="glass-card__title">Sonuç</h1>
            <div className="love-results__score" style={{ color: "#22c55e" }}>
              {correctCount} / {total}
            </div>
            <div className="love-results__percentage" style={{ color: "#22c55e" }}>
              %{pct}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-secondary" onClick={onPlayAgain}>
                Tekrar oyna
              </button>
              <button type="button" className="btn btn-ghost" onClick={onBack}>
                Menüye dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = quiz.questions.length;
  return (
    <div className="glass-card glass-card--wide">
      <div className="love-quiz">
        <div className="question-layout">
          <div className="question-header">
            <div>
              <div className="round-label">Soru</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {quiz.currentIndex + 1} / {total}
              </div>
            </div>
            <div className="timer-chip">
              ⏱ {quiz.timeLeft}s / {SPORT_QUIZ_TIME}s
            </div>
          </div>
          <div className="timer-bar-wrapper">
            <div
              className="timer-bar-fill"
              style={{ width: `${(quiz.timeLeft / SPORT_QUIZ_TIME) * 100}%` }}
            />
          </div>
          <div className="question-card">
            <div className="question-text">{current.text}</div>
            {current.image && (
              <img src={current.image} alt="" className="sport-question__image" style={{ marginTop: 8 }} />
            )}
            <div className="answer-list">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="answer-btn"
                  onClick={() => handlePick(idx)}
                  disabled={quiz.timeLeft <= 0}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

