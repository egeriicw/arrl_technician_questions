# ARRL Technician License Flashcards

A React-based flashcard application designed to help users study for the ARRL Technician License exam. This interactive learning tool provides a dynamic way to practice exam questions with immediate feedback and progress tracking.

## Overview

This application presents ARRL Technician License exam questions in a flashcard format, allowing users to:
- Study questions in a randomized order
- Receive immediate feedback on answers
- Track progress and performance
- Review incorrect answers
- Save incorrect answers for later review
- Practice until mastery

## Features

### Core Functionality
- **Interactive Flashcards**: Each card displays a question and four multiple-choice answers
- **Dual Input Methods**: 
  - Click answers with mouse
  - Use keyboard keys (A, B, C, D) to select answers
- **Question Management**:
  - Questions are randomly selected
  - Each question appears only once until all questions have been shown
  - Questions automatically refresh when all have been answered

### Answer Feedback
- **Visual Feedback**:
  - Correct answers highlighted in green
  - Incorrect answers highlighted in red
  - Large red 'X' displayed for wrong answers
  - Correct answer shown after incorrect response
- **Timing**:
  - 2-second delay after correct answers
  - 4-second delay after incorrect answers for better retention

### Progress Tracking
- **Session Information**:
  - Unique session ID displayed (format: YYYY-MM-DD_HH-MM-SS_randomString)
  - New session ID generated on start, restart, and exit
- **Score Display**:
  - Running total of correct answers
  - Percentage score calculation
  - Number of remaining questions shown
- **Question Identification**:
  - Question ID displayed
  - Question number reference shown

### Study Session Controls
- **Session Management**:
  - Start Quiz: Begin a new study session with new session ID
  - Skip: Move to next question without answering
  - Review: View all incorrect answers
  - Save: Save incorrect answers to server (available throughout the session)
  - Restart: Begin fresh with all questions and new session ID
  - Exit: Return to start screen with new session ID

### Review System
- **Incorrect Answer Review**:
  - Dedicated review screen for missed questions
  - Shows both selected and correct answers
  - Option to save incorrect answers to server
  - Option to resume quiz or exit to start
  - Review screen accessible via Review button

### Save Functionality
- **Server-Based Saving**:
  - Automatic saving on restart and exit (if incorrect answers exist)
  - Manual saving available throughout the session
  - Files saved in server's 'incorrect_answers' directory
  - Unique session ID ensures no file conflicts
  - File naming format: incorrect-answers-[sessionId].json
- **Save Data Structure**:
  ```json
  {
    "sessionId": "YYYY-MM-DD_HH-MM-SS_randomString",
    "timestamp": "ISO-8601 timestamp",
    "score": {
      "correct": number,
      "total": number,
      "percentage": number
    },
    "incorrectAnswers": [
      {
        "questionId": number,
        "question": "string",
        "selectedAnswer": "string",
        "correctAnswer": "string",
        "answers": [
          {
            "text": "string",
            "letter": "string"
          }
        ]
      }
    ]
  }
  ```

### User Interface
- **Clean, Modern Design**:
  - Centered card layout
  - Clear typography
  - Subtle hover effects
  - Responsive button controls
- **Color-Coded Feedback**:
  - Intuitive color scheme for answers
  - High contrast for readability
  - Clear visual hierarchy

## Technical Implementation
- Built with React and modern JavaScript
- Utilizes React Hooks for state management
- Implements Tailwind CSS for styling
- Express.js backend for file saving
- Responsive and accessible design
- Modular component architecture

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start both the frontend and backend servers:
   ```bash
   # Terminal 1 - Start the frontend
   npm start
   
   # Terminal 2 - Start the backend
   node server.js
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Start Quiz" to begin (generates new session ID)
2. Select answers by clicking or using keyboard keys A-D
3. View feedback and correct answers
4. Use control buttons to manage your study session
5. Click "Review" to see incorrect answers
6. Save incorrect answers at any time using the Save button
7. Restart or exit will automatically save incorrect answers
8. Each new session (start/restart/exit) generates a new session ID

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
