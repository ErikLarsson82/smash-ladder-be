require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const slack = require('./slack')

const ssl = process.env.DISABLE_SSL === 'DISABLED' ? false : true
const port = process.env.PORT || 1337

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: ssl
}

const Pool = require('pg').Pool
const pool = new Pool(config)

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/schedulefight', schedulefight)
app.post('/removefight', removefight)
app.post('/resolvefight', resolvefight)
app.post('/announcefight', announcefight)
app.post('/admin/removePlayer',adminRemovePlayer);
//app.post('/admin/addPlayer',adminAddPlayer);
app.post('/updateplayer', updateplayer)

app.get('/players', select('players', x => ({...x, name: unescape(x.name) })))
app.get('/matches', select('matches'))
app.get('/schedule', select('schedule'))


app.listen(port, () => console.log(`Smash ladder BE started - listening on port ${port}`))

async function updateplayer(request, response) {
  console.log('/updateplayer', request.body)

  const { playerslug, main, secondary } = request.body

  await updatePlayerIcons(playerslug, main, secondary)
  response.status(200).send()
}

async function adminRemovePlayer(request,response)
{
	console.log('/admin/RemovePlayer',request.body)
	const {key,slug} = request.body
	const maxRank = await getHighetsRank()
	const player = await getPlayer(slug)
	await removePlayer(slug)
	await removeGapFix(player.rank)
	console.log('/admin/RemovePlayer'," await removeGapFix DONE")
	console.log('/admin/RemovePlayer',request.body)
	response.status(200).send()
}

//async function adminAddPlayer(request,response)
//{
//	
//}
function getHighetsRank() {
  return new Promise((resolve, reject) => {
    const presql = `SELECT MAX(rank) FROM players;`
    pool.query(presql, (err, result) => {
      if (err) console.error(err, result)
      
      resolve(result.rows[0].max)
    })
  })
}

function removePlayer(slug) {

  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM players WHERE playerslug = '${slug}';`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function removeGapFix(rank) {
  return new Promise((resolve, reject) => {
    const sql = `update players SET rank = rank -1 where rank > ${rank};`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function cleanScheduledMatches(slug) {
  return new Promise((resolve, reject) => {
  const sql = `Delete FROM schedule WHERE p1slug = '${slug}' or p2slug = '${slug}'';`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function cleanScheduledMatches(slug) {
  return new Promise((resolve, reject) => {
  const sql = `Delete FROM matches WHERE p1slug = '${slug}' or p2slug = '${slug}'';`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

async function schedulefight(request, response)  {
  console.log('/schedulefight', request.body)

  const match = request.body
  const { p1slug, p2slug, date } = request.body

  const count = await countScheduled(p1slug, p2slug)

  // When match already exists as scheduled
  if (count > 0) {
    response.status(200).send()
    return
  }

  const [player1, player2] = await getPlayers(p1slug, p2slug)

  await addScheduled(match)
  response.status(201).send()

  slack.newChallange(unescape(player1.name), unescape(player2.name))
} 

async function removefight(request, response) {
  console.log('/removefight', request.body)

  const { id } = request.body
  
  const { p1slug, p2slug} = await getSchedule(id)
    
  await deleteSchedule(id)
  response.status(200).send()

  const [player1, player2] = await getPlayers(p1slug, p2slug)
  slack.canceledChallange(unescape(player1.name), unescape(player2.name))
}

async function resolvefight(request, response) {
  console.log('/resolvefight', request.body)

  const match = request.body
  const { p1slug, p2slug, date, result, id } = match

  const [player1, player2] = await getPlayers(p1slug, p2slug)
  const p1prerank = player1.rank
  const p2prerank = player2.rank
  
  const { p1trend, p2trend } = await resolveMatch(player1.rank, player2.rank, result)

  await deleteSchedule(id)
  await addMatch({ p1slug, p2slug, date, result, p1trend, p2trend, p1prerank, p2prerank})

  p1trend !== 0
    ? await swapRanks({ p1slug, p2slug, p1prerank, p2prerank, p1trend, p2trend })
    : await resetTrends(p1slug, p2slug)

  response.status(200).send()
  slack.newResolve(unescape(player1.name), unescape(player2.name), result.filter(x=>x==='p1').length, result.filter(x=>x==='p2').length)
}

function announcefight(request, response) {
  const { player1, player2 } = request.body
  slack.announcefight(player1, player2)
  response.status(200).send()
}

function getSchedule(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM schedule WHERE id = ${id};`
    pool.query(sql, (error, results) => {
      if (error) console.error(error)
      resolve(results.rows[0])
    })
  })
}

function deleteSchedule(id) {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM schedule WHERE id = ${id};`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function addScheduled(match) {
  const { p1slug, p2slug, date } = match
  const sql = `INSERT INTO schedule (p1slug, p2slug, date) VALUES ('${p1slug}', '${p2slug}', '${date}');`
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) console.error(err, result)
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
    updatePlayerRank(p1slug, p2prerank, p1trend),
    updatePlayerRank(p2slug, p1prerank, p2trend)
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

function updatePlayerRank(slug, rank, trend) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE players SET rank = ${rank}, trend = ${trend} WHERE playerslug = '${slug}';`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

const stringValueOrNull = x => x ? `'${x}'` : 'null'

function updatePlayerIcons(slug, main, secondary) {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE players SET main = ${stringValueOrNull(main)}, secondary = ${stringValueOrNull(secondary)} WHERE playerslug = '${slug}';`, (error, results) => {
      if (error) console.error(error)
      resolve()
    })
  })
}

function countScheduled(p1slug, p2slug) {
  return new Promise((resolve, reject) => {
    const presql = `SELECT COUNT(*) FROM schedule WHERE (p1slug = '${p1slug}' AND p2slug = '${p2slug}') or (p1slug = '${p2slug}' AND p2slug = '${p1slug}');`
    pool.query(presql, (err, result) => {
      if (err) console.error(err, result)
      
      resolve(result.rows[0].count)
    })
  })
}

/* resolveMatch - Determine who trends how */
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

function select(api, mapper) {
  return (req, response) => {
    pool.query(`SELECT * FROM ${api};`, (error, results) => {
      if (error) console.error(error)
      response.status(200).json(results.rows.map(mapper ? mapper : x=>x))
    })
  }
}