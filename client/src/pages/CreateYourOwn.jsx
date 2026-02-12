import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const STORAGE_KEY_PREFIX = "bf_customquiz_";
const QUIZ_QUESTION_COUNT = 10;
const QUIZ_TIME_PER_QUESTION = 20;

function buildQuizQuestions(completed) {
  const base = [...completed].sort(() => Math.random() - 0.5).slice(0, QUIZ_QUESTION_COUNT);
  return base.map((q) => {
    const opts = [
      { text: q.correct, isCorrect: true },
      { text: q.wrong1, isCorrect: false },
      { text: q.wrong2, isCorrect: false },
      { text: q.wrong3, isCorrect: false },
    ].sort(() => Math.random() - 0.5);
    return { ...q, options: opts };
  });
}

function advanceQuizState(state, pickedIndex) {
  const current = state.questions[state.currentIndex];
  const picked =
    typeof pickedIndex === "number" && pickedIndex >= 0
      ? current.options[pickedIndex]
      : null;
  const isCorrect = picked ? picked.isCorrect : false;
  const newAnswers = [
    ...state.answers,
    { questionId: current.id, pickedIndex, isCorrect },
  ];
  const nextIndex = state.currentIndex + 1;
  const finished = nextIndex >= state.questions.length;
  return {
    ...state,
    answers: newAnswers,
    currentIndex: finished ? state.currentIndex : nextIndex,
    timeLeft: finished ? 0 : QUIZ_TIME_PER_QUESTION,
    finished,
  };
}

