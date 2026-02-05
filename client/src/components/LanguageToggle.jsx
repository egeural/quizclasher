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
      <span className="language-toggle__flag">
        {language === "en" ? "🇹🇷" : "🇬🇧"}
      </span>
      <span className="language-toggle__text">
        {language === "en" ? "TR" : "EN"}
      </span>
    </button>
  );
}
