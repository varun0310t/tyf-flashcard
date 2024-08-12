const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port:process.env.port
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Get all cards
app.get('/api/cards', (req, res) => {
    db.query('SELECT * FROM cards', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new card
app.post('/api/cards', (req, res) => {
    const { question, answer } = req.body;
    const query = 'INSERT INTO cards (question, answer) VALUES (?, ?)';
    db.query(query, [question, answer], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, question, answer });
    });
    console.log("added")
});

// Update a card
app.put('/api/cards/:id', (req, res) => {
    const { question, answer } = req.body;
    const query = 'UPDATE cards SET question = ?, answer = ? WHERE id = ?';
    db.query(query, [question, answer, req.params.id], (err) => {
        if (err) throw err;
        res.send('Card updated');
    });
});

// Delete a card
app.delete('/api/cards/:id', (req, res) => {
    const query = 'DELETE FROM cards WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) throw err;
        res.send('Card deleted');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});