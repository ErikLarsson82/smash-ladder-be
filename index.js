const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3500;

let players = [
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
let matches = []
let schedule = []

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/newplayer', (req, res) => {
  console.log('New player', req.body)
  players.push(req.body)
  res.send('OK');
});

app.post('/resolvefight', (req, res) => {
  console.log('Match resolved', req.body)
  const match = req.body
  schedule = schedule.filter(({p1, p2}) => match.p1 === p1 && match.p2 === p2)
  matches.push(match)
  res.send('OK');
})

app.get('/players', (req, res) => res.json(players));
app.get('/matches', (req, res) => res.json(matches));
app.get('/schedule', (req, res) => res.json(schedule));

app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`));
