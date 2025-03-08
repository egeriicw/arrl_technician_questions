import React from 'react';

const IncorrectAnswersReview = ({ incorrectAnswers, onResume, onExit, onSave }) => {
  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Incorrect Answers Review</h2>
          <div className="flex gap-4">
            <button
              onClick={onSave}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={onResume}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
            >
              Resume
            </button>
            <button
              onClick={onExit}
              className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600"
            >
              Exit
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {incorrectAnswers.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-2">Question {item.questionId}</div>
              <div className="font-medium mb-4">{item.question}</div>
              
              <div className="space-y-2">
                <div className="text-red-600">
                  <span className="font-bold">Selected Answer:</span>
                  <div className="ml-4 p-2 bg-red-50 rounded">
                    {item.selectedAnswer}. {item.answers.find(a => a.letter === item.selectedAnswer)?.text}
                  </div>
                </div>
                
                <div className="text-green-600">
                  <span className="font-bold">Correct Answer:</span>
                  <div className="ml-4 p-2 bg-green-50 rounded">
                    {item.correctAnswer}. {item.answers.find(a => a.letter === item.correctAnswer)?.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncorrectAnswersReview; 