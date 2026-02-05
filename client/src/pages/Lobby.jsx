import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWs } from "../state/ws.jsx";
import { useLanguage } from "../context/LanguageContext";

export default function Lobby() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const { status, room, config, error, actions } = useWs();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // Oyun başlayınca /game'e geç
  useEffect(() => {
    if (room && (room.phase === "question" || room.phase === "result")) {
      nav("/game");
    }
  }, [room, nav]);

  return (
    <div className="glass-card">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={() => nav("/menu")}
        >
          {t("menu.back")}
        </button>
      </div>
      <img src="/logo.png" alt="Quiz Clasher" className="logo-main" />

      <div className="badge" style={{ marginBottom: 12 }}>
        <span
          className={`badge-dot ${
            status === "connected" ? "" : "badge-dot--danger"
          }`}
        />
        <span>WS: {status}</span>
      </div>

      <h1 className="glass-card__title">{t("lobby.title")}</h1>
      <p className="glass-card__subtitle">
        {t("lobby.subtitle", { 
          maxPlayers: config?.maxPlayers ?? 3, 
          winScore: (config?.winScore ?? 0) || t("lobby.highScore") 
        })}
      </p>

      <div className="field-group">
        <div>
          <div className="field-label">{t("lobby.warriorName")}</div>
          <input
            className="text-input"
            placeholder={t("lobby.warriorPlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <div className="field-label">{t("lobby.roomOperations")}</div>
          <div className="button-row">
            <button
              onClick={() => actions.createRoom(name)}
              disabled={!name || status !== "connected"}
              className="btn btn-primary"
            >
              {t("lobby.newRoom")}
            </button>

            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="text-input"
                placeholder={t("lobby.roomCode")}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ textAlign: "center", textTransform: "uppercase" }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => actions.joinRoom(code, name)}
          disabled={!name || !code || status !== "connected"}
          className="btn btn-secondary"
          style={{ width: "100%", marginTop: 2 }}
        >
          {t("lobby.joinRoom")}
        </button>

        {room && (
          <div className="room-panel">
            <div className="room-panel__header">
              <div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{t("lobby.roomCodeLabel")}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
                  {room.code}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, opacity: 0.9 }}>
                {t("lobby.phase")}: <b>{room.phase.toUpperCase()}</b>
                <br />
                {t("lobby.players")}: {room.players.length}/
                {config?.maxPlayers ?? 3}
              </div>
            </div>

            <div className="room-panel__players">
              {room.players.map((p) => (
                <li key={p.id}>
                  {p.name}{" "}
                  <span style={{ opacity: 0.7 }}>({p.score} {t("lobby.points")})</span>
                </li>
              ))}
            </div>

            {room.ownerId === null ? null : (
              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <span className="result-meta">
                  {t("lobby.roomLeader")}:{" "}
                  <b>
                    {room.players.find((p) => p.id === room.ownerId)?.name ??
                      t("lobby.unknown")}
                  </b>
                </span>
                {room.ownerId === (room && room.players.find((p) => p.id)?.id) ? null : null}
              </div>
            )}

            {room.ownerId === null ? null : (
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {room.ownerId ===
                  (room.players.find((p) => p.id === room.ownerId)?.id) &&
                  room.phase === "lobby" && (
                    <button
                      className="btn btn-ghost"
                      disabled={room.players.length < (config?.minPlayersToStart ?? 2)}
                      onClick={() => actions.startGame()}
                    >
                      {t("lobby.startGameNow")}
                    </button>
                  )}
              </div>
            )}

            <div className="room-panel__hint">
              {t("lobby.roomHint", {
                maxPlayers: config?.maxPlayers ?? 3,
                minPlayers: config?.minPlayersToStart ?? 2,
                duration: (config?.questionDurationMs ?? 15000) / 1000,
                winScore: (config?.winScore ?? 0) || t("lobby.highScore"),
              })}
            </div>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}
      </div>
    </div>
  );
}
