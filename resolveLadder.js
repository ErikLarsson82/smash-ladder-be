
module.exports = function resolveLadder(players, match) {
  const obj = match.result.filter(x => x === 'p1').length > match.result.filter(x => x ==='p2').length
    ? {
      winner: match.p1slug,
      loser: match.p2slug,
    }
    : {
      winner: match.p2slug,
      loser: match.p1slug,
    }

  const winnerTargetIdx = players.findIndex(({playerslug}) => playerslug === obj.winner)
  const loserTargetIdx = players.findIndex(({playerslug}) => playerslug === obj.loser)

  const diff = Math.max(winnerTargetIdx, loserTargetIdx) - Math.min(winnerTargetIdx, loserTargetIdx)

  players[winnerTargetIdx].trend = 0
  players[loserTargetIdx].trend = 0

  if (winnerTargetIdx < loserTargetIdx) {
    return {
      players: players,
      p1trend: 0,
      p2trend: 0
    }
  }

  players[winnerTargetIdx].trend = diff
  players[loserTargetIdx].trend = diff * -1

  players = players.map(x=>x)

  let temp = players[winnerTargetIdx]
  players[winnerTargetIdx] = players[loserTargetIdx]
  players[loserTargetIdx] = temp

  return {
    players: players,
    p1trend: diff,
    p2trend: diff * -1
  }
}
