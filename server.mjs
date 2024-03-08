import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import SuperLogger from './modules/SuperLogger.mjs';
import CARDS_API from './routes/cardsRoute.mjs';
import "dotenv/config"; //Postgres stuff *delete
//import DBManager from './storageManager.mjs';//Postgres stuff *delete

console.log(process.env.DB_CONNECTIONSTRING)

// Creating an instance of the server
const server = express();

// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging for server 
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

// Defining a folder that will contain static files.
server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

// Telling the server to use the USER_API 
server.use("/users", USER_API);
server.use("/cards", CARDS_API);

// A get request handler example)
server.get("/", (req, res, next) => {

    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

