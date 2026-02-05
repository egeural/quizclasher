import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "tr" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
      aria-label={language === "en" ? "Switch to Turkish" : "Switch to English"}
      title={language === "en" ? "Türkçe'ye geç" : "Switch to English"}
    >
      <span className="language-toggle__icon">🌐</span>
      <span className="language-toggle__badge">{language === "en" ? "EN" : "TR"}</span>
    </button>
  );
}
