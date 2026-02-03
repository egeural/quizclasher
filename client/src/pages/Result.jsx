import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWs } from "../state/ws.jsx";

export default function Result() {
  const nav = useNavigate();
  const { room, result, question, selfId, gameOver } = useWs();

  useEffect(() => {
    if (!room) nav("/");
  }, [room, nav]);

  useEffect(() => {
    if (!result && question) {
      nav("/game");
    }
  }, [result, question, nav]);

  if (!result || !question) {
    return (
      <div className="glass-card glass-card--wide">
        <h2 className="glass-card__title">Sonuç yükleniyor</h2>
        <p className="glass-card__subtitle">
          Savaş meydanındaki hamleler toplanıyor...
        </p>
      </div>
    );
  }

  const correct = result.correctIndex;

  const leaderboard =
    room?.players
      ?.slice()
      .sort((a, b) => b.score - a.score) ?? [];

  return (
    <div className="glass-card glass-card--wide">
      <h2 className="glass-card__title">Round {result.round} sonucu</h2>
      <p className="glass-card__subtitle">
        Doğru cevap: <b>{question.question.choices[correct]}</b>
      </p>

      <div className="result-list">
        {result.awards.map((a) => (
          <div
            key={a.playerId}
            className={`result-row ${
              a.playerId === selfId ? "result-row--self" : ""
            }`}
          >
            <div>
              <div>
                <b>{a.name}</b> {a.playerId === selfId ? "(sen)" : ""}
              </div>
              <div className="result-meta">
                cevap:{" "}
                {a.choiceIndex === null
                  ? "—"
                  : question.question.choices[a.choiceIndex]}{" "}
                • süre: {a.timeMs ?? "—"}ms •{" "}
                {a.correct ? "doğru" : "yanlış"}
              </div>
            </div>
            <div className="result-points">+{a.points}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <h3
          style={{
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#9ca3af",
            margin: "0 0 6px",
          }}
        >
          Genel Skor Tablosu
        </h3>
        <div className="result-list">
          {leaderboard.map((p, idx) => (
            <div
              key={p.id}
              className={`result-row ${
                p.id === selfId ? "result-row--self" : ""
              }`}
            >
              <div>
                <div>
                  #{idx + 1} <b>{p.name}</b>{" "}
                  {p.id === selfId ? "(sen)" : ""}
                </div>
                <div className="result-meta">toplam skor: {p.score}</div>
              </div>
              <div className="result-points">{p.score}</div>
            </div>
          ))}
        </div>
      </div>

      {gameOver ? (
        <p className="glass-card__subtitle" style={{ marginTop: 16 }}>
          Oyun bitti!{" "}
          <b>
            {gameOver.winner.name} ({gameOver.winner.score} puan)
          </b>{" "}
          bu savaşın galibi.
        </p>
      ) : (
        <p className="glass-card__subtitle" style={{ marginTop: 16 }}>
          Yeni tur birkaç saniye içinde otomatik başlayacak. Hazır ol komutan!
        </p>
      )}
    </div>
  );
}
