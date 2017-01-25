# Full Stack Web Development REST Server
Contains the source code for the rest server for the REST server for my Coursera specialisation.

## Running Tests

To run the mocha tests as well as report on test coverage, use the following command. Coverage reports can be viewed with the web interface.
```
$ gulp test
```
Make sure the mongo instance pointed to by the environment variables (see below) is up and running.

For testing the front end, run
```
$ npm start
```

## Heroku Installation from scratch on main server

Create heroku project
Set up the environment variables
Link to gthub repo
Set up schedule for the simulator

## Environments

Environment variables for the rest server port and the mongo server ip and port are contained in the .env file. This is not contained in the repo. An example is:
```
MONGODB_URI='mongodb://user:pwd@localhost:27017/fswd-test'
PORT='3000'
```
Don't forget to ensure that the correct database users has been created with the correct roles:
db.createUser(
   {
     user: "accountUser",
     pwd: "password",
     roles: [ "readWrite", "dbAdmin" ]
   }
)

Include an environment variable for the appropriate logging level when required. If it's not present, it will use 'warn'. Valid values are: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }.
```
LOGGING='debug'
```


## Simulations

The script logdata.js will log recordings (once per run) for testing purposes. It should be run via a scheduler. It does need to following variables added to the environment file. If running on Heroku, the Heroku scheduler works well.
```
REST_SERVER=the-backend-server
REST_PORT=80
```

