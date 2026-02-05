import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CREATE_OWN_OPTIONS = [
  { id: "love", label: "Love Couple", path: "/love-couple", icon: "💕", desc: "İlişkinize özel sorular" },
  { id: "custom", label: "Create your own", path: "/create-your-own", icon: "✨", desc: "Sıfırdan kendi quiz'in" },
];

const PRE_UPLOADED_OPTIONS = [
  { id: "sport", label: "Sport", path: "/sport", icon: "⚽", ready: true },
  { id: "history", label: "History", path: "/history", icon: "📜", ready: true },
  { id: "bilkent", label: "Bilkent", path: "/bilkent", icon: "🎓", ready: false },
  { id: "memes", label: "Memes", path: "/memes", icon: "😂", ready: false },
];

export default function Menu() {
  const nav = useNavigate();
  const [subView, setSubView] = useState(null); // null | "createOwn" | "preUploaded"
  const username = window.localStorage.getItem("bf_username") || "mystery";

  return (
    <div className="glass-card glass-card--wide menu-page">
      <div className="menu-hero">
        <h1 className="menu-hero__title">Hoş geldin, {username}</h1>
        <p className="menu-hero__subtitle">
          Quiz'ini seç, oyna veya kendin oluştur.
        </p>
      </div>

      {!subView && (
        <div className="menu-main-buttons">
          <button
            type="button"
            className="menu-main-btn menu-main-btn--create"
            onClick={() => setSubView("createOwn")}
          >
            <span className="menu-main-btn__icon">✏️</span>
            <span className="menu-main-btn__label">Create your own quiz</span>
            <span className="menu-main-btn__hint">Kendi sorularını yaz, quiz'ini oluştur</span>
          </button>
          <button
            type="button"
            className="menu-main-btn menu-main-btn--preloaded"
            onClick={() => setSubView("preUploaded")}
          >
            <span className="menu-main-btn__icon">📚</span>
            <span className="menu-main-btn__label">Pre-uploaded quizzes</span>
            <span className="menu-main-btn__hint">Hazır spor, tarih ve daha fazlası</span>
          </button>
        </div>
      )}

      {subView === "createOwn" && (
        <div className="menu-sub">
          <button
            type="button"
            className="menu-back"
            onClick={() => setSubView(null)}
          >
            ← Geri
          </button>
          <h2 className="menu-sub__title">Create your own quiz</h2>
          <div className="menu-sub-grid">
            {CREATE_OWN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="menu-sub-card"
                onClick={() => nav(opt.path)}
              >
                <span className="menu-sub-card__icon">{opt.icon}</span>
                <span className="menu-sub-card__label">{opt.label}</span>
                <span className="menu-sub-card__desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {subView === "preUploaded" && (
        <div className="menu-sub">
          <button
            type="button"
            className="menu-back"
            onClick={() => setSubView(null)}
          >
            ← Geri
          </button>
          <h2 className="menu-sub__title">Pre-uploaded quizzes</h2>
          <div className="menu-sub-grid">
            {PRE_UPLOADED_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`menu-sub-card ${opt.ready ? "" : "menu-sub-card--disabled"}`}
                onClick={() =>
                  opt.ready &&
                  nav(opt.path, (opt.id === "sport" || opt.id === "history") ? { state: { autoStart: true } } : {})
                }
                disabled={!opt.ready}
              >
                <span className="menu-sub-card__icon">{opt.icon}</span>
                <span className="menu-sub-card__label">{opt.label}</span>
                {!opt.ready && <span className="menu-sub-card__badge">Yakında</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="menu-footer">
        <button
          type="button"
          className="menu-footer__link"
          onClick={() => nav("/suggestions")}
        >
          💬 Suggestions
        </button>
        <a
          href="https://www.linkedin.com/in/ege-ural-ab84152b7/"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-footer__link"
        >
          💼 LinkedIn
        </a>
        <a
          href="https://github.com/egeural"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-footer__link"
        >
          💻 GitHub
        </a>
      </div>
    </div>
  );
}
