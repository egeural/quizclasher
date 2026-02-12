import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY_PREFIX = "bf_historyquiz_";

const HISTORY_GROUPS = [
  {
    id: "ancient",
    title: "Ancient History",
    questions: [
      { id: "h1", text: "Which civilization built the pyramids of Giza?", correct: "Ancient Egyptians", wrong1: "Ancient Greeks", wrong2: "Mesopotamians", wrong3: "Romans" },
      { id: "h2", text: "Who was the first emperor of Rome?", correct: "Augustus", wrong1: "Julius Caesar", wrong2: "Nero", wrong3: "Constantine" },
      { id: "h3", text: "Where did democracy originate?", correct: "Ancient Athens", wrong1: "Rome", wrong2: "Sparta", wrong3: "Persia" },
      { id: "h4", text: "What writing system was used in Mesopotamia?", correct: "Cuneiform", wrong1: "Hieroglyphics", wrong2: "Latin", wrong3: "Phoenician" },
      { id: "h5", text: "Which river was central to Egyptian civilization?", correct: "Nile", wrong1: "Tigris", wrong2: "Euphrates", wrong3: "Indus" },
      { id: "h6", text: "Who was the king of the Macedonian Empire?", correct: "Alexander the Great", wrong1: "Darius", wrong2: "Philip II", wrong3: "Pyrrhus" },
      { id: "h7", text: "What city was destroyed by Mount Vesuvius in 79 AD?", correct: "Pompeii", wrong1: "Rome", wrong2: "Herculaneum", wrong3: "Naples" },
      { id: "h8", text: "What empire built the Colosseum?", correct: "Roman Empire", wrong1: "Byzantine Empire", wrong2: "Greek", wrong3: "Persian" },
      { id: "h9", text: "What code is one of the earliest legal systems?", correct: "Code of Hammurabi", wrong1: "Twelve Tables", wrong2: "Justinian Code", wrong3: "Draco's Code" },
      { id: "h10", text: "Who wrote The Iliad?", correct: "Homer", wrong1: "Virgil", wrong2: "Hesiod", wrong3: "Sophocles" },
      { id: "h11", text: "What ancient civilization built Machu Picchu?", correct: "Inca", wrong1: "Aztec", wrong2: "Maya", wrong3: "Olmec" },
      { id: "h12", text: "Which god was the Greek god of war?", correct: "Ares", wrong1: "Zeus", wrong2: "Apollo", wrong3: "Poseidon" },
      { id: "h13", text: "What city-state fought Sparta in the Peloponnesian War?", correct: "Athens", wrong1: "Thebes", wrong2: "Corinth", wrong3: "Argos" },
      { id: "h14", text: "What was the main language of the Roman Empire?", correct: "Latin", wrong1: "Greek", wrong2: "Aramaic", wrong3: "Egyptian" },
      { id: "h15", text: "Which ancient empire used satraps?", correct: "Persian Empire", wrong1: "Roman", wrong2: "Macedonian", wrong3: "Egyptian" },
      { id: "h16", text: "What was the capital of the Byzantine Empire?", correct: "Constantinople", wrong1: "Rome", wrong2: "Alexandria", wrong3: "Antioch" },
      { id: "h17", text: "What ancient civilization built ziggurats?", correct: "Sumerians", wrong1: "Egyptians", wrong2: "Babylonians", wrong3: "Assyrians" },
      { id: "h18", text: "Who was Cleopatra the ruler of?", correct: "Egypt", wrong1: "Rome", wrong2: "Macedonia", wrong3: "Syria" },
      { id: "h19", text: "What material marked the Bronze Age?", correct: "Bronze", wrong1: "Iron", wrong2: "Copper", wrong3: "Stone" },
      { id: "h20", text: "Which ancient text is central to Hinduism?", correct: "Vedas", wrong1: "Bible", wrong2: "Quran", wrong3: "Tripitaka" },
      { id: "h21", text: "What ancient civilization developed paper?", correct: "China", wrong1: "Egypt", wrong2: "Greece", wrong3: "India" },
      { id: "h22", text: "Who was the teacher of Alexander the Great?", correct: "Aristotle", wrong1: "Plato", wrong2: "Socrates", wrong3: "Pythagoras" },
      { id: "h23", text: "What empire fought Rome in the Punic Wars?", correct: "Carthage", wrong1: "Persia", wrong2: "Macedonia", wrong3: "Egypt" },
      { id: "h24", text: "What ancient sport inspired the Olympics?", correct: "Greek athletic contests", wrong1: "Roman gladiator games", wrong2: "Egyptian wrestling", wrong3: "Persian chariot racing" },
      { id: "h25", text: "What structure marked Rome's center of life?", correct: "Forum", wrong1: "Colosseum", wrong2: "Circus", wrong3: "Pantheon" },
      { id: "h26", text: "What ancient people built Stonehenge?", correct: "Neolithic Britons", wrong1: "Romans", wrong2: "Celts", wrong3: "Druids" },
      { id: "h27", text: "What was Rome originally ruled by before emperors?", correct: "Kings and Republic", wrong1: "Consuls only", wrong2: "Senate only", wrong3: "Tribunes" },
      { id: "h28", text: "What ancient civilization used hieroglyphs?", correct: "Egyptians", wrong1: "Sumerians", wrong2: "Chinese", wrong3: "Mayans" },
      { id: "h29", text: "What was the main trade route connecting East and West?", correct: "Silk Road", wrong1: "Amber Road", wrong2: "Incense Route", wrong3: "Spice Route" },
      { id: "h30", text: "Who was the first lawgiver of Athens?", correct: "Draco", wrong1: "Solon", wrong2: "Cleisthenes", wrong3: "Pericles" },
    ],
  },
  {
    id: "medieval",
    title: "Middle Ages",
    questions: [
      { id: "h31", text: "What year did the Western Roman Empire fall?", correct: "476", wrong1: "410", wrong2: "455", wrong3: "500" },
      { id: "h32", text: "What system dominated medieval Europe?", correct: "Feudalism", wrong1: "Capitalism", wrong2: "Republicanism", wrong3: "Tribalism" },
      { id: "h33", text: "Who was crowned Holy Roman Emperor in 800?", correct: "Charlemagne", wrong1: "Otto I", wrong2: "Charles V", wrong3: "Frederick Barbarossa" },
      { id: "h34", text: "What pandemic devastated Europe in the 14th century?", correct: "Black Death", wrong1: "Smallpox", wrong2: "Cholera", wrong3: "Spanish Flu" },
      { id: "h35", text: "What wars were fought over the Holy Land?", correct: "Crusades", wrong1: "Reconquista", wrong2: "Hundred Years' War", wrong3: "Wars of the Roses" },
      { id: "h36", text: "What was the medieval warrior class called?", correct: "Knights", wrong1: "Vassals", wrong2: "Serfs", wrong3: "Burghers" },
      { id: "h37", text: "What was the primary language of the Church?", correct: "Latin", wrong1: "Greek", wrong2: "Hebrew", wrong3: "Old English" },
      { id: "h38", text: "What document limited the English king in 1215?", correct: "Magna Carta", wrong1: "Bill of Rights", wrong2: "Domesday Book", wrong3: "Common Law" },
      { id: "h39", text: "What empire replaced Rome in the East?", correct: "Byzantine Empire", wrong1: "Ottoman", wrong2: "Holy Roman", wrong3: "Persian" },
      { id: "h40", text: "Who wrote The Divine Comedy?", correct: "Dante Alighieri", wrong1: "Petrarch", wrong2: "Boccaccio", wrong3: "Chaucer" },
      { id: "h41", text: "What was the capital of the Ottoman Empire after 1453?", correct: "Constantinople", wrong1: "Edirne", wrong2: "Bursa", wrong3: "Ankara" },
      { id: "h42", text: "What agricultural system used open fields?", correct: "Manorial system", wrong1: "Enclosure", wrong2: "Plantation", wrong3: "Collective farming" },
      { id: "h43", text: "Who led France during the Hundred Years' War?", correct: "Joan of Arc", wrong1: "Eleanor of Aquitaine", wrong2: "Isabella of Castile", wrong3: "Margaret of Anjou" },
      { id: "h44", text: "What religion spread rapidly through Arabia in the 7th century?", correct: "Islam", wrong1: "Christianity", wrong2: "Zoroastrianism", wrong3: "Judaism" },
      { id: "h45", text: "What was a vassal?", correct: "A land-holding subordinate", wrong1: "A serf", wrong2: "A bishop", wrong3: "A merchant" },
      { id: "h46", text: "What medieval institution preserved knowledge?", correct: "Monasteries", wrong1: "Universities only", wrong2: "Courts", wrong3: "Guilds" },
      { id: "h47", text: "What weapon changed medieval warfare?", correct: "Longbow", wrong1: "Crossbow", wrong2: "Catapult", wrong3: "Trebuchet" },
      { id: "h48", text: "What empire controlled much of Anatolia?", correct: "Seljuk Empire", wrong1: "Byzantine", wrong2: "Ottoman", wrong3: "Persian" },
      { id: "h49", text: "What title did Muslim rulers often hold?", correct: "Caliph", wrong1: "Sultan", wrong2: "Emir", wrong3: "Shah" },
      { id: "h50", text: "What city was a major medieval trade hub in Italy?", correct: "Venice", wrong1: "Florence", wrong2: "Genoa", wrong3: "Milan" },
      { id: "h51", text: "What group fought during the Reconquista?", correct: "Christians and Muslims", wrong1: "Catholics and Protestants", wrong2: "France and England", wrong3: "Papacy and Empire" },
      { id: "h52", text: "What code governed knights?", correct: "Chivalry", wrong1: "Canon law", wrong2: "Feudal law", wrong3: "Magna Carta" },
      { id: "h53", text: "What was the medieval plague caused by?", correct: "Bacteria", wrong1: "Virus", wrong2: "Fungus", wrong3: "Parasite" },
      { id: "h54", text: "What was the main medieval economic activity?", correct: "Agriculture", wrong1: "Trade", wrong2: "Craft", wrong3: "Mining" },
      { id: "h55", text: "What structure symbolized feudal power?", correct: "Castle", wrong1: "Cathedral", wrong2: "Monastery", wrong3: "Town hall" },
      { id: "h56", text: "Who controlled trade routes in the Mediterranean?", correct: "Italian city-states", wrong1: "Byzantine Empire", wrong2: "Ottomans", wrong3: "Spanish" },
      { id: "h57", text: "What invention improved navigation?", correct: "Compass", wrong1: "Astrolabe", wrong2: "Sextant", wrong3: "Chronometer" },
      { id: "h58", text: "What empire used Janissaries?", correct: "Ottoman Empire", wrong1: "Byzantine", wrong2: "Mamluk", wrong3: "Safavid" },
      { id: "h59", text: "What was a guild?", correct: "Association of craftsmen", wrong1: "Religious order", wrong2: "Military unit", wrong3: "Royal council" },
      { id: "h60", text: "What period followed the fall of Rome?", correct: "Middle Ages", wrong1: "Renaissance", wrong2: "Enlightenment", wrong3: "Industrial Age" },
    ],
  },
  {
    id: "earlymodern",
    title: "Early Modern",
    questions: [
      { id: "h61", text: "Who began the Protestant Reformation?", correct: "Martin Luther", wrong1: "John Calvin", wrong2: "Henry VIII", wrong3: "Erasmus" },
      { id: "h62", text: "What invention spread ideas rapidly?", correct: "Printing press", wrong1: "Telegraph", wrong2: "Radio", wrong3: "Internet" },
      { id: "h63", text: "Who wrote The Prince?", correct: "Niccolò Machiavelli", wrong1: "Thomas Hobbes", wrong2: "John Locke", wrong3: "Rousseau" },
      { id: "h64", text: "What year was Constantinople conquered?", correct: "1453", wrong1: "1204", wrong2: "1461", wrong3: "1517" },
      { id: "h65", text: "Which empire conquered Constantinople?", correct: "Ottoman Empire", wrong1: "Byzantine", wrong2: "Venetian", wrong3: "Persian" },
      { id: "h66", text: "Who reached the Americas in 1492?", correct: "Christopher Columbus", wrong1: "Vasco da Gama", wrong2: "Magellan", wrong3: "Amerigo Vespucci" },
      { id: "h67", text: "What movement emphasized reason?", correct: "Enlightenment", wrong1: "Renaissance", wrong2: "Romanticism", wrong3: "Reformation" },
      { id: "h68", text: "Who was the Sun King?", correct: "Louis XIV", wrong1: "Louis XVI", wrong2: "Henry IV", wrong3: "Philip II" },
      { id: "h69", text: "What war ended with Peace of Westphalia?", correct: "Thirty Years' War", wrong1: "Seven Years' War", wrong2: "War of Spanish Succession", wrong3: "Napoleonic Wars" },
      { id: "h70", text: "What empire ruled India before Britain?", correct: "Mughal Empire", wrong1: "Maurya", wrong2: "Gupta", wrong3: "Delhi Sultanate" },
      { id: "h71", text: "What was mercantilism?", correct: "Economic nationalism", wrong1: "Free trade", wrong2: "Socialism", wrong3: "Feudalism" },
      { id: "h72", text: "What was the main goal of colonialism?", correct: "Wealth", wrong1: "Religion", wrong2: "Science", wrong3: "Diplomacy" },
      { id: "h73", text: "What revolution began in England's factories?", correct: "Industrial Revolution", wrong1: "Agricultural", wrong2: "Scientific", wrong3: "Digital" },
      { id: "h74", text: "Who led England during the Spanish Armada?", correct: "Elizabeth I", wrong1: "Mary I", wrong2: "James I", wrong3: "Henry VIII" },
      { id: "h75", text: "What scientific figure proposed heliocentrism?", correct: "Copernicus", wrong1: "Galileo", wrong2: "Kepler", wrong3: "Newton" },
      { id: "h76", text: "What was the dominant Enlightenment political idea?", correct: "Individual rights", wrong1: "Divine right", wrong2: "Absolutism", wrong3: "Theocracy" },
      { id: "h77", text: "What empire dominated South America?", correct: "Spanish Empire", wrong1: "Portuguese", wrong2: "British", wrong3: "Dutch" },
      { id: "h78", text: "What crop fueled population growth?", correct: "Potato", wrong1: "Wheat", wrong2: "Rice", wrong3: "Corn" },
      { id: "h79", text: "What invention powered factories?", correct: "Steam engine", wrong1: "Water wheel", wrong2: "Windmill", wrong3: "Electric motor" },
      { id: "h80", text: "Who improved the steam engine?", correct: "James Watt", wrong1: "Thomas Newcomen", wrong2: "George Stephenson", wrong3: "Richard Trevithick" },
      { id: "h81", text: "What class emerged during industrialization?", correct: "Middle class", wrong1: "Nobility", wrong2: "Peasantry", wrong3: "Clergy" },
      { id: "h82", text: "What ideology opposed monarchies?", correct: "Liberalism", wrong1: "Conservatism", wrong2: "Absolutism", wrong3: "Feudalism" },
      { id: "h83", text: "What trade connected Africa, Europe, Americas?", correct: "Triangular trade", wrong1: "Silk Road", wrong2: "Spice trade", wrong3: "Amber Road" },
      { id: "h84", text: "What was absolutism?", correct: "Total monarchy", wrong1: "Constitutional monarchy", wrong2: "Republic", wrong3: "Theocracy" },
      { id: "h85", text: "What book challenged Church authority?", correct: "Bible (vernacular translations)", wrong1: "The Prince", wrong2: "Utopia", wrong3: "Leviathan" },
      { id: "h86", text: "What city was center of Renaissance art?", correct: "Florence", wrong1: "Rome", wrong2: "Venice", wrong3: "Milan" },
      { id: "h87", text: "Who painted the Mona Lisa?", correct: "Leonardo da Vinci", wrong1: "Michelangelo", wrong2: "Raphael", wrong3: "Titian" },
      { id: "h88", text: "What empire ruled Austria-Hungary?", correct: "Habsburg Empire", wrong1: "Hohenzollern", wrong2: "Romanov", wrong3: "Ottoman" },
      { id: "h89", text: "What philosophy emphasized social contracts?", correct: "Enlightenment thought", wrong1: "Scholasticism", wrong2: "Stoicism", wrong3: "Existentialism" },
      { id: "h90", text: "What technology improved warfare accuracy?", correct: "Gunpowder", wrong1: "Steel", wrong2: "Compass", wrong3: "Printing" },
    ],
  },
  {
    id: "modern",
    title: "Modern & Contemporary",
    questions: [
      { id: "h91", text: "What year did the French Revolution begin?", correct: "1789", wrong1: "1776", wrong2: "1799", wrong3: "1815" },
      { id: "h92", text: "Who was the first US president?", correct: "George Washington", wrong1: "Thomas Jefferson", wrong2: "John Adams", wrong3: "Benjamin Franklin" },
      { id: "h93", text: "What document declared US independence?", correct: "Declaration of Independence", wrong1: "Constitution", wrong2: "Bill of Rights", wrong3: "Articles of Confederation" },
      { id: "h94", text: "Who was defeated at Waterloo?", correct: "Napoleon Bonaparte", wrong1: "Wellington", wrong2: "Bismarck", wrong3: "Metternich" },
      { id: "h95", text: "What war ended slavery in the US?", correct: "American Civil War", wrong1: "Revolutionary War", wrong2: "War of 1812", wrong3: "Mexican-American War" },
      { id: "h96", text: "What year did World War I start?", correct: "1914", wrong1: "1918", wrong2: "1939", wrong3: "1917" },
      { id: "h97", text: "What event triggered WWI?", correct: "Assassination of Archduke Franz Ferdinand", wrong1: "Invasion of Poland", wrong2: "Sinking of Lusitania", wrong3: "Zimmermann Telegram" },
      { id: "h98", text: "What treaty ended WWI?", correct: "Treaty of Versailles", wrong1: "Treaty of Tordesillas", wrong2: "Treaty of Westphalia", wrong3: "Potsdam Agreement" },
      { id: "h99", text: "What ideology defined Nazi Germany?", correct: "Fascism", wrong1: "Communism", wrong2: "Socialism", wrong3: "Liberalism" },
      { id: "h100", text: "Who led the USSR during WWII?", correct: "Joseph Stalin", wrong1: "Lenin", wrong2: "Trotsky", wrong3: "Khrushchev" },
      { id: "h101", text: "What year did WWII end?", correct: "1945", wrong1: "1944", wrong2: "1946", wrong3: "1943" },
      { id: "h102", text: "What attack brought the US into WWII?", correct: "Pearl Harbor", wrong1: "D-Day", wrong2: "Midway", wrong3: "Hiroshima" },
      { id: "h103", text: "What genocide occurred during WWII?", correct: "Holocaust", wrong1: "Armenian", wrong2: "Rwanda", wrong3: "Cambodian" },
      { id: "h104", text: "What organization formed after WWII?", correct: "United Nations", wrong1: "League of Nations", wrong2: "NATO", wrong3: "EU" },
      { id: "h105", text: "What conflict followed WWII ideologically?", correct: "Cold War", wrong1: "Korean War", wrong2: "Vietnam War", wrong3: "Gulf War" },
      { id: "h106", text: "What wall fell in 1989?", correct: "Berlin Wall", wrong1: "Great Wall", wrong2: "Warsaw Wall", wrong3: "Iron Curtain" },
      { id: "h107", text: "What countries led Cold War sides?", correct: "USA and USSR", wrong1: "USA and China", wrong2: "UK and Germany", wrong3: "France and Russia" },
      { id: "h108", text: "What alliance opposed NATO?", correct: "Warsaw Pact", wrong1: "Axis", wrong2: "Triple Entente", wrong3: "COMECON" },
      { id: "h109", text: "What year did the Soviet Union collapse?", correct: "1991", wrong1: "1989", wrong2: "1990", wrong3: "1992" },
      { id: "h110", text: "Who led India's non-violent independence?", correct: "Mahatma Gandhi", wrong1: "Nehru", wrong2: "Jinnah", wrong3: "Bose" },
      { id: "h111", text: "What war occurred in Southeast Asia (1955–75)?", correct: "Vietnam War", wrong1: "Korean War", wrong2: "Cambodian", wrong3: "Laotian" },
      { id: "h112", text: "What movement fought racial segregation in the US?", correct: "Civil Rights Movement", wrong1: "Suffrage", wrong2: "Abolition", wrong3: "Labor movement" },
      { id: "h113", text: "Who was assassinated in 1963?", correct: "John F. Kennedy", wrong1: "Martin Luther King Jr.", wrong2: "Robert Kennedy", wrong3: "Malcolm X" },
      { id: "h114", text: "What organization governs Europe economically?", correct: "European Union", wrong1: "NATO", wrong2: "Council of Europe", wrong3: "EFTA" },
      { id: "h115", text: "What year did EU officially form?", correct: "1993", wrong1: "1957", wrong2: "1992", wrong3: "2002" },
      { id: "h116", text: "What attack occurred on Sept 11, 2001?", correct: "9/11 attacks", wrong1: "Oklahoma City", wrong2: "London bombings", wrong3: "Madrid train bombings" },
      { id: "h117", text: "What followed 9/11 globally?", correct: "War on Terror", wrong1: "Cold War", wrong2: "Gulf War", wrong3: "Arab Spring" },
      { id: "h118", text: "What conflict began in Ukraine in 2014?", correct: "Crimea annexation", wrong1: "Donbas only", wrong2: "Full invasion", wrong3: "Maidan" },
      { id: "h119", text: "What technology transformed warfare recently?", correct: "Drones", wrong1: "Nuclear", wrong2: "Satellites", wrong3: "Cyber" },
      { id: "h120", text: "What pandemic began in 2019?", correct: "COVID-19", wrong1: "SARS", wrong2: "Swine flu", wrong3: "Ebola" },
      { id: "h121", text: "What ideology promotes free markets?", correct: "Capitalism", wrong1: "Socialism", wrong2: "Communism", wrong3: "Mercantilism" },
      { id: "h122", text: "What ideology promotes state ownership?", correct: "Communism", wrong1: "Socialism", wrong2: "Fascism", wrong3: "Liberalism" },
      { id: "h123", text: "What revolution involved social media heavily?", correct: "Arab Spring", wrong1: "Color Revolutions", wrong2: "Orange Revolution", wrong3: "Velvet Revolution" },
      { id: "h124", text: "What year did China become communist?", correct: "1949", wrong1: "1948", wrong2: "1950", wrong3: "1921" },
      { id: "h125", text: "Who founded the People's Republic of China?", correct: "Mao Zedong", wrong1: "Deng Xiaoping", wrong2: "Chiang Kai-shek", wrong3: "Zhou Enlai" },
      { id: "h126", text: "What system replaced feudalism?", correct: "Capitalism", wrong1: "Socialism", wrong2: "Mercantilism", wrong3: "Republicanism" },
      { id: "h127", text: "What event symbolized globalization?", correct: "Internet expansion", wrong1: "Columbian Exchange", wrong2: "Industrial Revolution", wrong3: "Container shipping" },
      { id: "h128", text: "What continent was most colonized?", correct: "Africa", wrong1: "Asia", wrong2: "Americas", wrong3: "Oceania" },
      { id: "h129", text: "What movement pushed women's voting rights?", correct: "Suffrage movement", wrong1: "Abolition", wrong2: "Labor", wrong3: "Civil rights" },
      { id: "h130", text: "What century saw nuclear weapons?", correct: "20th", wrong1: "19th", wrong2: "21st", wrong3: "18th" },
      { id: "h131", text: "What doctrine aimed to stop communism?", correct: "Containment", wrong1: "Détente", wrong2: "Rollback", wrong3: "Brinkmanship" },
      { id: "h132", text: "What organization regulates global trade?", correct: "WTO", wrong1: "IMF", wrong2: "World Bank", wrong3: "UN" },
      { id: "h133", text: "What revolution digitized information?", correct: "Digital Revolution", wrong1: "Industrial", wrong2: "Information", wrong3: "Green" },
      { id: "h134", text: "What country left the EU in 2020?", correct: "United Kingdom", wrong1: "France", wrong2: "Germany", wrong3: "Italy" },
      { id: "h135", text: "What term describes climate-driven politics?", correct: "Environmentalism", wrong1: "Conservation", wrong2: "Sustainability", wrong3: "Greenwashing" },
      { id: "h136", text: "What war involved Korea in the 1950s?", correct: "Korean War", wrong1: "Vietnam", wrong2: "Sino-Japanese", wrong3: "Russo-Japanese" },
      { id: "h137", text: "What alliance includes Turkey?", correct: "NATO", wrong1: "Warsaw Pact", wrong2: "EU", wrong3: "ASEAN" },
      { id: "h138", text: "What conflict defined the Middle East since 1948?", correct: "Arab-Israeli conflict", wrong1: "Iran-Iraq", wrong2: "Gulf Wars", wrong3: "Syrian Civil War" },
      { id: "h139", text: "What ideology supports nationalism?", correct: "Nationalism", wrong1: "Internationalism", wrong2: "Cosmopolitanism", wrong3: "Federalism" },
      { id: "h140", text: "What empire collapsed after WWI?", correct: "Ottoman Empire", wrong1: "Austro-Hungarian", wrong2: "Russian", wrong3: "German" },
      { id: "h141", text: "What country became unified in 1871?", correct: "Germany", wrong1: "Italy", wrong2: "USA", wrong3: "Canada" },
      { id: "h142", text: "What movement ended apartheid?", correct: "Anti-apartheid movement", wrong1: "Civil rights", wrong2: "Decolonization", wrong3: "Pan-Africanism" },
      { id: "h143", text: "Who was South Africa's first Black president?", correct: "Nelson Mandela", wrong1: "Desmond Tutu", wrong2: "F.W. de Klerk", wrong3: "Thabo Mbeki" },
      { id: "h144", text: "What period followed the Cold War?", correct: "Post-Cold War era", wrong1: "New World Order", wrong2: "Globalization", wrong3: "Unipolar moment" },
      { id: "h145", text: "What technology dominates modern warfare?", correct: "Cyber warfare", wrong1: "Drones", wrong2: "Nuclear", wrong3: "Conventional" },
      { id: "h146", text: "What term describes rule by the people?", correct: "Democracy", wrong1: "Republic", wrong2: "Oligarchy", wrong3: "Monarchy" },
      { id: "h147", text: "What institution preserves historical records?", correct: "Archives", wrong1: "Museums", wrong2: "Libraries", wrong3: "Universities" },
      { id: "h148", text: "What event started globalization acceleration?", correct: "Industrialization", wrong1: "Columbian Exchange", wrong2: "Internet", wrong3: "Containerization" },
      { id: "h149", text: "What is historical revisionism?", correct: "Reinterpreting history", wrong1: "Denying history", wrong2: "Preserving history", wrong3: "Teaching history" },
      { id: "h150", text: "What is history?", correct: "Study of the past", wrong1: "Record of events", wrong2: "Memory of nations", wrong3: "Chronicle of wars" },
    ],
  },
];

