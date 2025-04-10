import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizHeader from './QuizHeader';

const Loading = () => {
    return (
        <div className='h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center
                             border-2 rounded-tr-[50%] rounded-bl-[50%]'>
            <p className='text-xl text-gray-200'>Loading...</p>
        </div>
    );
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(remSeconds).padStart(2, "0")}`;
    return formattedTime;
}

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60 * 25);
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const startTimer = () => {
        clearInterval(timerIntervalId); // Clear any existing interval
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
        fetch('/quiz.json').then(res => res.json()).then(data => {
            setQuestions(data);
        });
        startTimer(); // Start the timer on component mount
        return () => {
            clearInterval(timerIntervalId); // Cleanup on unmount
        };
    }, []); // Empty dependency array means this runs only once when the component mounts

    const handleAnswerSelect = (questionId, selectedOption) => {
        const updatedAnswers = { ...answers, [questionId]: selectedOption };
        setAnswers(updatedAnswers);
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

    const calculateScore = (userAnswers) => {
        const correctAnswers = questions.map((question) => question.answer);
        let score = 0;
        for (const questionId in userAnswers) {
            if (userAnswers[questionId] == correctAnswers[questionId - 1]) {
                score += 1;
            }
        }
        return score;
    };

    const restartQuiz = () => {
        setAnswers({});
        setScore(0);
        setShowResult(false);
        setLoading(false);
        setTimer(60 * 25);
        startTimer(); // Restart the timer when the quiz is restarted
        navigate('/quiz');
    };

    return (
        <section>
            <QuizHeader timer={timer} />
            <div className='md:w-9/12 w-[90%] mx-auto mb-8 flex flex-col justify-between items-start'>
                <div className='md:w-[70%] w-full'>
                    {questions.map((question, index) => (
                        <div key={question.id} className='m-3 py-3 px-4 shadow-sm border border-gray-200 rounded'>
                            <p className='flex items-center rounded text-xs p-2 cursor-pointer'>
                                <span className='h-8 w-8 bg-primary flex items-center justify-center text-green-800 mr-3'>{index + 1}</span>
                                {/* Check if the question contains code */}
                                {question.question.includes('#include') || question.question.includes('def') || question.question.includes('class')|| question.question.includes('print') ? (
                                    <pre className='bg-gray-100 p-4 rounded text-sm overflow-auto'>
                                        <code>{question.question}</code>
                                    </pre>
                                ) : (
                                    <span className='text-base block'>{question.question}</span>
                                )}
                            </p>
                            <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 mt-5'>
                                {question.options.map((option, index) => (
                                    <div
                                        onClick={() => handleAnswerSelect(question.id, option)}
                                        key={index}
                                        className={`border p-2 border-gray-200 rounded text-sx cursor-pointer ${answers[question.id] === option ? 'bg-gray-300' : ''
                                            }`}
                                    >
                                        <p className='text-[10px] mb-1'>Option {index + 1}</p>
                                        <p>{option}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button className='bg-primary px-6 py-2 text-white rounded' onClick={handleSubmit}>Submit Quiz</button>
                </div>
                <div className='md:w-[30%] w-full p-4 flex-1'>
                    {showResult && (
                        <div>
                            <h3 className='text-2xl font-medium'>Your Score:</h3>
                            <div className='h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center
                             border-2 rounded-tr-[50%] rounded-bl-[50%]'>
                                <h3 className={`text-xs ${status === 'Passed' ? "text-green-800" : "text-red-500"}`}>
                                    {status}
                                </h3>
                                <h1 className='text-3xl font-bold my-2'>{score} <span className='text-slate-800'>/20</span></h1>
                                <p>Total Time: {formatTime(60 - timer)}<span>sec.</span></p>
                            </div>
                            <button onClick={restartQuiz} className='bg-primary px-6 py-2 text-white rounded mt-8 w-full'>Restart</button>
                        </div>
                    )}
                    {loading && <Loading />}
                </div>
            </div>
        </section>
    );
};

export default Quiz;
