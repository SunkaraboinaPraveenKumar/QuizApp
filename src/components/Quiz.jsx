import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizHeader from './QuizHeader';

const Loading = () => {
  return (
    <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
      <p className="text-xl text-gray-200">Loading...</p>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(remSeconds).padStart(2, "0")}`;
  return formattedTime;
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60 * 25); // Total time in seconds (e.g., 25 minutes)
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const startTimer = () => {
    clearInterval(timerIntervalId); // Ensure any previous interval is cleared
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          alert('Time is Over!!');
          return prevTimer;
        }
      });
    }, 1000);
    setTimerIntervalId(intervalId);
  };

  useEffect(() => {
    fetch('/quiz.json')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });

    startTimer(); // Start timer on component mount

    return () => {
      clearInterval(timerIntervalId); // Cleanup the timer on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = (userAnswers) => {
    const correctAnswers = questions.map((question) => question.answer);
    let score = 0;
    for (const questionId in userAnswers) {
      // Adjust indexing: assuming question.id starts at 1
      if (userAnswers[questionId] == correctAnswers[questionId - 1]) {
        score += 1;
      }
    }
    return score;
  };

  const handleSubmit = () => {
    setLoading(true);
    clearInterval(timerIntervalId);

    setTimeout(() => {
      const quizScore = calculateScore(answers);
      setScore(quizScore);
      const percentage = (quizScore / questions.length) * 100;
      const newStatus = percentage >= 50 ? 'Passed' : 'Fail';
      setStatus(newStatus);
      setShowResult(true);
      setLoading(false);
    }, 5000);
  };

  const restartQuiz = () => {
    setAnswers({});
    setScore(0);
    setShowResult(false);
    setLoading(false);
    setTimer(60 * 25);
    setCurrentQuestionIndex(0);
    startTimer(); // Restart the timer
    navigate('/quiz');
  };

  return (
    <section>
      <QuizHeader timer={timer} />
      <div className="w-[90%] md:w-9/12 mx-auto mb-8 flex flex-col">
        {loading && <Loading />}
        {!loading && !showResult && questions.length > 0 && (
          <div className="shadow-sm border border-gray-200 rounded p-4">
            {/* Display current question */}
            <div className="mb-4">
              <p className="flex items-center space-x-3 p-2 cursor-pointer">
                <span className="h-8 w-8 bg-primary flex items-center justify-center text-green-800">
                  {currentQuestionIndex + 1}
                </span>
                {questions[currentQuestionIndex].question.includes('#include') ||
                questions[currentQuestionIndex].question.includes('def') ||
                questions[currentQuestionIndex].question.includes('class') ||
                questions[currentQuestionIndex].question.includes('print') ? (
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    <code>{questions[currentQuestionIndex].question}</code>
                  </pre>
                ) : (
                  <span className="text-base block">
                    {questions[currentQuestionIndex].question}
                  </span>
                )}
              </p>
            </div>

            {/* Options */}
            <div className="grid gap-4 mt-5 grid-cols-1 sm:grid-cols-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleAnswerSelect(questions[currentQuestionIndex].id, option)
                  }
                  className={`border p-2 rounded text-xs cursor-pointer border-gray-200 ${
                    answers[questions[currentQuestionIndex].id] === option
                      ? 'bg-gray-300'
                      : ''
                  }`}
                >
                  <p className="mb-1">Option {index + 1}</p>
                  <p>{option}</p>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded bg-primary text-white transition hover:bg-primary-dark ${
                  currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show result */}
        {showResult && (
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-medium">Your Score:</h3>
            <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
              <h3 className={`text-xs ${status === 'Passed' ? 'text-green-800' : 'text-red-500'}`}>
                {status}
              </h3>
              <h1 className="text-3xl font-bold my-2">
                {score} <span className="text-slate-800">/{questions.length}</span>
              </h1>
              <p>Total Time: {formatTime(60 * 25 - timer)} sec.</p>
            </div>
            <button
              onClick={restartQuiz}
              className="bg-primary px-6 py-2 text-white rounded mt-8 w-full"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Quiz;
