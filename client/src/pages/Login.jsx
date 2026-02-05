import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState(
    () => window.localStorage.getItem("bf_username") || ""
  );

  const submit = (e) => {
    e.preventDefault();
    const value = username.trim();
    if (!value) return;
    window.localStorage.setItem("bf_username", value);
    nav("/menu");
  };

  return (
    <div className="glass-card">
      <h1 className="glass-card__title">{t("login.title")}</h1>
      <p className="glass-card__subtitle">
        {t("login.subtitle")}
      </p>

      <form onSubmit={submit} className="field-group">
        <div>
          <div className="field-label">{t("login.usernameLabel")}</div>
          <input
            className="text-input"
            placeholder={t("login.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!username.trim()}
          className="btn btn-primary"
        >
          {t("login.loginButton")}
        </button>

        <p className="glass-card__subtitle" style={{ marginTop: 4 }}>
          {t("login.usernameNote")}
        </p>
      </form>
    </div>
  );
}

