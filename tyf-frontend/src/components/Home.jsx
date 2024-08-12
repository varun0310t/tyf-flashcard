import React, { useEffect, useRef, useState } from 'react';
import Flashcard from './flashcard';
import '../styles/FlashcardPage.css';
import axios from 'axios';



function FlashcardPage() {
    const modalRef = useRef(null);
    const [cardsData, setcarddata] = useState([]);
    const [focusedCardId, setFocusedCardId] = useState(null);
    const [flippedCardId, setFlippedCardId] = useState(null);
    useEffect(() => {
        axios.get('https://tyf-backend.onrender.com/api/cards')
            .then(response => setcarddata(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleCardClick = (id) => {
        if (focusedCardId === id) {
            // Toggle flip for the currently focused card
            setFlippedCardId(prevId => (prevId === id ? null : id));
        } else {
            // Focus on a new card
            setFocusedCardId(id);
            setFlippedCardId(null); // Reset flip state
        }
    };

    const handleNext = () => {
        if (focusedCardId === null) return;

        const currentIndex = cardsData.findIndex(card => card.id === focusedCardId);
        const nextIndex = (currentIndex + 1) % cardsData.length;
        setFocusedCardId(cardsData[nextIndex].id);
        setFlippedCardId(null); // Reset flip state
    };

    const handlePrevious = () => {
        if (focusedCardId === null) return;

        const currentIndex = cardsData.findIndex(card => card.id === focusedCardId);
        const prevIndex = (currentIndex - 1 + cardsData.length) % cardsData.length;
        setFocusedCardId(cardsData[prevIndex].id);
        setFlippedCardId(null); // Reset flip state
    };

    useEffect(() => {
        const handleOverlayClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                // Clicked outside the modal
                setFocusedCardId(null);
                setFlippedCardId(null);
            }
        };

        if (focusedCardId !== null) {
            const timer = setTimeout(() => {
                document.addEventListener('click', handleOverlayClick);
            }, 100); // Slight delay to ensure click is registered

            return () => {
                clearTimeout(timer);
                document.removeEventListener('click', handleOverlayClick);
            };
        }
    }, [focusedCardId]);

    const focusedCard = cardsData.find(card => card.id === focusedCardId);

    return (
        <div className={`flashcard-page ${focusedCardId ? 'overlay-active' : ''}`}>
            <div className="flashcard-list">
                {cardsData.map(card => (
                    <Flashcard
                        key={card.id}
                        question={card.question}
                        answer={card.answer}
                        isFocused={card.id === focusedCardId}
                        isFlipped={false}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
            {focusedCardId && (
                <>
                    <div className="overlay"></div>
                    <div className="modal">
                        <div className="modal-content" ref={modalRef}>
                            <Flashcard
                                question={focusedCard.question}
                                answer={focusedCard.answer}
                                isFocused={true}
                                isFlipped={flippedCardId === focusedCardId}
                                onClick={() => handleCardClick(focusedCardId)}
                            />
                            <div className="navigation">
                                <button onClick={handlePrevious}>{"<-"}Prev</button>
                                <button onClick={handleNext}>Next{"->"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default FlashcardPage;
