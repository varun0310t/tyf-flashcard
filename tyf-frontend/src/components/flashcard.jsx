import React from 'react';
import '../styles/FlashcardPage.css';

function Flashcard({ question, answer, isFocused, isFlipped, onClick }) {
  return (
    <div
      className={`flashcard ${isFocused ? 'focused' : ''}`}
      onClick={onClick}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-front">{question}</div>
        <div className="card-back">{answer}</div>
      </div>
    </div>
  );
}

export default Flashcard;
