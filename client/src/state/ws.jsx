import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
const WsCtx = createContext(null);

export function WsProvider({ children }) {
  const wsRef = useRef(null);

  const [status, setStatus] = useState("disconnected");
  const [selfId, setSelfId] = useState(null);
  const [room, setRoom] = useState(null); // {code, players, phase, round}
  const [question, setQuestion] = useState(null); // {round, question, startTs, durationMs}
  const [result, setResult] = useState(null); // {round, correctIndex, awards}
  const [config, setConfig] = useState(null); // game rules from server
  const [gameOver, setGameOver] = useState(null); // {winner, finalRoom}
  const [chat, setChat] = useState([]); // [{from, text, ts}]
  const [error, setError] = useState(null);

  function send(obj) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(obj));
  }

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");

    ws.onmessage = (e) => {
      let msg;
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }

      if (msg.type === "error") setError(msg.message);

      if (msg.type === "room_joined") {
        setSelfId(msg.selfId);
        setRoom({
          code: msg.code,
          players: msg.players,
          phase: msg.phase,
          round: msg.round,
          ownerId: msg.ownerId ?? null,
        });
        setQuestion(null);
        setResult(null);
        setGameOver(null);
        setConfig(msg.config || null);
        setChat([]);
        setError(null);
      }

      if (msg.type === "room_update") {
        setRoom({
          code: msg.code,
          players: msg.players,
          phase: msg.phase,
          round: msg.round,
          ownerId: msg.ownerId ?? null,
        });
      }

      if (msg.type === "question") {
        setQuestion(msg);
        setResult(null);
        setGameOver(null);
      }

      if (msg.type === "round_result") {
        setResult(msg);
      }

      if (msg.type === "game_over") {
        setGameOver({ winner: msg.winner, finalRoom: msg.finalRoom });
      }

      if (msg.type === "chat") {
        setChat((prev) => [...prev, { from: msg.from, text: msg.text, ts: msg.ts }]);
      }
    };

    return () => ws.close();
  }, []);

  const value = useMemo(
    () => ({
      status,
      selfId,
      room,
      question,
      result,
      config,
      gameOver,
      chat,
      error,
      send,
      actions: {
        createRoom: (name, category, config = {}) => send({ type: "create_room", name, category, config }),
        joinRoom: (code, name) => send({ type: "join_room", code, name }),
        answer: (choiceIndex) => send({ type: "answer", choiceIndex }),
        chat: (text) => send({ type: "chat", text }),
        startGame: () => send({ type: "start_game" }),
        leaveRoom: () => {
          send({ type: "leave_room" });
          setRoom(null);
          setQuestion(null);
          setResult(null);
          setGameOver(null);
          setConfig(null);
          setChat([]);
          setError(null);
        }
      },
    }),
    [status, selfId, room, question, result, config, gameOver, chat, error]
  );

  return <WsCtx.Provider value={value}>{children}</WsCtx.Provider>;
}

export function useWs() {
  const ctx = useContext(WsCtx);
  if (!ctx) throw new Error("useWs must be used inside WsProvider");
  return ctx;
}
