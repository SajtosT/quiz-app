import React, { useState, useEffect } from 'react';
import './App.css';
import questions from './questions';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const current = questions[currentIndex];

  // Időzítő
  useEffect(() => {
    if (!started || showFeedback || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleAnswer(null); // idő lejárt
          return 10;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, currentIndex, showFeedback]);

  const handleStart = () => {
    setStarted(true);
    setScore(0);
    setCurrentIndex(0);
    setQuizFinished(false);
    setSelected(null);
    setShowFeedback(false);
    setTimeLeft(30);
  };

  const handleAnswer = (option) => {
    setSelected(option);
    setShowFeedback(true);

    const isCorrect = option === current.answer;
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
        setTimeLeft(30);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  return (
    <div className="App">
      <h1>Sajti Quiz</h1>

      {!started && !quizFinished && (
        <button onClick={handleStart} className="start-btn">Start Quiz</button>
      )}

      {started && !quizFinished && (
        <>
          <h3>Time left: {timeLeft}s</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="question-block"
            >
              <h2>{current.question}</h2>
              {current.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => !showFeedback && handleAnswer(option)}
                  className={`option-btn ${
                    showFeedback
                      ? option === current.answer
                        ? 'correct'
                        : option === selected
                        ? 'wrong'
                        : ''
                      : ''
                  }`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
              {showFeedback && (
                <p>
                  {selected === current.answer
                    ? '✔ Correct!'
                    : selected === null
                    ? '⏱ Time’s up!'
                    : `✖ Wrong! Correct answer: ${current.answer}`}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {quizFinished && (
        <div className="score-block">
          <h2>Quiz Finished!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <button onClick={handleStart}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
}

export default App;