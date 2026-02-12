import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWs } from "../state/ws.jsx";
import { useLanguage } from "../context/LanguageContext";

export default function Game() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const { room, question, result, selfId, chat, actions } = useWs();

  const [now, setNow] = useState(Date.now());
  const [picked, setPicked] = useState(null);
  const [sent, setSent] = useState(false);

  // sayfa açılınca lobby yoksa geri dön
  useEffect(() => {
    if (!room) nav("/");
  }, [room, nav]);

  // timer tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, []);

  // yeni soru gelince state reset
  useEffect(() => {
    if (question) {
      setPicked(null);
      setSent(false);
    }
  }, [question?.round]);

  // result gelince result sayfasına git
  useEffect(() => {
    if (result) nav("/result");
  }, [result, nav]);

  const remainingMs = useMemo(() => {
    if (!question) return 0;
    const end = question.startTs + question.durationMs;
    return Math.max(0, end - now);
  }, [question, now]);

  if (!question) {
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
        <h2 className="glass-card__title">{t("game.preparing")}</h2>
        <p className="glass-card__subtitle">
          {t("game.preparingSubtitle")}
        </p>
      </div>
    );
  }

  const q = question.question;

  const totalSeconds = Math.ceil(question.durationMs / 1000);
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const percent = (remainingMs / question.durationMs) * 100;

  return (
    <div className="glass-card glass-card--wide">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={() => {
            actions.leaveRoom();
            nav("/menu");
          }}
        >
          {t("menu.back")}
        </button>
      </div>
      <div className="question-layout" style={{ gap: 18 }}>
        <div className="question-header">
          <div>
            <div className="round-label">{t("game.round")}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{question.round}</div>
          </div>
          <div className="timer-chip">
            ⏱ <span>{remainingSeconds}s / {totalSeconds}s</span>
          </div>
        </div>

        <div className="timer-bar-wrapper">
          <div
            className="timer-bar-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2.3fr) minmax(0,1.1fr)", gap: 16, alignItems: "flex-start" }}>
          <div className="question-card">
            <div className="question-text">{q.text}</div>

            <div className="answer-list">
              {q.choices.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !sent && setPicked(i)}
                  className={`answer-btn ${picked === i ? "answer-btn--picked" : ""
                    }`}
                  disabled={sent}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => {
                  if (picked === null || sent) return;
                  actions.answer(picked);
                  setSent(true);
                }}
                disabled={picked === null || sent}
                className="btn btn-secondary"
              >
                {t("game.sendAnswer")}
              </button>

              <div style={{ opacity: 0.8, fontSize: 13 }}>
                {t("game.you")}: <b>#{selfId}</b>{" "}
                {sent ? ` • ${t("game.answerLocked")}` : t("game.selectAndSend")}
              </div>
            </div>
          </div>

          <div className="question-card" style={{ maxHeight: 260, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.18em", color: "#9ca3af", marginBottom: 6 }}>
              {t("game.roomChat")}
            </div>
            <div style={{ flex: 1, overflowY: "auto", fontSize: 13, paddingRight: 4 }}>
              {chat.length === 0 && (
                <div className="result-meta">
                  {t("game.chatPlaceholder")}
                </div>
              )}
              {chat.map((m, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{m.from.name}:</span>{" "}
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <ChatInput onSend={actions.chat} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInput({ onSend }) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
      <input
        className="text-input"
        placeholder={t("game.messagePlaceholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button className="btn btn-ghost" onClick={submit}>
        {t("game.send")}
      </button>
    </div>
  );
}
