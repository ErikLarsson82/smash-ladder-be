const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3500;

const players = [
  {
    name: 'Mattias',
    main: '?'
  },
  {
    name: 'Batsis',
    main: 'Pikachu'
  },
  {
    name: 'Stenberg',
    main: 'Ike'
  }
];
const matches = [
  {
    p1: 'Mega man',
    p2: 'Pikachu',
    s1: 2,
    s2: 1,
    date: '2019-11-29T13:31:14.058Z'
  }
];
const schedule = [
  {
    p1: 'Mega man',
    p2: 'Yoshi',
    date: '2019-11-29T13:31:14.058Z'
  }
]

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/newplayer', (req, res) => {
  console.log('New player', req.body)
  players.push(req.body)
  res.send('OK');
});

app.post('/matchplayed', (req, res) => {
  console.log('New match', req.body)
  matches.push(req.body)
  res.send('OK');
})

app.get('/players', (req, res) => res.json(players));
app.get('/matches', (req, res) => res.json(matches));
app.get('/schedule', (req, res) => res.json(schedule));

app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`));
