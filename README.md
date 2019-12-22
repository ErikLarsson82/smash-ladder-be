## HiQombo Smash Ultimate Ladder - Backend REST API<br />

Backend code for https://github.com/ErikLarsson82/smash-ladder-fe<br />

Deployed at https://hiqombo-ladder.herokuapp.com/<br />

### Caution! If you deploy new code without running bash script update.sh and push-commit.sh, you will overwrite the volatie JSON lists on the server.<br />
The update-script downloads all JSON files and pushes the changes.<br/>

API:<br />
/players<br />
/matches<br />
/schedule<br />
/schedulefight<br />
/resolvefight<br />

JSON files acts like a database containing all players, matches and schedule.<br />

Clone repository<br />
npm install<br />
npm run start<br />

Deploy to heroko<br />

### Caution! If you clone, build and deploy you will overwrite the current ladder