export default function CreateYourOwn() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const username = window.localStorage.getItem("bf_username") || "guest";
  const storageKey = STORAGE_KEY_PREFIX + username;

  const [customQs, setCustomQs] = useState([]);
  const [view, setView] = useState("edit"); // "edit" | "list" | "quiz"
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCustomQs(parsed.customQs || []);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const addQuestion = () => {
    setCustomQs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "",
        correct: "",
        wrong1: "",
        wrong2: "",
        wrong3: "",
      },
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setCustomQs((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (id) => {
    setCustomQs((prev) => prev.filter((q) => q.id !== id));
  };

  const saveAll = () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ customQs, savedAt: new Date().toISOString() })
    );
    alert(t("createOwn.saved"));
  };

  const completedQuestions = customQs.filter(
    (q) =>
      q.text?.trim() &&
      q.correct?.trim() &&
      q.wrong1?.trim() &&
      q.wrong2?.trim() &&
      q.wrong3?.trim()
  );

  const startQuiz = () => {
    if (completedQuestions.length < QUIZ_QUESTION_COUNT) {
      alert(
        t("createOwn.needMore", { required: QUIZ_QUESTION_COUNT, current: completedQuestions.length })
      );
      return;
    }
    const qs = buildQuizQuestions(completedQuestions);
    setQuiz({
      questions: qs,
      currentIndex: 0,
      timeLeft: QUIZ_TIME_PER_QUESTION,
      answers: [],
      finished: false,
    });
    setView("quiz");
  };

  if (quiz && view === "quiz") {
    return (
      <CustomQuizPlay
        quiz={quiz}
        setQuiz={setQuiz}
        onExit={() => {
          setQuiz(null);
          setView("edit");
        }}
      />
    );
  }

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
      <h1 className="glass-card__title">{t("createOwn.title")}</h1>
      <p className="glass-card__subtitle">
        {t("createOwn.subtitle", { count: QUIZ_QUESTION_COUNT })}
      </p>

      <div className="love-menu">
        <button
          type="button"
          className={`btn btn-ghost ${view === "edit" ? "love-menu__btn--active" : ""}`}
          onClick={() => setView("edit")}
        >
          {t("createOwn.editQuestions")}
        </button>
        <button
          type="button"
          className={`btn btn-ghost ${view === "list" ? "love-menu__btn--active" : ""}`}
          onClick={() => setView("list")}
        >
          {t("createOwn.completedCount", { count: completedQuestions.length })}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={startQuiz}
          disabled={completedQuestions.length < QUIZ_QUESTION_COUNT}
        >
          {t("createOwn.startQuiz")}
        </button>
      </div>

      {view === "edit" && (
        <div className="love-sections">
          <div className="quiz-edit-list">
            {customQs.map((q) => (
              <div key={q.id} className="quiz-edit-card">
                <div className="quiz-edit-card__row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="choice-label">{t("createOwn.questionText")}</label>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: 12, padding: "4px 8px" }}
                    onClick={() => removeQuestion(q.id)}
                  >
                    {t("createOwn.delete")}
                  </button>
                </div>
                <input
                  className="text-input choice-input"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                  placeholder={t("createOwn.questionPlaceholder")}
                />
                <div className="choice-grid">
                  <div className="quiz-edit-card__row choice-row--correct">
                    <label className="choice-label">{t("createOwn.correctAnswer")}</label>
                    <input
                      className="text-input choice-input"
                      value={q.correct}
                      onChange={(e) =>
                        updateQuestion(q.id, "correct", e.target.value)
                      }
                      placeholder={t("createOwn.correctPlaceholder")}
                    />
                  </div>
                  <div className="quiz-edit-card__row">
                    <label className="choice-label">{t("createOwn.wrongAnswer", { num: 1 })}</label>
                    <input
                      className="text-input choice-input"
                      value={q.wrong1}
                      onChange={(e) =>
                        updateQuestion(q.id, "wrong1", e.target.value)
                      }
                      placeholder={t("createOwn.wrongPlaceholder")}
                    />
                  </div>
                  <div className="quiz-edit-card__row">
                    <label className="choice-label">{t("createOwn.wrongAnswer", { num: 2 })}</label>
                    <input
                      className="text-input choice-input"
                      value={q.wrong2}
                      onChange={(e) =>
                        updateQuestion(q.id, "wrong2", e.target.value)
                      }
                      placeholder={t("createOwn.wrongPlaceholder")}
                    />
                  </div>
                  <div className="quiz-edit-card__row">
                    <label className="choice-label">{t("createOwn.wrongAnswer", { num: 3 })}</label>
                    <input
                      className="text-input choice-input"
                      value={q.wrong3}
                      onChange={(e) =>
                        updateQuestion(q.id, "wrong3", e.target.value)
                      }
                      placeholder={t("createOwn.wrongPlaceholder")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost" onClick={addQuestion}>
            {t("createOwn.addQuestion")}
          </button>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={saveAll}>
              {t("createOwn.save")}
            </button>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="love-completed">
          {completedQuestions.length === 0 ? (
            <p className="glass-card__subtitle">
              {t("createOwn.noCompleted")}
            </p>
          ) : (
            completedQuestions.map((q) => (
              <div key={q.id} className="love-completed__item">
                <div className="love-completed__question">{q.text}</div>
                <ul className="love-completed__answers">
                  <li><b>{t("createOwn.correct")}:</b> {q.correct}</li>
                  <li><b>{t("createOwn.wrong")} 1:</b> {q.wrong1}</li>
                  <li><b>{t("createOwn.wrong")} 2:</b> {q.wrong2}</li>
                  <li><b>{t("createOwn.wrong")} 3:</b> {q.wrong3}</li>
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CustomQuizPlay({ quiz, setQuiz, onExit }) {
  const { t } = useLanguage();
  const current = quiz.questions[quiz.currentIndex];

  useEffect(() => {
    if (quiz.finished) return;
    const id = setInterval(() => {
      setQuiz((prev) => {
        if (!prev || prev.finished) return prev;
        if (prev.timeLeft <= 1) return advanceQuizState(prev, null);
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [quiz.finished, quiz.currentIndex, setQuiz]);

  const handlePick = (idx) => {
    if (quiz.finished || quiz.timeLeft <= 0) return;
    setQuiz((prev) => advanceQuizState(prev, idx));
  };

  if (quiz.finished) {
    const correctCount = quiz.answers.filter((a) => a.isCorrect).length;
    const total = quiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    return (
      <div className="glass-card glass-card--wide">
        <div className="love-quiz-results">
          <div className="love-results__content">
            <div className="love-results__emoji">🎯</div>
            <h1 className="glass-card__title">{t("createOwn.result")}</h1>
            <div className="love-results__score" style={{ color: "#219EBC" }}>
              {correctCount} / {total}
            </div>
            <div className="love-results__percentage" style={{ color: "#219EBC" }}>
              %{percentage}
            </div>
            <button type="button" className="btn btn-secondary" onClick={onExit} style={{ marginTop: 20 }}>
              {t("menu.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = quiz.questions.length;
  return (
    <div className="glass-card glass-card--wide">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className="menu-back"
          onClick={onExit}
        >
          {t("menu.back")}
        </button>
      </div>
      <div className="love-quiz">
        <div className="question-layout">
          <div className="question-header">
            <div>
              <div className="round-label">{t("createOwn.question")}</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>
                {quiz.currentIndex + 1} / {total}
              </div>
            </div>
            <div className="timer-chip">
              ⏱ {quiz.timeLeft}s / {QUIZ_TIME_PER_QUESTION}s
            </div>
          </div>
          <div className="timer-bar-wrapper">
            <div
              className="timer-bar-fill"
              style={{ width: `${(quiz.timeLeft / QUIZ_TIME_PER_QUESTION) * 100}%` }}
            />
          </div>
          <div className="question-card">
            <div className="question-text">{current.text}</div>
            <div className="answer-list">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="answer-btn"
                  onClick={() => handlePick(idx)}
                  disabled={quiz.timeLeft <= 0}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
