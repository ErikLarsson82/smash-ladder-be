const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const resolveLadder = require('./resolveLadder')

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
  const sql = `INSERT INTO schedule (p1slug, p2slug, date) VALUES ('${p1slug}', '${p2slug}', '${date}');`
  pool.query(sql, (err, result) => {
    if (err) console.error(err, result)
    response.status(201).send()
  })
})

function findScheduleById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM schedule WHERE id = ${id};`
    console.log('sql', sql)
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve(results.rows[0])
    })
  })
}

function deleteScheduleById(match) {
  const { id } = match
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM schedule WHERE id = ${id};`, (error, results) => {
      if (error) console.error(error)
      resolve(match)
    })
  })
}

function addMatch(result) {
  return match => {
    console.log(result, match)
    const { p1slug, p2slug, date, id } = match
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO matches (p1slug, p2slug, date, result, p1trend, p2trend, p1preGameIdx, p2preGameIdx) VALUES ('${p1slug}', '${p2slug}', '${date}', '{${result.map(x=>`"${x}"`).join(',')}}', 0, 0, 0, 0);`
      console.log('sql', sql)
      pool.query(sql, (error, results) => {
        if (error) console.error(error)
        resolve()
      })
    })
  }
}

app.post('/resolvefight', (request, response) => {
  console.log('Match resolved', request.body)

  findScheduleById(request.body.id)
    .then(deleteScheduleById)
    .then(addMatch(request.body.result))
    .then(() => response.status(200).send())

  /*
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
  */
})

function select(api) {
  return (req, response) => {
    pool.query(`SELECT * FROM ${api}`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
}
app.get('/players', select('players'))
app.get('/matches', select('matches'))
app.get('/schedule', select('schedule'))

app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`))
