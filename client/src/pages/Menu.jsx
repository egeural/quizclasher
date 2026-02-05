import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const CREATE_OWN_OPTIONS = [
  { id: "love", labelKey: "menu.loveCouple", path: "/love-couple", icon: "💕", descKey: "menu.loveDesc" },
  { id: "custom", labelKey: "menu.createOwn", path: "/create-your-own", icon: "✨", descKey: "menu.customDesc" },
];

const PRE_UPLOADED_OPTIONS = [
  { id: "sport", labelKey: "menu.sport", path: "/sport", icon: "⚽", ready: true },
  { id: "history", labelKey: "menu.history", path: "/history", icon: "📜", ready: true },
  { id: "bilkent", labelKey: "menu.bilkent", path: "/bilkent", icon: "🎓", ready: false },
  { id: "memes", labelKey: "menu.memes", path: "/memes", icon: "😂", ready: false },
];

export default function Menu() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const [subView, setSubView] = useState(null); // null | "createOwn" | "preUploaded"
  const username = window.localStorage.getItem("bf_username") || "mystery";

  return (
    <div className="glass-card glass-card--wide menu-page">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={() => {
            if (subView) {
              setSubView(null);
            } else {
              nav("/");
            }
          }}
        >
          {t("menu.back")}
        </button>
      </div>
      
      <div className="menu-hero">
        <h1 className="menu-hero__title">{t("menu.welcome", { username })}</h1>
        <p className="menu-hero__subtitle">
          {t("menu.subtitle")}
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
            <span className="menu-main-btn__label">{t("menu.createOwn")}</span>
            <span className="menu-main-btn__hint">{t("menu.createOwnHint")}</span>
          </button>
          <button
            type="button"
            className="menu-main-btn menu-main-btn--preloaded"
            onClick={() => setSubView("preUploaded")}
          >
            <span className="menu-main-btn__icon">📚</span>
            <span className="menu-main-btn__label">{t("menu.preUploaded")}</span>
            <span className="menu-main-btn__hint">{t("menu.preUploadedHint")}</span>
          </button>
        </div>
      )}

      {subView === "createOwn" && (
        <div className="menu-sub">
          <h2 className="menu-sub__title">{t("menu.createOwn")}</h2>
          <div className="menu-sub-grid">
            {CREATE_OWN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="menu-sub-card"
                onClick={() => nav(opt.path)}
              >
                <span className="menu-sub-card__icon">{opt.icon}</span>
                <span className="menu-sub-card__label">{opt.labelKey ? t(opt.labelKey) : opt.label}</span>
                <span className="menu-sub-card__desc">{opt.descKey ? t(opt.descKey) : opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {subView === "preUploaded" && (
        <div className="menu-sub">
          <h2 className="menu-sub__title">{t("menu.preUploaded")}</h2>
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
                <span className="menu-sub-card__label">{opt.labelKey ? t(opt.labelKey) : opt.label}</span>
                {!opt.ready && <span className="menu-sub-card__badge">{t("menu.comingSoon")}</span>}
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
          {t("menu.suggestions")}
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
