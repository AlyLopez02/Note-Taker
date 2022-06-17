const express = require('express');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require("generate-unique-id");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route for index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Get route for /api/notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received.`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST route for /api/notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    const { title, text} = req.body;

    if (req.body){
        const newNote = {
            title,
            text,
            note_id: generateUniqueId({length: 10})
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Your new note was added!')
    } else {
        res.error('Error with adding your new note.')
    }
});