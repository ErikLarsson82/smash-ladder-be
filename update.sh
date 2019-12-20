curl -o matches.json 'https://hiqombo-ladder-be.herokuapp.com/matches'
curl -o schedule.json 'https://hiqombo-ladder-be.herokuapp.com/schedule'
curl -o players.json 'https://hiqombo-ladder-be.herokuapp.com/players'
git add players.json
git add matches.json
git add schedule.json
git commit -m "Auto-update players, matches and schedule"
git push origin master
git push heroku master
