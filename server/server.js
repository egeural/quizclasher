const http = require("http");
const WebSocket = require("ws");
const url = require("url");
const querystring = require("querystring");
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "egeural2005@gmail.com";

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || ADMIN_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || "";

// Create email transporter
let emailTransporter = null;
if (SMTP_PASS) {
  emailTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  
  // Verify connection
  emailTransporter.verify((error, success) => {
    if (error) {
      console.log("Email transporter verification failed:", error.message);
      console.log("Suggestions will be logged but not emailed.");
    } else {
      console.log("Email transporter ready. Suggestions will be sent to:", ADMIN_EMAIL);
    }
  });
} else {
  console.log("SMTP_PASS not set. Suggestions will be logged but not emailed.");
  console.log("Set SMTP_PASS environment variable to enable email notifications.");
}

// --- Game configuration ---
const MAX_PLAYERS_PER_ROOM = 4;      // maximum players allowed in a room
const MIN_PLAYERS_TO_START = 2;      // creator can start early from this number
const QUESTION_DURATION_MS = 20000;  // per-question time limit
const RESULT_DURATION_MS = 5000;     // per-round result screen duration
const WIN_SCORE = 300;               // first to reach this score wins (0 = no score limit)

// --- Question bank (custom for Ege & Şevval) ---
const QUESTIONS = [
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

const rooms = new Map();
// roomCode -> {
//   phase: "lobby" | "question" | "result",
//   players: Map(ws -> {id, name, score}),
//   nextPlayerId,
//   round,
//   currentQuestion,
//   questionStartTs,
//   answers: Map(playerId -> { choiceIndex, timeMs }),
// }

function makeRoomCode(len = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function safeSend(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function broadcast(room, obj) {
  for (const ws of room.players.keys()) safeSend(ws, obj);
}

function getRoomOf(ws) {
  for (const [code, room] of rooms.entries()) {
    if (room.players.has(ws)) return { code, room };
  }
  return null;
}

function roomSnapshot(code, room) {
  const players = [];
  for (const p of room.players.values()) {
    players.push({ id: p.id, name: p.name, score: p.score });
  }
  return {
    code,
    players,
    phase: room.phase,
    round: room.round,
    ownerId: room.ownerId ?? null,
  };
}

function pickQuestion(room) {
  // round is 1-based; stop if we are out of questions
  const idx = room.round - 1;
  if (idx < 0 || idx >= QUESTIONS.length) return null;
  return QUESTIONS[idx];
}

function startRound(code, room) {
  room.phase = "question";
  room.round += 1;
  room.currentQuestion = pickQuestion(room);
  if (!room.currentQuestion) {
    // no more questions, end the game based on scores
    resolveRound(code, room);
    return;
  }
  room.answers = new Map();
  room.questionStartTs = Date.now();

  broadcast(room, { type: "room_update", ...roomSnapshot(code, room) });

  broadcast(room, {
    type: "question",
    round: room.round,
    question: {
      id: room.currentQuestion.id,
      text: room.currentQuestion.text,
      choices: room.currentQuestion.choices,
    },
    startTs: room.questionStartTs,
    durationMs: QUESTION_DURATION_MS,
  });

  // Süre dolunca otomatik resolve (cevap vermeyen olursa)
  setTimeout(() => {
    // oda hala var mı ve aynı round mı?
    const live = rooms.get(code);
    if (!live) return;
    if (live.round !== room.round) return;
    if (live.phase !== "question") return;
    resolveRound(code, live);
  }, QUESTION_DURATION_MS);
}

function resolveRound(code, room) {
  room.phase = "result";

  const correct = room.currentQuestion.correctIndex;

  // Skor hesap: doğruysa timeMs + küçük jitter ile "hata", en az hata en yüksek puan
  // Puanlar: 1. 120, 2. 80, 3. 40, 4. 20. Yanlış/boş: 0
  const ranking = [];
  for (const p of room.players.values()) {
    const ans = room.answers.get(p.id);
    if (!ans) {
      ranking.push({ playerId: p.id, name: p.name, choiceIndex: null, timeMs: null, correct: false, error: Infinity });
      continue;
    }
    const isCorrect = ans.choiceIndex === correct;
    const jitter = Math.floor(Math.random() * 120); // 0..119ms
    const error = isCorrect ? (ans.timeMs + jitter) : Infinity;
    ranking.push({
      playerId: p.id,
      name: p.name,
      choiceIndex: ans.choiceIndex,
      timeMs: ans.timeMs,
      correct: isCorrect,
      error,
    });
  }

  ranking.sort((a, b) => a.error - b.error);

  const pts = [120, 80, 40, 20];
  const awards = [];
  let awardIdx = 0;

  for (const r of ranking) {
    let add = 0;
    if (r.correct && awardIdx < pts.length) {
      add = pts[awardIdx++];
    }
    // oyuncu skorunu güncelle
    for (const p of room.players.values()) {
      if (p.id === r.playerId) p.score += add;
    }
    awards.push({ ...r, points: add });
  }

  broadcast(room, { type: "room_update", ...roomSnapshot(code, room) });

  broadcast(room, {
    type: "round_result",
    round: room.round,
    correctIndex: correct,
    awards,
    nextRoundInMs: RESULT_DURATION_MS,
  });

  // Kazanan var mı kontrol et
  let winner = null;
  if (WIN_SCORE > 0) {
    for (const p of room.players.values()) {
      if (p.score >= WIN_SCORE) {
        winner = { id: p.id, name: p.name, score: p.score };
        break;
      }
    }
  }

  // Eğer skorla kazanan yoksa ama tüm sorular bittiyse, en yüksek skorluyu kazanan yap
  if (!winner && room.round >= QUESTIONS.length) {
    let best = null;
    for (const p of room.players.values()) {
      if (!best || p.score > best.score) best = { id: p.id, name: p.name, score: p.score };
    }
    if (best) winner = best;
  }

  if (winner) {
    room.phase = "finished";
    broadcast(room, {
      type: "game_over",
      winner,
      finalRoom: roomSnapshot(code, room),
    });
    return;
  }

  // Sonuç ekranından sonra yeni tura geç
  setTimeout(() => {
    const live = rooms.get(code);
    if (!live) return;
    if (live.round !== room.round) return;
    startRound(code, live);
  }, RESULT_DURATION_MS);
}

// Handle CORS
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Store suggestions (in production, use a database)
const suggestions = [];

const server = http.createServer((req, res) => {
  setCORSHeaders(res);
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle OPTIONS for CORS
  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoint for suggestions
  if (path === "/api/suggestions" && method === "POST") {
    let body = "";
    
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const { message, username, type } = data;
        
        if (!message || !message.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: "Message is required" }));
          return;
        }

        const suggestion = {
          id: Date.now().toString(),
          message: message.trim(),
          username: username || "Anonymous",
          type: type || "general",
          timestamp: new Date().toISOString(),
          ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown",
        };

        suggestions.push(suggestion);
        
        // Log suggestion
        console.log("=".repeat(50));
        console.log("NEW SUGGESTION RECEIVED");
        console.log("Type:", suggestion.type);
        console.log("From:", suggestion.username);
        console.log("Message:", suggestion.message);
        console.log("Timestamp:", suggestion.timestamp);
        console.log("=".repeat(50));
        
        // Send email notification if transporter is configured
        if (emailTransporter) {
          const typeLabels = {
            general: "General Suggestion",
            feature: "Feature Request",
            bug: "Bug Report",
            question: "Question",
            other: "Other",
          };
          
          const mailOptions = {
            from: `"Quiz Clasher" <${SMTP_USER}>`,
            to: ADMIN_EMAIL,
            subject: `Quiz Clasher ${typeLabels[suggestion.type] || suggestion.type}: ${suggestion.username}`,
            text: `New ${typeLabels[suggestion.type] || suggestion.type} from Quiz Clasher\n\n` +
                  `From: ${suggestion.username}\n` +
                  `Type: ${typeLabels[suggestion.type] || suggestion.type}\n` +
                  `Timestamp: ${suggestion.timestamp}\n\n` +
                  `Message:\n${suggestion.message}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">New ${typeLabels[suggestion.type] || suggestion.type}</h2>
                <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 8px 0;"><strong>From:</strong> ${suggestion.username}</p>
                  <p style="margin: 8px 0;"><strong>Type:</strong> ${typeLabels[suggestion.type] || suggestion.type}</p>
                  <p style="margin: 8px 0;"><strong>Timestamp:</strong> ${new Date(suggestion.timestamp).toLocaleString()}</p>
                </div>
                <div style="background: #ffffff; padding: 20px; border-left: 4px solid #3b82f6; margin: 16px 0;">
                  <h3 style="margin-top: 0; color: #1f2937;">Message:</h3>
                  <p style="color: #374151; white-space: pre-wrap; line-height: 1.6;">${suggestion.message.replace(/\n/g, '<br>')}</p>
                </div>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                  This is an automated message from Quiz Clasher Suggestions System.
                </p>
              </div>
            `,
          };
          
          emailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Failed to send email notification:", error.message);
            } else {
              console.log("Email notification sent successfully:", info.messageId);
            }
          });
        }
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          success: true, 
          message: "Thank you for your suggestion! We'll review it soon." 
        }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid request data" }));
      }
    });
    return;
  }

  // Get suggestions endpoint (for admin - add authentication in production)
  if (path === "/api/suggestions" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ suggestions }));
    return;
  }

  // Default response
  res.writeHead(200);
  res.end("Quiz Clasher WS server running.\n");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  safeSend(ws, { type: "hello", message: "Connected to Quiz Clasher server" });

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return safeSend(ws, { type: "error", message: "Invalid JSON" });
    }

    const { type } = msg;

    if (type === "create_room") {
      const name = String(msg.name || "").trim().slice(0, 20);
      if (!name) return safeSend(ws, { type: "error", message: "Name required" });

      let code = makeRoomCode();
      while (rooms.has(code)) code = makeRoomCode();

      const room = {
        phase: "lobby",
        players: new Map(),
        nextPlayerId: 1,
        round: 0,
        currentQuestion: null,
        questionStartTs: null,
        answers: new Map(),
        ownerId: null,
      };

      const player = { id: room.nextPlayerId++, name, score: 0 };
      room.ownerId = player.id;
      room.players.set(ws, player);
      rooms.set(code, room);

      safeSend(ws, {
        type: "room_joined",
        ...roomSnapshot(code, room),
        selfId: player.id,
        config: {
          maxPlayers: MAX_PLAYERS_PER_ROOM,
          minPlayersToStart: MIN_PLAYERS_TO_START,
          questionDurationMs: QUESTION_DURATION_MS,
          resultDurationMs: RESULT_DURATION_MS,
          winScore: WIN_SCORE,
        },
      });
      broadcast(room, { type: "room_update", ...roomSnapshot(code, room) });
      return;
    }

    if (type === "join_room") {
      const code = String(msg.code || "").trim().toUpperCase();
      const name = String(msg.name || "").trim().slice(0, 20);
      if (!code || !name) return safeSend(ws, { type: "error", message: "Code and name required" });

      const room = rooms.get(code);
      if (!room) return safeSend(ws, { type: "error", message: "Room not found" });
      if (room.phase !== "lobby") return safeSend(ws, { type: "error", message: "Game already started" });
      if (room.players.size >= MAX_PLAYERS_PER_ROOM)
        return safeSend(ws, {
          type: "error",
          message: `Room is full (${room.players.size}/${MAX_PLAYERS_PER_ROOM})`,
        });

      const player = { id: room.nextPlayerId++, name, score: 0 };
      room.players.set(ws, player);

      safeSend(ws, {
        type: "room_joined",
        ...roomSnapshot(code, room),
        selfId: player.id,
        config: {
          maxPlayers: MAX_PLAYERS_PER_ROOM,
          minPlayersToStart: MIN_PLAYERS_TO_START,
          questionDurationMs: QUESTION_DURATION_MS,
          resultDurationMs: RESULT_DURATION_MS,
          winScore: WIN_SCORE,
        },
      });
      broadcast(room, { type: "room_update", ...roomSnapshot(code, room) });

      // oda dolunca otomatik başlat
      if (room.players.size === MAX_PLAYERS_PER_ROOM) {
        startRound(code, room);
      }
      return;
    }

    if (type === "answer") {
      const found = getRoomOf(ws);
      if (!found) return safeSend(ws, { type: "error", message: "Not in a room" });
      const { code, room } = found;

      if (room.phase !== "question") return;

      const player = room.players.get(ws);
      if (!player) return;

      const choiceIndex = Number(msg.choiceIndex);
      if (!Number.isFinite(choiceIndex)) return;

      // tekrar cevap vermesin
      if (room.answers.has(player.id)) return;

      const timeMs = Date.now() - room.questionStartTs;
      room.answers.set(player.id, { choiceIndex, timeMs });

      // herkes cevapladıysa erken resolve
      if (room.answers.size === room.players.size) {
        resolveRound(code, room);
      }
      return;
    }

    if (type === "start_game") {
      const found = getRoomOf(ws);
      if (!found) return safeSend(ws, { type: "error", message: "Not in a room" });
      const { code, room } = found;

      if (room.phase !== "lobby") return;

      const player = room.players.get(ws);
      if (!player) return;
      if (room.ownerId !== player.id) {
        return safeSend(ws, { type: "error", message: "Only room creator can start the game" });
      }

      if (room.players.size < MIN_PLAYERS_TO_START) {
        return safeSend(ws, {
          type: "error",
          message: `At least ${MIN_PLAYERS_TO_START} players required to start`,
        });
      }

      startRound(code, room);
      return;
    }

    if (type === "chat") {
      const text = String(msg.text || "").trim().slice(0, 200);
      if (!text) return;

      const found = getRoomOf(ws);
      if (!found) return safeSend(ws, { type: "error", message: "Not in a room" });
      const { room } = found;

      const player = room.players.get(ws);
      if (!player) return;

      broadcast(room, {
        type: "chat",
        from: { id: player.id, name: player.name },
        text,
        ts: Date.now(),
      });
      return;
    }

    if (type === "ping") return safeSend(ws, { type: "pong", t: Date.now() });

    safeSend(ws, { type: "error", message: `Unknown type: ${type}` });
  });

  ws.on("close", () => {
    const found = getRoomOf(ws);
    if (!found) return;

    const { code, room } = found;
    room.players.delete(ws);

    if (room.players.size === 0) {
      rooms.delete(code);
      return;
    }
    broadcast(room, { type: "room_update", ...roomSnapshot(code, room) });
  });
});

server.listen(PORT, () => {
  console.log(`WS server listening on http://localhost:${PORT}`);
});
