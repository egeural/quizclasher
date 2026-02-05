import { useLanguage } from "../context/LanguageContext";

export default function Suggestions() {
  const { t } = useLanguage();
  const username = window.localStorage.getItem("bf_username") || "";
  const handleSend = (e) => {
    e.preventDefault();
    const form = e.target;
    const text = form.elements.message.value;
    if (!text.trim()) return;
    const subject = t("suggestions.subject");
    const body = `${t("suggestions.from")}: ${username || t("suggestions.anonymous")}\n\n${text}`;
    window.location.href = `mailto:egeural2005@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="glass-card">
      <h1 className="glass-card__title">{t("suggestions.title")}</h1>
      <p className="glass-card__subtitle">
        {t("suggestions.subtitle")}
      </p>

      <form onSubmit={handleSend} className="field-group">
        <div>
          <div className="field-label">{t("suggestions.messageLabel")}</div>
          <textarea
            name="message"
            className="text-input"
            rows={6}
            placeholder={t("suggestions.messagePlaceholder")}
            style={{ resize: "vertical" }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {t("suggestions.sendEmail")}
        </button>
      </form>
    </div>
  );
}

