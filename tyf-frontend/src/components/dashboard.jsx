import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/dashboard.css" // Import the CSS file

function DashboardPage() {
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({ question: '', answer: '' });
    const [editingCard, setEditingCard] = useState(null);
    const [editedCard, setEditedCard] = useState({ question: '', answer: '' });

    useEffect(() => {
        axios.get('https://tyf-backend.onrender.com/api/cards')
            .then(response => setCards(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAddCard = () => {
        axios.post('https://tyf-backend.onrender.com/api/cards', newCard)
            .then(response => {
                setCards([...cards, response.data]);
                setNewCard({ question: '', answer: '' });
            })
            .catch(error => console.error('Error adding card:', error));
    };

    const handleDeleteCard = (id) => {
        axios.delete(`https://tyf-backend.onrender.com/api/cards/${id}`)
            .then(() => {
                setCards(cards.filter(card => card.id !== id));
                setEditingCard(null);
                setEditedCard({ question: '', answer: '' });
            })
            .catch(error => console.error('Error deleting card:', error));
    };

    const handleEditCard = (card) => {
        setEditingCard(card.id);
        setEditedCard({ question: card.question, answer: card.answer });
    };

    const handleSaveEdit = () => {
        axios.put(`https://tyf-backend.onrender.com/api/cards/${editingCard}`, editedCard)
            .then(() => {
                setCards(cards.map(card => card.id === editingCard ? { ...card, ...editedCard } : card));
                setEditingCard(null);
                setEditedCard({ question: '', answer: '' });
            })
            .catch(error => console.error('Error updating card:', error));
    };

    const handleClickCard = (card) => {
        setEditingCard(card.id);
        setEditedCard({ question: card.question, answer: card.answer });
    };

    return (
        <div className="dashboard-container">
            <div className="cards-list">
                <h2>Manage Cards</h2>
                <ul>
                    {cards.map(card => (
                        <li key={card.id} onClick={() => handleClickCard(card)}>
                            <span>{card.question}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="details-panel">
                <div className="add-card-section">
                    <h2>Add New Card</h2>
                    <input
                        type="text"
                        placeholder="Question"
                        value={newCard.question}
                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Answer"
                        value={newCard.answer}
                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                    />
                    <button onClick={handleAddCard}>Add Card</button>
                </div>
                {editingCard !== null && (
                    <div className="edit-card-section">
                        <h2>Edit Card</h2>
                        <input
                            type="text"
                            placeholder="Question"
                            value={editedCard.question}
                            onChange={(e) => setEditedCard({ ...editedCard, question: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Answer"
                            value={editedCard.answer}
                            onChange={(e) => setEditedCard({ ...editedCard, answer: e.target.value })}
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={() => setEditingCard(null)}>Cancel</button>
                        <button onClick={() => handleDeleteCard(editingCard)}>Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
