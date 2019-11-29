const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3500;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const savebook = (req, res) => {
  //const book = req.body;

  books.push({ name: Math.random() });

  res.send('Book is added to the database');
}

app.get('/savebook', savebook);

app.get('/book', (req, res) => {

  console.log('Fetching books');
  res.json(books);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
