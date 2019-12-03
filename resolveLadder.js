
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

  console.log('winner', obj)

  const winnerTargetIdx = players.findIndex(({playerslug}) => playerslug === obj.winner)
  const loserTargetIdx = players.findIndex(({playerslug}) => playerslug === obj.loser)

  if (winnerTargetIdx < loserTargetIdx) return players

  players = players.map(x=>x)

  let temp = players[winnerTargetIdx]
  players[winnerTargetIdx] = players[loserTargetIdx]
  players[loserTargetIdx] = temp

  console.log('winner idx', winnerTargetIdx)
  console.log('loserTargetIdx idx', loserTargetIdx)

  return players
}
