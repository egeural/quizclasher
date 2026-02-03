export default function Suggestions() {
  const username = window.localStorage.getItem("bf_username") || "";
  const handleSend = (e) => {
    e.preventDefault();
    const form = e.target;
    const text = form.elements.message.value;
    if (!text.trim()) return;
    const subject = "Bil & Fethet Öneri";
    const body = `Gönderen: ${username || "anonim"}\n\n${text}`;
    window.location.href = `mailto:egeural2005@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="glass-card">
      <h1 className="glass-card__title">Suggestions</h1>
      <p className="glass-card__subtitle">
        Yeni kategori, soru veya özellik fikirlerini buradan yaz. Mesajın
        direkt olarak egeural2005@gmail.com adresine gidecek.
      </p>

      <form onSubmit={handleSend} className="field-group">
        <div>
          <div className="field-label">Mesajın</div>
          <textarea
            name="message"
            className="text-input"
            rows={6}
            placeholder="Fikrini, önerini veya hatayı buraya yaz..."
            style={{ resize: "vertical" }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Mail gönder
        </button>
      </form>
    </div>
  );
}