const HISTORY_QUIZ_COUNT = 10;
const HISTORY_QUIZ_TIME = 20;

const ALL_HISTORY_QUESTIONS = HISTORY_GROUPS.flatMap((g) =>
  g.questions.map((q) => ({ ...q }))
);

function buildHistoryQuiz() {
  const shuffled = [...ALL_HISTORY_QUESTIONS].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, HISTORY_QUIZ_COUNT);
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

function advanceHistoryQuiz(state, pickedIndex) {
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
    timeLeft: finished ? 0 : HISTORY_QUIZ_TIME,
    finished,
  };
}

export default function History() {
  const nav = useNavigate();
  const location = useLocation();
  const username = window.localStorage.getItem("bf_username") || "guest";
  const storageKey = STORAGE_KEY_PREFIX + username;
  const [customQs, setCustomQs] = useState([]);
  const [view, setView] = useState("start");
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
      { id: Date.now().toString(), text: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
    ]);
  };

  const updateCustom = (id, field, value) => {
    setCustomQs((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const saveAll = () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ customQs, savedAt: new Date().toISOString() })
    );
    alert(t("quiz.saved"));
  };

  const startQuiz = () => {
    const qs = buildHistoryQuiz();
    setQuiz({
      questions: qs,
      currentIndex: 0,
      timeLeft: HISTORY_QUIZ_TIME,
      answers: [],
      finished: false,
    });
    setView("play");
  };

  useEffect(() => {
    if (view !== "start" || quiz || !location.state?.autoStart) return;
    const qs = buildHistoryQuiz();
    setQuiz({
      questions: qs,
      currentIndex: 0,
      timeLeft: HISTORY_QUIZ_TIME,
      answers: [],
      finished: false,
    });
    setView("play");
    nav("/history", { replace: true, state: {} });
  }, [location.state?.autoStart]);

  if (view === "play" && quiz) {
    return (
      <HistoryQuizPlay
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
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="menu-back"
            onClick={() => nav("/menu")}
          >
            {t("menu.back")}
          </button>
        </div>
        <h1 className="glass-card__title">📜 {t("quiz.historyQuiz")}</h1>
        <p className="glass-card__subtitle">
          {t("quiz.historySubtitle", { count: HISTORY_QUIZ_COUNT, time: HISTORY_QUIZ_TIME })}
        </p>
        <div className="sport-start-actions">
          <button type="button" className="btn btn-secondary sport-start-btn" onClick={startQuiz}>
            {t("quiz.startQuiz")}
          </button>
          <button
            type="button"
            className="menu-footer__link"
            onClick={() => setView("builder")}
          >
            {t("quiz.addEditHistoryQuestions")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card--wide">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={() => setView("start")}
        >
          {t("menu.back")}
        </button>
      </div>
      <h2 className="sport-section__title">{t("quiz.yourHistoryQuestions")}</h2>
      <p className="glass-card__subtitle" style={{ marginBottom: 12 }}>
        {t("quiz.historyBuilderDesc")}
      </p>
      <div className="quiz-edit-list">
        {customQs.map((q) => (
          <div key={q.id} className="quiz-edit-card">
            <div className="quiz-edit-card__row">
              <label className="choice-label">{t("createOwn.questionText")}</label>
              <input
                className="text-input choice-input"
                value={q.text}
                onChange={(e) => updateCustom(q.id, "text", e.target.value)}
                placeholder={t("quiz.historyQuestionPlaceholder")}
              />
            </div>
            <div className="choice-grid">
              <div className="quiz-edit-card__row choice-row--correct">
                <label className="choice-label">{t("createOwn.correctAnswer")}</label>
                <input
                  className="text-input choice-input"
                  value={q.correct}
                  onChange={(e) => updateCustom(q.id, "correct", e.target.value)}
                  placeholder={t("createOwn.correctPlaceholder")}
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">{t("createOwn.wrongAnswer", { num: 1 })}</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong1}
                  onChange={(e) => updateCustom(q.id, "wrong1", e.target.value)}
                  placeholder={t("createOwn.wrongPlaceholder")}
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">{t("createOwn.wrongAnswer", { num: 2 })}</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong2}
                  onChange={(e) => updateCustom(q.id, "wrong2", e.target.value)}
                  placeholder={t("createOwn.wrongPlaceholder")}
                />
              </div>
              <div className="quiz-edit-card__row">
                <label className="choice-label">{t("createOwn.wrongAnswer", { num: 3 })}</label>
                <input
                  className="text-input choice-input"
                  value={q.wrong3}
                  onChange={(e) => updateCustom(q.id, "wrong3", e.target.value)}
                  placeholder={t("createOwn.wrongPlaceholder")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" onClick={addCustom}>
        {t("quiz.addHistoryQuestion")}
      </button>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
        <button type="button" className="btn btn-secondary" onClick={saveAll}>
          {t("createOwn.save")}
        </button>
      </div>
    </div>
  );
}

function HistoryQuizPlay({ quiz, setQuiz, onBack, onPlayAgain }) {
  const { t } = useLanguage();
  const current = quiz.questions[quiz.currentIndex];

  useEffect(() => {
    if (quiz.finished) return;
    const id = setInterval(() => {
      setQuiz((prev) => {
        if (!prev || prev.finished) return prev;
        if (prev.timeLeft <= 1) return advanceHistoryQuiz(prev, null);
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [quiz.finished, quiz.currentIndex, setQuiz]);

  const handlePick = (idx) => {
    if (quiz.finished || quiz.timeLeft <= 0) return;
    setQuiz((prev) => advanceHistoryQuiz(prev, idx));
  };

  if (quiz.finished) {
    const correctCount = quiz.answers.filter((a) => a.isCorrect).length;
    const total = quiz.questions.length;
    const pct = Math.round((correctCount / total) * 100);
    const historyGiphy =
      pct >= 80 ? "/giphy4.gif" : pct >= 60 ? "/giphy5.gif" : pct >= 40 ? "/giphy6.gif" : "/giphy7.gif";
    return (
      <div className="glass-card glass-card--wide">
        <div className="love-quiz-results">
          <div className="love-results__content">
            <img src={historyGiphy} alt="" className="result-giphy" />
            <div className="love-results__emoji">📜</div>
            <h1 className="glass-card__title">{t("quiz.result")}</h1>
            <div className="love-results__score" style={{ color: "#FFB703" }}>
              {correctCount} / {total}
            </div>
            <div className="love-results__percentage" style={{ color: "#FFB703" }}>
              %{pct}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-secondary" onClick={onPlayAgain}>
                {t("quiz.playAgain")}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onBack}>
                {t("menu.back")}
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
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={onBack}
        >
          {t("menu.back")}
        </button>
      </div>
      <div className="love-quiz">
        <div className="question-layout">
          <div className="question-header">
            <div>
              <div className="round-label">{t("quiz.question")}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {quiz.currentIndex + 1} / {total}
              </div>
            </div>
            <div className="timer-chip">
              ⏱ {quiz.timeLeft}s / {HISTORY_QUIZ_TIME}s
            </div>
          </div>
          <div className="timer-bar-wrapper">
            <div
              className="timer-bar-fill"
              style={{ width: `${(quiz.timeLeft / HISTORY_QUIZ_TIME) * 100}%` }}
            />
          </div>
          <div className="question-card">
            <div className="question-text">{current.text}</div>
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
