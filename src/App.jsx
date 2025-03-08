import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import IncorrectAnswersReview from './components/IncorrectAnswersReview';

const generateSessionId = () => {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];
  const timePart = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${datePart}_${timePart}_${randomPart}`;
};

const App = () => {
  const [allQuestions, setAllQuestions] = useState([]); // Original questions from JSON
  const [availableQuestions, setAvailableQuestions] = useState([]); // Questions still available
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sessionId, setSessionId] = useState(generateSessionId);

  useEffect(() => {
    fetch('/technician.json')
      .then(response => response.json())
      .then(data => {
        setAllQuestions(data.questions);
        setAvailableQuestions(data.questions);
      })
      .catch(error => console.error('Error loading questions:', error));
  }, []);

  const getRandomQuestionIndex = () => {
    if (availableQuestions.length === 0) {
      // Reset available questions when all have been used
      setAvailableQuestions([...allQuestions]);
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      return { questionIndex: randomIndex, globalIndex: randomIndex };
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const globalIndex = allQuestions.findIndex(q => q.id === availableQuestions[randomIndex].id);
    return { questionIndex: randomIndex, globalIndex };
  };

  const getNextQuestion = () => {
    const { questionIndex, globalIndex } = getRandomQuestionIndex();
    
    // Remove the question from available questions
    setAvailableQuestions(prev => prev.filter((_, index) => index !== questionIndex));
    setCurrentQuestionIndex(globalIndex);
    setSelectedAnswer(null);
  };

  const handleAnswer = (isCorrect, selectedAnswerLetter) => {
    setSelectedAnswer(selectedAnswerLetter);
    
    if (!isCorrect) {
      const currentQuestion = allQuestions[currentQuestionIndex];
      const answers = [
        { text: currentQuestion.at1, letter: 'A' },
        { text: currentQuestion.at2, letter: 'B' },
        { text: currentQuestion.at3, letter: 'C' },
        { text: currentQuestion.at4, letter: 'D' },
      ];
      
      setIncorrectAnswers(prev => [...prev, {
        questionId: currentQuestion.id + 1,
        question: currentQuestion.qt,
        selectedAnswer: selectedAnswerLetter,
        correctAnswer: String.fromCharCode(64 + parseInt(currentQuestion.ca)),
        answers
      }]);
    }

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleStart = () => {
    setAvailableQuestions([...allQuestions]);
    const { globalIndex } = getRandomQuestionIndex();
    setCurrentQuestionIndex(globalIndex);
    setIsStarted(true);
    setIncorrectAnswers([]);
    setIsReviewing(false);
  };

  const handleSave = async () => {
    if (incorrectAnswers.length === 0) {
      alert('No incorrect answers to save!');
      return;
    }

    const saveData = {
      sessionId,
      timestamp: new Date().toISOString(),
      score: {
        correct: score.correct,
        total: score.total,
        percentage: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
      },
      incorrectAnswers
    };

    try {
      const response = await fetch('/api/save-incorrect-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: saveData, sessionId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save incorrect answers');
      }
      alert('Incorrect answers saved successfully!');
    } catch (error) {
      console.error('Error saving incorrect answers:', error);
      alert('Failed to save incorrect answers. Please try again.');
    }
  };

  const handleRestart = async () => {
    // Save incorrect answers if any exist
    await handleSave();
    
    // Generate new session ID
    setSessionId(generateSessionId());
    
    setScore({ correct: 0, total: 0 });
    setAvailableQuestions([...allQuestions]);
    setIncorrectAnswers([]);
    getNextQuestion();
  };

  const handleStop = () => {
    setIsReviewing(true);
  };

  const handleResume = () => {
    setIsReviewing(false);
  };

  const handleExit = async () => {
    // Save incorrect answers if any exist
    await handleSave();
    
    // Generate new session ID
    setSessionId(generateSessionId());
    
    setIsStarted(false);
    setScore({ correct: 0, total: 0 });
    setCurrentQuestionIndex(null);
    setIncorrectAnswers([]);
    setIsReviewing(false);
    setAvailableQuestions([]);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">ARRL Technician License Flashcards</h1>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (allQuestions.length === 0 || currentQuestionIndex === null) {
    return <div>Loading questions...</div>;
  }

  if (isReviewing) {
    return (
      <IncorrectAnswersReview
        incorrectAnswers={incorrectAnswers}
        onResume={handleResume}
        onExit={handleExit}
        onSave={handleSave}
      />
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  const answers = [
    { text: currentQuestion.at1, letter: 'A' },
    { text: currentQuestion.at2, letter: 'B' },
    { text: currentQuestion.at3, letter: 'C' },
    { text: currentQuestion.at4, letter: 'D' },
  ];

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      {/* Score Display */}
      <div className="text-center mb-8">
        <div className="text-sm text-gray-600 mb-2">
          Session ID: {sessionId}
        </div>
        <div className="text-xl font-semibold">
          Score: {score.correct} / {score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Questions Remaining: {availableQuestions.length}
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        questionNumber={currentQuestion.qn}
        question={currentQuestion.qt}
        answers={answers}
        correctAnswer={String.fromCharCode(64 + parseInt(currentQuestion.ca))}
        onAnswer={handleAnswer}
        onNext={getNextQuestion}
        questionId={currentQuestion.id + 1}
        totalCards={allQuestions.length}
      />

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={getNextQuestion}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Skip
        </button>
        <button
          onClick={handleStop}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Review
        </button>
        <button
          onClick={handleRestart}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Restart
        </button>
        <button
          onClick={handleExit}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Exit
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default App; 