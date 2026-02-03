import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
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
      <h1 className="glass-card__title">Bil &amp; Fethet</h1>
      <p className="glass-card__subtitle">
        Kendi tasarladığın quizlerle sevgilini veya arkadaş grubunu test et.
        Devam etmek için kendine özel bir kullanıcı adı seç.
      </p>

      <form onSubmit={submit} className="field-group">
        <div>
          <div className="field-label">Kullanıcı adı</div>
          <input
            className="text-input"
            placeholder="ör: ege123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!username.trim()}
          className="btn btn-primary"
        >
          Giriş yap
        </button>

        <p className="glass-card__subtitle" style={{ marginTop: 4 }}>
          Bu isim cihazında saklanır ve hazırladığın quizlerle eşleştirilir.
        </p>
      </form>
    </div>
  );
}

