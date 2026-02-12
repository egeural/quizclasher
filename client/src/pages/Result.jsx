import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWs } from "../state/ws.jsx";
import { useLanguage } from "../context/LanguageContext";

export default function Result() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const { room, result, question, selfId, gameOver } = useWs();

  useEffect(() => {
    if (!room) nav("/menu");
  }, [room, nav]);

  useEffect(() => {
    if (!result && question) {
      nav("/game");
    }
  }, [result, question, nav]);

  if (!result || !question) {
    return (
      <div className="glass-card glass-card--wide">
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            className="menu-back"
            onClick={() => nav("/lobby")}
          >
            {t("menu.back")}
          </button>
        </div>
        <h2 className="glass-card__title">{t("result.loading")}</h2>
        <p className="glass-card__subtitle">
          {t("result.loadingSubtitle")}
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
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={() => nav("/lobby")}
        >
          {t("menu.back")}
        </button>
      </div>
      <h2 className="glass-card__title">{t("result.roundResult", { round: result.round })}</h2>
      <p className="glass-card__subtitle">
        {t("result.correctAnswer")}: <b>{question.question.choices[correct]}</b>
      </p>

      <div className="result-list">
        {result.awards.map((a) => (
          <div
            key={a.playerId}
            className={`result-row ${a.playerId === selfId ? "result-row--self" : ""
              }`}
          >
            <div>
              <div>
                <b>{a.name}</b> {a.playerId === selfId ? `(${t("result.you")})` : ""}
              </div>
              <div className="result-meta">
                {t("result.answer")}:{" "}
                {a.choiceIndex === null
                  ? "—"
                  : question.question.choices[a.choiceIndex]}{" "}
                • {t("result.time")}: {a.timeMs ?? "—"}ms •{" "}
                {a.correct ? t("result.correct") : t("result.wrong")}
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
          {t("result.leaderboard")}
        </h3>
        <div className="result-list">
          {leaderboard.map((p, idx) => (
            <div
              key={p.id}
              className={`result-row ${p.id === selfId ? "result-row--self" : ""
                }`}
            >
              <div>
                <div>
                  #{idx + 1} <b>{p.name}</b>{" "}
                  {p.id === selfId ? `(${t("result.you")})` : ""}
                </div>
                <div className="result-meta">{t("result.totalScore")}: {p.score}</div>
              </div>
              <div className="result-points">{p.score}</div>
            </div>
          ))}
        </div>
      </div>

      {gameOver ? (
        <div style={{ marginTop: 20, textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <h3 style={{ fontSize: 24, marginBottom: 8, color: "#fbbf24" }}>{t("result.gameOver")}</h3>
          <p className="glass-card__subtitle" style={{ fontSize: 16 }}>
            {t("result.winner", { name: gameOver.winner.name, score: gameOver.winner.score })}
          </p>
          <button
            onClick={() => {
              actions.leaveRoom();
              nav("/lobby");
            }}
            className="btn btn-primary"
            style={{ marginTop: 16, width: "100%" }}
          >
            {t("result.backToMenu")}
          </button>
        </div>
      ) : (
        <p className="glass-card__subtitle" style={{ marginTop: 16 }}>
          {t("result.nextRound")}
        </p>
      )}
    </div>
  );
}
