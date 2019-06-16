const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require('path');

const app = express();
const PORT = 3300;

app.use(bodyparser.json())
app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/client')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/client/index.html'));
  });


const Users = require("./server/routes/Users");
const Counts = require("./server/routes/Counts");
const Messages = require("./server/routes/Message");

app.use('/api/users', Users);
app.use('/api/users/count', Counts);
app.use('/api/users/messages', Messages);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});
