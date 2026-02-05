import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const TEMPLATE_GROUPS = [
  {
    id: "firsts",
    title: "Firsts & Milestones",
    questions: [
      "Where was our first date?",
      "What did we eat on our first date?",
      "Who texted first after our first date?",
      "What time did our first date start?",
      "What was one thing we almost didn’t do on our first date?",
      "What was the first movie or series we watched together?",
      "When was our first kiss?",
      "Where did our first kiss happen?",
      "Who said “I love you” first?",
      "On which platform did we first start talking?",
    ],
  },
  {
    id: "prefs",
    title: "Personal Preferences (Danger Zone)",
    questions: [
      "What is my favorite color?",
      "What is my favorite food?",
      "What drink do I usually order when we go out?",
      "What is my least favorite food?",
      "What song reminds me of you the most?",
      "What smell do I love?",
      "What’s my comfort food when I’m sad?",
      "What is my favorite season?",
      "What is my go-to coffee order?",
      "What’s one thing I always forget but you remember?",
    ],
  },
  {
    id: "habits",
    title: "Habits & Daily Life",
    questions: [
      "Am I a morning person or a night owl?",
      "What’s my biggest bad habit?",
      "What do I do when I’m stressed?",
      "What do I spend too much money on?",
      "What annoys me faster than it should?",
      "How do I usually show affection?",
      "What’s my guilty pleasure?",
      "What do I do first when I wake up?",
      "What’s my most used emoji?",
      "What’s something I do that I think is cute but might not be?",
    ],
  },
  {
    id: "memories",
    title: "Memories Only Couples Should Know",
    questions: [
      "What was our most random argument about?",
      "Where was our favorite trip together?",
      "What’s the funniest thing that has happened to us?",
      "What’s one inside joke only we understand?",
      "What was the last thing that made us laugh uncontrollably?",
      "What’s one moment that made us feel really close?",
      "What’s the most spontaneous thing we’ve done together?",
      "What was our last fight about?",
      "What’s something small you did that meant a lot to me?",
      "What’s our “thing” that other people find weird?",
    ],
  },
  {
    id: "future",
    title: "Future & “Pay Attention” Questions",
    questions: [
      "What city do I want to visit with you most?",
      "What’s one goal I’ve told you about many times?",
      "What scares me about the future?",
      "What excites me most about our future?",
      "What kind of date do I enjoy more: planned or spontaneous?",
      "What’s something I want us to improve together?",
      "How do I imagine a perfect lazy day with you?",
      "What’s one promise we’ve made to each other?",
      "What do I need most when I’m upset?",
      "What do I hope never changes between us?",
    ],
  },
];

const STORAGE_KEY_PREFIX = "bf_lovequiz_";
const QUIZ_QUESTION_COUNT = 10;
const QUIZ_TIME_PER_QUESTION = 20; // seconds

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
    {
      questionId: current.id,
      pickedIndex,
      isCorrect,
    },
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

