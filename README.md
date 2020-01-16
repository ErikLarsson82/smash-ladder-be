## HiQombo Smash Ultimate Ladder - Backend REST API using Postgres as DB<br />

Backend code for https://github.com/ErikLarsson82/smash-ladder-fe<br />

Deployed at https://hiqombo-ladder-be.herokuapp.com/<br />

### API:<br />
/players<br />
/matches<br />
/schedule<br />
/schedulefight<br />
/resolvefight<br />

### Installation
Tested with node Postgres 11.6<br />

Clone repository<br />
npm install<br />
npm run start<br />

Deploy to heroku<br />

### Development
#### Local - Create .env file with this content<br />
DATABASE_URL=localhost<br />
DISABLE_SSL=DISABLED<br />
SLACK_CB_URL=url

#### Remote - For connection to remote url<br />
DATABASE_URL=find this URL at heroku<br />
DISABLE_SSL=ENABLED<br />
SLACK_CB_URL=url

Push to heroku - using .env file aswell<br />
$ PGUSER=postgres PGPASSWORD=hej123 PGPORT=2800 heroku pg:push database_name postgresql-flexible-87882 --app hiqombo-ladder-be

### Making backup of production database
#### Get dynamic Heroku CLI credentials, change date and run
$ PGUSER=postgres PGPASSWORD=hej123 PGPORT=2800 heroku pg:pull postgresql-flexible-87882 hiqombo-prod-16-jan-20 --app hiqombo-ladder-be

### Upload local version
$ PGUSER=postgres PGPASSWORD=hej123 PGPORT=2800 heroku pg:push hiqombo-prod postgresql-flexible-87882 --app hiqombo-ladder-be

### Slack integration
Set the SLACK_CB_URL environment variable to the target channel