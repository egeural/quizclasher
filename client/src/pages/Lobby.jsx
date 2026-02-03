import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWs } from "../state/ws.jsx";

export default function Lobby() {
  const nav = useNavigate();
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
      <img src="/logo.png" alt="Bil ve Fethet" className="logo-main" />

      <div className="badge" style={{ marginBottom: 12 }}>
        <span
          className={`badge-dot ${
            status === "connected" ? "" : "badge-dot--danger"
          }`}
        />
        <span>WS: {status}</span>
      </div>

      <h1 className="glass-card__title">Bil ve Fethet</h1>
      <p className="glass-card__subtitle">
        Tarih bilginle odanı kur, savaşçıları davet et ve en hızlı doğru cevabı
        veren komutan ol. Oda {config?.maxPlayers ?? 3} kişiyle başlar,
        ilk {(config?.winScore ?? 0) || "yüksek skor"} puana ulaşan tahtı alır.
      </p>

      <div className="field-group">
        <div>
          <div className="field-label">Savaşçı ismi</div>
          <input
            className="text-input"
            placeholder="Örn. Fatih, Mete Han..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <div className="field-label">Oda işlemleri</div>
          <div className="button-row">
            <button
              onClick={() => actions.createRoom(name)}
              disabled={!name || status !== "connected"}
              className="btn btn-primary"
            >
              YENİ ODA
            </button>

            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="text-input"
                placeholder="ODA KODU"
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
          ODAYA KATIL
        </button>

        {room && (
          <div className="room-panel">
            <div className="room-panel__header">
              <div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Oda kodu</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>
                  {room.code}
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, opacity: 0.9 }}>
                Faz: <b>{room.phase.toUpperCase()}</b>
                <br />
                Oyuncu: {room.players.length}/
                {config?.maxPlayers ?? 3}
              </div>
            </div>

            <div className="room-panel__players">
              {room.players.map((p) => (
                <li key={p.id}>
                  {p.name}{" "}
                  <span style={{ opacity: 0.7 }}>({p.score} puan)</span>
                </li>
              ))}
            </div>

            {room.ownerId === null ? null : (
              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <span className="result-meta">
                  Oda lideri:{" "}
                  <b>
                    {room.players.find((p) => p.id === room.ownerId)?.name ??
                      "Bilinmiyor"}
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
                      Oyunu şimdi başlat
                    </button>
                  )}
              </div>
            )}

            <div className="room-panel__hint">
              * Oda {config?.maxPlayers ?? 3} kişi olduğunda otomatik başlar,{" "}
              oda lideri en az {(config?.minPlayersToStart ?? 2)} kişiyle erken
              başlatabilir. Soru süresi ~
              {(config?.questionDurationMs ?? 15000) / 1000}s, ilk{" "}
              {(config?.winScore ?? 0) || "yüksek skor"} puana ulaşan kazanır.
            </div>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}
      </div>
    </div>
  );
}
