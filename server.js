const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const generateUniqueId = require("generate-unique-id");

// const PORT = process.env.PORT || 3001;
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Variables for fs methods
const readFromFile = util.promisify(fs.readFile);

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

const readAndSplice = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            const indexOfObject = parsedData.findIndex(object => {
                return object.id === content
            });
            parsedData.splice(indexOfObject, 1);
            writeToFile(file, parsedData);
        }
    });
};



const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData was written to ${destination}`)
    );

// GET route for index.html
app.get('/', (req, res) =>
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
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: generateUniqueId({ length: 10 })
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Your new note was added!')
    } else {
        res.error('Error with adding your new note.')
    }
});


// DELETE route for /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received`);
    readAndSplice(req.query, './db/db.json');
    res.json(JSON.parse(data))
});


// How to know if the server is running
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
