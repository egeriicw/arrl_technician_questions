import React, { useState, useEffect } from 'react';

const Flashcard = ({
  questionNumber,
  question,
  answers,
  correctAnswer,
  onAnswer,
  onNext,
  questionId,
  totalCards,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Log props when they change
  useEffect(() => {
    console.log('Flashcard props:', {
      questionNumber,
      question,
      answers,
      correctAnswer,
      questionId,
      totalCards
    });
  }, [questionNumber, question, answers, correctAnswer, questionId, totalCards]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!showFeedback) {
        const key = event.key.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(key)) {
          handleAnswerSelect(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback]);

  const handleAnswerSelect = (letter) => {
    if (showFeedback) return;
    
    setSelectedAnswer(letter);
    const correct = letter === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(correct, letter);

    // Set delay based on whether the answer was correct
    const delay = correct ? 2000 : 4000;

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      onNext();
    }, delay);
  };

  return (
    <div className="relative w-[600px] h-[500px] bg-gray-100 rounded-lg shadow-lg p-8 mx-auto">
      {/* Progress and Question Number */}
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>Question {questionId}</span>
        <span>{questionNumber}</span>
      </div>

      {/* Question */}
      <div className="text-lg font-medium mb-6 min-h-[60px]">
        {question}
      </div>

      {/* Answers */}
      <div className="space-y-3 mt-4">
        {console.log('Rendering answers:', answers)}
        {answers.map((answer) => {
          console.log('Rendering answer:', answer);
          return (
            <div
              key={answer.letter}
              onClick={() => handleAnswerSelect(answer.letter)}
              className={`p-4 rounded-md cursor-pointer transition-colors ${
                selectedAnswer === answer.letter && isCorrect ? 'bg-green-200' : ''
              } ${
                selectedAnswer === answer.letter && !isCorrect ? 'bg-red-200' : ''
              } ${
                showFeedback && answer.letter === correctAnswer ? 'bg-green-100' : ''
              } ${
                !showFeedback ? 'hover:bg-yellow-100 bg-white' : ''
              }`}
            >
              <span className="font-bold mr-2">{answer.letter}.</span>
              {answer.text}
            </div>
          );
        })}
      </div>

      {/* Feedback X */}
      {showFeedback && !isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-red-600 text-9xl font-bold">✕</div>
        </div>
      )}
    </div>
  );
};

export default Flashcard; 