export default function LoveCouple() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const username = window.localStorage.getItem("bf_username") || "guest";
  const storageKey = STORAGE_KEY_PREFIX + username;

  const [answers, setAnswers] = useState({});
  const [customQs, setCustomQs] = useState([]);
  const [view, setView] = useState("edit"); // "edit" | "list"
  const [activeGroupId, setActiveGroupId] = useState(TEMPLATE_GROUPS[0]?.id || null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnswers(parsed.answers || {});
        setCustomQs(parsed.customQs || []);
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  const updateAnswer = (qKey, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qKey]: {
        ...(prev[qKey] || { correct: "", wrong1: "", wrong2: "", wrong3: "" }),
        [field]: value,
      },
    }));
  };

  const addCustom = () => {
    setCustomQs((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "", correct: "", wrong1: "", wrong2: "", wrong3: "" },
    ]);
  };

  const updateCustom = (id, field, value) => {
    setCustomQs((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const completedQuestions = [];

  // template questions
  TEMPLATE_GROUPS.forEach((group) => {
    group.questions.forEach((qText, idx) => {
      const qKey = `${group.id}_${idx}`;
      const data = answers[qKey];
      if (
        data &&
        data.correct?.trim() &&
        data.wrong1?.trim() &&
        data.wrong2?.trim() &&
        data.wrong3?.trim()
      ) {
        completedQuestions.push({
          id: qKey,
          text: qText,
          correct: data.correct,
          wrong1: data.wrong1,
          wrong2: data.wrong2,
          wrong3: data.wrong3,
          source: "template",
        });
      }
    });
  });

  // custom questions
  customQs.forEach((q) => {
    if (
      q.text?.trim() &&
      q.correct?.trim() &&
      q.wrong1?.trim() &&
      q.wrong2?.trim() &&
      q.wrong3?.trim()
    ) {
      completedQuestions.push({
        id: q.id,
        text: q.text,
        correct: q.correct,
        wrong1: q.wrong1,
        wrong2: q.wrong2,
        wrong3: q.wrong3,
        source: "custom",
      });
    }
  });

  const saveAll = () => {
    const payload = {
      answers,
      customQs,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    alert("Love Couple quiz’in kaydedildi! Artık bu soruları oyunda kullanabilirsin.");
  };

  return (
    <div className="glass-card glass-card--wide">
      {!quiz && (
        <>
          <div className="love-menu" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => nav("/menu")}
            >
              {t("quiz.backToMenu")}
            </button>
          </div>
          <h1 className="glass-card__title">{t("loveCouple.title")}</h1>
          <p className="glass-card__subtitle">
            {t("loveCouple.subtitle", { username })}
          </p>

          <div className="love-menu">
            <button
              type="button"
              className={`btn btn-ghost ${
                view === "edit" ? "love-menu__btn--active" : ""
              }`}
              onClick={() => setView("edit")}
            >
              {t("loveCouple.editQuestions")}
            </button>
            <button
              type="button"
              className={`btn btn-ghost ${
                view === "list" ? "love-menu__btn--active" : ""
              }`}
              onClick={() => setView("list")}
            >
              {t("loveCouple.completedQuestions", { count: completedQuestions.length })}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (completedQuestions.length < QUIZ_QUESTION_COUNT) {
                  alert(
                    t("loveCouple.needMore", { required: QUIZ_QUESTION_COUNT, count: completedQuestions.length })
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
              }}
            >
              {t("loveCouple.startQuiz")}
            </button>
          </div>
        </>
      )}

      {!quiz && view === "edit" && (
        <div className="love-sections">
          <div className="love-group-menu">
            {TEMPLATE_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                className={`btn btn-ghost love-group-menu__btn ${
                  activeGroupId === group.id ? "love-group-menu__btn--active" : ""
                }`}
                onClick={() => setActiveGroupId(group.id)}
              >
                {group.title}
              </button>
            ))}
          </div>

          {TEMPLATE_GROUPS.filter((g) => g.id === activeGroupId).map((group) => (
            <section key={group.id} className="love-section">
              <h2 className="love-section__title">{group.title}</h2>
              {group.questions.map((qText, idx) => {
                const qKey = `${group.id}_${idx}`;
                const data =
                  answers[qKey] || {
                    correct: "",
                    wrong1: "",
                    wrong2: "",
                    wrong3: "",
                  };
                return (
                  <div key={qKey} className="quiz-edit-card">
                    <div className="quiz-edit-card__row">
                      <label className="choice-label">{t("loveCouple.question")}</label>
                      <div className="love-question__text" style={{ marginBottom: 0 }}>{qText}</div>
                    </div>
                    <div className="choice-grid">
                      <div className="quiz-edit-card__row choice-row--correct">
                        <label className="choice-label">{t("loveCouple.correctAnswer")}</label>
                        <input
                          className="text-input choice-input"
                          value={data.correct}
                          onChange={(e) =>
                            updateAnswer(qKey, "correct", e.target.value)
                          }
                          placeholder={t("loveCouple.correctPlaceholder")}
                        />
                      </div>
                      <div className="quiz-edit-card__row">
                        <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 1 })}</label>
                        <input
                          className="text-input choice-input"
                          value={data.wrong1}
                          onChange={(e) =>
                            updateAnswer(qKey, "wrong1", e.target.value)
                          }
                          placeholder={t("loveCouple.wrongPlaceholder")}
                        />
                      </div>
                      <div className="quiz-edit-card__row">
                        <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 2 })}</label>
                        <input
                          className="text-input choice-input"
                          value={data.wrong2}
                          onChange={(e) =>
                            updateAnswer(qKey, "wrong2", e.target.value)
                          }
                          placeholder={t("loveCouple.wrongPlaceholder")}
                        />
                      </div>
                      <div className="quiz-edit-card__row">
                        <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 3 })}</label>
                        <input
                          className="text-input choice-input"
                          value={data.wrong3}
                          onChange={(e) =>
                            updateAnswer(qKey, "wrong3", e.target.value)
                          }
                          placeholder={t("loveCouple.wrongPlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}

        <section className="love-section">
          <h2 className="love-section__title">{t("loveCouple.yourQuestions")}</h2>
          <p className="glass-card__subtitle" style={{ marginBottom: 12 }}>
            {t("loveCouple.yourQuestionsDesc")}
          </p>

          {customQs.map((q) => (
            <div key={q.id} className="quiz-edit-card">
              <div className="quiz-edit-card__row">
                <label className="choice-label">{t("loveCouple.questionText")}</label>
                <input
                  className="text-input choice-input"
                  value={q.text}
                  onChange={(e) => updateCustom(q.id, "text", e.target.value)}
                  placeholder={t("loveCouple.customQuestionPlaceholder")}
                />
              </div>
              <div className="choice-grid">
                <div className="quiz-edit-card__row choice-row--correct">
                  <label className="choice-label">{t("loveCouple.correctAnswer")}</label>
                  <input
                    className="text-input choice-input"
                    value={q.correct}
                    onChange={(e) =>
                      updateCustom(q.id, "correct", e.target.value)
                    }
                    placeholder={t("loveCouple.correctPlaceholder")}
                  />
                </div>
                <div className="quiz-edit-card__row">
                  <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 1 })}</label>
                  <input
                    className="text-input choice-input"
                    value={q.wrong1}
                    onChange={(e) =>
                      updateCustom(q.id, "wrong1", e.target.value)
                    }
                    placeholder={t("loveCouple.wrongPlaceholder")}
                  />
                </div>
                <div className="quiz-edit-card__row">
                  <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 2 })}</label>
                  <input
                    className="text-input choice-input"
                    value={q.wrong2}
                    onChange={(e) =>
                      updateCustom(q.id, "wrong2", e.target.value)
                    }
                    placeholder={t("loveCouple.wrongPlaceholder")}
                  />
                </div>
                <div className="quiz-edit-card__row">
                  <label className="choice-label">{t("loveCouple.wrongAnswer", { num: 3 })}</label>
                  <input
                    className="text-input choice-input"
                    value={q.wrong3}
                    onChange={(e) =>
                      updateCustom(q.id, "wrong3", e.target.value)
                    }
                    placeholder={t("loveCouple.wrongPlaceholder")}
                  />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-ghost" onClick={addCustom}>
            {t("loveCouple.addQuestion")}
          </button>
        </section>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary" onClick={saveAll}>
            {t("loveCouple.saveAll")}
          </button>
        </div>
        </div>
      )}

      {!quiz && view === "list" && (
        <div className="love-completed">
          {completedQuestions.length === 0 ? (
            <p className="glass-card__subtitle">
              {t("loveCouple.noCompleted")}
            </p>
          ) : (
            completedQuestions.map((q) => (
              <div key={q.id} className="love-completed__item">
                <div className="love-completed__question">{q.text}</div>
                <ul className="love-completed__answers">
                  <li>
                    <b>{t("loveCouple.correct")}:</b> {q.correct}
                  </li>
                  <li>
                    <b>{t("loveCouple.wrong")} 1:</b> {q.wrong1}
                  </li>
                  <li>
                    <b>{t("loveCouple.wrong")} 2:</b> {q.wrong2}
                  </li>
                  <li>
                    <b>{t("loveCouple.wrong")} 3:</b> {q.wrong3}
                  </li>
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {quiz && (
        <LoveQuizView quiz={quiz} setQuiz={setQuiz} />
      )}
    </div>
  );
}

function LoveQuizView({ quiz, setQuiz }) {
  const { t } = useLanguage();
  const current = quiz.questions[quiz.currentIndex];

  useEffect(() => {
    if (quiz.finished) return;
    const id = setInterval(() => {
      setQuiz((prev) => {
        if (!prev || prev.finished) return prev;
        if (prev.timeLeft <= 1) {
          return advanceQuizState(prev, null);
        }
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

    let message = "";
    let emoji = "💔";
    let color = "#ef4444";

    if (percentage === 100) {
      message = t("loveCouple.perfect");
      emoji = "💯";
      color = "#fbbf24";
    } else if (percentage >= 80) {
      message = t("loveCouple.great");
      emoji = "🎉";
      color = "#22c55e";
    } else if (percentage >= 60) {
      message = t("loveCouple.good");
      emoji = "💖";
      color = "#0ea5e9";
    } else if (percentage >= 40) {
      message = t("loveCouple.okay");
      emoji = "💭";
      color = "#f59e0b";
    } else {
      message = t("loveCouple.bad");
      emoji = "😬";
      color = "#ef4444";
    }

    return (
      <div className="love-quiz-results">
        <div className="love-results__hearts">
          <span className="love-heart">💖</span>
          <span className="love-heart">💕</span>
          <span className="love-heart">💗</span>
          <span className="love-heart">💖</span>
          <span className="love-heart">💕</span>
        </div>

        <div className="love-results__content">
          <div className="love-results__emoji">{emoji}</div>
          <h1 className="glass-card__title" style={{ marginTop: 8 }}>
            {t("loveCouple.results")}
          </h1>
          <div className="love-results__score" style={{ color }}>
            {correctCount} / {total}
          </div>
          <div className="love-results__percentage" style={{ color }}>
            %{percentage}
          </div>
          <p className="love-results__message">{message}</p>

          <div className="love-results__breakdown">
            <div className="love-breakdown-item">
              <span className="love-breakdown-label">{t("loveCouple.correct")}:</span>
              <span className="love-breakdown-value" style={{ color: "#22c55e" }}>
                {correctCount}
              </span>
            </div>
            <div className="love-breakdown-item">
              <span className="love-breakdown-label">{t("loveCouple.wrong")}:</span>
              <span className="love-breakdown-value" style={{ color: "#ef4444" }}>
                {total - correctCount}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setQuiz(null)}
            style={{ marginTop: 20 }}
          >
            {t("loveCouple.playAgain")}
          </button>
        </div>
      </div>
    );
  }

  const total = quiz.questions.length;

  return (
    <div className="love-quiz">
      <div className="question-layout">
        <div className="question-header">
          <div>
            <div className="round-label">{t("loveCouple.question")}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {quiz.currentIndex + 1} / {total}
            </div>
          </div>
          <div className="timer-chip">
            ⏱ <span>{quiz.timeLeft}s / {QUIZ_TIME_PER_QUESTION}s</span>
          </div>
        </div>

        <div className="timer-bar-wrapper">
          <div
            className="timer-bar-fill"
            style={{
              width: `${(quiz.timeLeft / QUIZ_TIME_PER_QUESTION) * 100}%`,
            }}
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
  );
}

