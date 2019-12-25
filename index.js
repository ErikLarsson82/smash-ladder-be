const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

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
  console.log('/schedulefight', request.body)

  const { p1slug, p2slug, date } = request.body
  const sql = `INSERT INTO schedule (p1slug, p2slug, date) VALUES ('${p1slug}', '${p2slug}', '${date}');`
  pool.query(sql, (err, result) => {
    if (err) console.error(err, result)
    response.status(201).send()
  })
})

app.post('/resolvefight', (request, response) => {
  console.log('/resolvefight', request.body)

  const { p1slug, p2slug, date, result, id } = request.body

  getPlayers(p1slug, p2slug)
    .then(players => {
      const p1prerank = players[0].rank
      const p2prerank = players[1].rank
      const { p1trend, p2trend } = resolveMatch(players[0].rank, players[1].rank, result)

      Promise.all([
        deleteScheduleById(id),
        addMatch({ p1slug, p2slug, date, result, p1trend, p2trend, p1prerank, p2prerank})
      ].concat( p1trend !== 0
          ? swapRanks({ p1slug, p2slug, p1prerank, p2prerank, p1trend, p2trend })
          : resetTrends(p1slug, p2slug) ))
        .then(() => response.status(200).send())
    })
})

app.get('/players', select('players'))
app.get('/matches', select('matches'))
app.get('/schedule', select('schedule'))

app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`))


function findScheduleById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM schedule WHERE id = ${id};`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve(results.rows[0])
    })
  })
}

function deleteScheduleById(id) {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM schedule WHERE id = ${id};`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function addMatch(match) {
  const { p1slug, p2slug, date, result, p1trend, p2trend, p1prerank, p2prerank } = match
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO matches (p1slug, p2slug, date, result, p1trend, p2trend, p1prerank, p2prerank) VALUES ('${p1slug}', '${p2slug}', '${date}', '{${result.map(x=>`"${x}"`).join(',')}}', '${p1trend}', '${p2trend}', '${p1prerank}', '${p2prerank}');`, (error, results) => {
      if (error) console.error(error)
      resolve({ p1slug: p1slug, p2slug: p2slug})
    })
  })
}

function getPlayer(slug) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM players WHERE playerslug = '${slug}';`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve(results.rows[0])
    })
  })
}

function getPlayers(p1slug, p2slug) {
  return Promise.all([getPlayer(p1slug), getPlayer(p2slug)])
}

function swapRanks({ p1slug, p2slug, p1prerank, p2prerank, p1trend, p2trend }) {
  return Promise.all([
    updatePlayer(p1slug, p2prerank, p1trend),
    updatePlayer(p2slug, p1prerank, p2trend)
  ])
}

function resetTrends(p1slug, p2slug) {
  return Promise.all([
    updateTrend(p1slug, 0),
    updateTrend(p2slug, 0)
  ])
}

function updateTrend(slug, trend) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE players SET trend = ${trend} WHERE playerslug = '${slug}';`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function updatePlayer(slug, rank, trend) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE players SET rank = ${rank}, trend = ${trend} WHERE playerslug = '${slug}';`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

/* resolveMatch - Determine who trends how */
// Example
// JSON.stringify(resolveMatch(3,5, ['p1', 'p1']) === JSON.stringify({p1trend: 0, p2trend: 0})
// JSON.stringify(resolveMatch(3,5, ['p2', 'p2']) === JSON.stringify({p1trend: -2, p2trend: 2})
// JSON.stringify(resolveMatch(5,3, ['p1', 'p1']) === JSON.stringify({p1trend: 2, p2trend: -2})
// JSON.stringify(resolveMatch(5,3, ['p2', 'p2']) === JSON.stringify({p1trend: 0, p2trend: 0})
function resolveMatch(p1rank, p2rank, result) {

  const diff = Math.max(p1rank, p2rank) - Math.min(p1rank, p2rank)

  const p1winner = result.filter(x=>x==='p1').length > result.filter(x=>x==='p2').length

  if ((p1rank < p2rank && p1winner) || (p1rank > p2rank && !p1winner))  {
    return {
      p1trend: 0,
      p2trend: 0
    }
  }

  return {
    p1trend: diff * (p1winner ? 1 : -1),
    p2trend: diff * (p1winner ? -1 : 1)
  }
}

function select(api) {
  return (req, response) => {
    pool.query(`SELECT * FROM ${api}`, (error, results) => {
      if (error) console.error(error)
      response.status(200).json(results.rows)
    })
  }
}
