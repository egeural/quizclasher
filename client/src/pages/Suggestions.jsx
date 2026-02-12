import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// Get API URL from environment or use default
const getApiUrl = () => {
  // In production, this should be your deployed server URL
  // For development, use localhost
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Try to detect if we're in production (deployed)
  if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    // Use same origin for production
    return `${window.location.protocol}//${window.location.host}`;
  }
  return "http://localhost:3000";
};

const API_URL = getApiUrl();
const MAX_MESSAGE_LENGTH = 1000;

export default function Suggestions() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const username = window.localStorage.getItem("bf_username") || "";
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError(t("suggestions.errorEmpty"));
      return;
    }

    if (message.trim().length < 10) {
      setError(t("suggestions.errorTooShort"));
      return;
    }

    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      setError(t("suggestions.errorTooLong"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          username: username || "Anonymous",
          type: type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage("");
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.error || t("suggestions.errorSend"));
      }
    } catch (err) {
      setError(t("suggestions.errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

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

      <h1 className="glass-card__title">{t("suggestions.title")}</h1>
      <p className="glass-card__subtitle">
        {t("suggestions.subtitle")}
      </p>

      {success && (
        <div className="suggestions-success">
          <div className="suggestions-success__icon">✓</div>
          <div className="suggestions-success__message">
            {t("suggestions.successMessage")}
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="field-group">
        <div>
          <div className="field-label">{t("suggestions.typeLabel")}</div>
          <select
            className="text-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="general">{t("suggestions.typeGeneral")}</option>
            <option value="feature">{t("suggestions.typeFeature")}</option>
            <option value="bug">{t("suggestions.typeBug")}</option>
            <option value="question">{t("suggestions.typeQuestion")}</option>
            <option value="other">{t("suggestions.typeOther")}</option>
          </select>
        </div>

        <div>
          <div className="field-label">
            {t("suggestions.messageLabel")}
            <span style={{ color: "#FB8500", marginLeft: 4 }}>*</span>
          </div>
          <textarea
            name="message"
            className="text-input"
            rows={8}
            value={message}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= MAX_MESSAGE_LENGTH) {
                setMessage(value);
                setError("");
              }
            }}
            placeholder={t("suggestions.messagePlaceholder")}
            style={{ resize: "vertical", minHeight: "120px" }}
            disabled={loading}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <div style={{
            fontSize: 12,
            color: message.length > MAX_MESSAGE_LENGTH * 0.9 ? "#FB8500" : "#8ECAE6",
            marginTop: 4
          }}>
            {message.length} / {MAX_MESSAGE_LENGTH} {t("suggestions.characters")}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !message.trim() || message.trim().length < 10 || message.trim().length > MAX_MESSAGE_LENGTH}
        >
          {loading ? (
            <>
              <span style={{ marginRight: 8 }}>⏳</span>
              {t("suggestions.sending")}
            </>
          ) : (
            <>
              <span style={{ marginRight: 8 }}>📤</span>
              {t("suggestions.submit")}
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <div style={{ fontSize: 13, color: "#8ECAE6", lineHeight: 1.6 }}>
          <strong style={{ color: "white" }}>{t("suggestions.noteTitle")}</strong>
          <br />
          {t("suggestions.noteText")}
        </div>
      </div>
    </div>
  );
}

