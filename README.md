## HiQombo Smash Ultimate Ladder - Backend REST API<br />

Backend code for https://github.com/ErikLarsson82/smash-ladder-fe<br />

Deployed at https://hiqombo-ladder-be.herokuapp.com/<br />

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

Deploy to heroku<br />

### Caution! If you clone, build and deploy you will overwrite the current ladder

Work in progress is migration to permanent storage using Postgres 11.6

Create local .env file with this content for local development
DATABASE_URL=localhost
DISABLE_SSL=DISABLED
For connection to remote url
DATABASE_URL=postgres://ysjhedrbckefjg:56e7694013e0fb82c6b623ec00edb53b06ab43b05fa4fdb4a49489e4ff317286@ec2-54-228-207-163.eu-west-1.compute.amazonaws.com:5432/d7un18qlemh8dq
DISABLE_SSL=ENABLED

Use these commands to push and pull from/to heroku
$ PGUSER=postgres PGPASSWORD= heroku pg:push database_name postgresql-metric-37880 --app hiqombo-ladder-be
$ PGUSER=postgres PGPASSWORD= heroku pg:pull postgresql-metric-37880 database_name --app hiqombo-ladder-be