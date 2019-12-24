const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const resolveLadder = require('./resolveLadder')
let players = require('./players.json')
let matches = require('./matches.json')
let schedule = require('./schedule.json')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'hiqombo',
  password: 'password',
  port: 2800,
})

const app = express()
const port = process.env.PORT || 1337

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/schedulefight', (request, response) => {
  const { p1slug, p2slug, date } = request.body
  console.log('New scheduled game', request.body)
  const sql = `INSERT INTO schedule (ps1slug, ps2slug, date) VALUES ('${p1slug}', '${p2slug}', '${date}');`
  pool.query(sql, (err, result) => {
    if (err) console.error(err, result)
    response.status(201).send()
  })
})

app.post('/resolvefight', (req, res) => {
  console.log('Match resolved', req.body)
  const match = req.body
  schedule = schedule.filter(
    ({p1slug, p2slug}) => !((match.p1slug === p1slug) && (match.p2slug === p2slug))
  )
  const result = resolveLadder(players, match)
  players = result.players
  matches.push({
    ...match,
    p1trend: result.p1trend,
    p2trend: result.p2trend,
    p1preGameIdx: result.p1preGameIdx,
    p2preGameIdx: result.p2preGameIdx
  })
  res.send('OK')
  fs.writeFileSync('schedule.json', JSON.stringify(schedule))
  fs.writeFileSync('matches.json', JSON.stringify(matches))
  fs.writeFileSync('players.json', JSON.stringify(players))

})

app.get('/players', (req, response) => {
  pool.query('SELECT * FROM players', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
})

app.get('/matches', (req, res) => res.json(matches))
app.get('/schedule', (req, res) => res.json(schedule))

app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`))
