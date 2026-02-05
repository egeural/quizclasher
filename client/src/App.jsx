import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import LoveCouple from "./pages/LoveCouple.jsx";
import CreateYourOwn from "./pages/CreateYourOwn.jsx";
import Sport from "./pages/Sport.jsx";
import History from "./pages/History.jsx";
import Suggestions from "./pages/Suggestions.jsx";
import Lobby from "./pages/Lobby.jsx";
import Game from "./pages/Game.jsx";
import Result from "./pages/Result.jsx";
import LanguageToggle from "./components/LanguageToggle.jsx";
import { useLanguage } from "./context/LanguageContext";

function MusicPlayer() {
  const { t } = useLanguage();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const playPromise = audioRef.current?.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, []);

  const toggle = () => {
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="music-toggle">
      <audio ref={audioRef} src="/music.mp3" loop />
      <button
        onClick={toggle}
        className={`music-toggle__btn ${playing ? "music-toggle__btn--on" : ""}`}
        aria-label={playing ? (t("common.muteMusic") || "Mute music") : (t("common.playMusic") || "Play music")}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/love-couple" element={<LoveCouple />} />
          <Route path="/create-your-own" element={<CreateYourOwn />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/history" element={<History />} />
          <Route path="/suggestions" element={<Suggestions />} />
          {/* eski çok oyunculu modlar */}
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
      <LanguageToggle />
      <MusicPlayer />
    </div>
  );
}
