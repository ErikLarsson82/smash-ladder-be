const SlackWebhook = require('slack-webhook')

let slack

if ("SLACK_CB_URL" in process.env) {
	slack = new SlackWebhook(process.env.SLACK_CB_URL)
}

function newChallange(player1,player2) {
	if (!slack) return

	const messageBody = {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `Schemalagd: ${player1} vs. ${player2}`
				}
			}
		]
	}
	slack.send(messageBody)
}

function deletedPlayer(player) {
	if (!slack) return

	const messageBody = {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `${player} har valt att lämna stegen :(`
				}
			}
		]
	}
	slack.send(messageBody)
}

function newResolve(player1,player2,score1,score2) {
	if (!slack) return

	const messageBody = {
		"blocks": [
		{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `Match spelad: ${player1} vs. ${player2} ${score1}-${score2}`
				}
			}
		]				
	}
	slack.send(messageBody)
}

function canceledChallange(player1,player2) {
	if (!slack) return
	const messageBody = {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `Matchen mellan ${player1} och ${player2} blev inställd`
				}
			}
		]
	}
	slack.send(messageBody)
}

function announcefight(player1, player2) {
	if (!slack) return
	const messageBody = {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `Nu startar matchen: ${player1} vs. ${player2}`
				}
			}
		]
	}
	slack.send(messageBody)
}

module.exports = { newChallange, newResolve, canceledChallange, announcefight, deletedPlayer }