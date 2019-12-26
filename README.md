## HiQombo Smash Ultimate Ladder - Backend REST API using Postgres as DB<br />

Backend code for https://github.com/ErikLarsson82/smash-ladder-fe<br />

Deployed at https://hiqombo-ladder-be.herokuapp.com/<br />

###API:<br />
/players<br />
/matches<br />
/schedule<br />
/schedulefight<br />
/resolvefight<br />

###Installation
Tested with node Postgres 11.6<br/ >

Clone repository<br />
npm install<br />
npm run start<br />

Deploy to heroku<br />

###Development
####Local - Create .env file with this content<br />
DATABASE_URL=localhost<br />
DISABLE_SSL=DISABLED<br />

####Remote - For connection to remote url<br />
DATABASE_URL=find this URL at heroku<br />
DISABLE_SSL=ENABLED<br />

Use these commands to push and pull from/to heroku<br/ >
$ PGUSER=postgres PGPASSWORD= heroku pg:push database_name postgresql-metric-37880 --app hiqombo-ladder-be<br />
$ PGUSER=postgres PGPASSWORD= heroku pg:pull postgresql-metric-37880 database_name --app hiqombo-ladder-be