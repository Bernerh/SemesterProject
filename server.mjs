import express from 'express'
import USER_API from './routes/usersRoute.mjs'; 
import SuperLogger from './modules/SuperLogger.mjs';
import CARDS_API from './routes/cardsRoute.mjs';
import "dotenv/config";

console.log(process.env.DB_CONNECTIONSTRING)

const server = express();

const port = (process.env.PORT || 8080);
server.set('port', port);

const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());

server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }))

server.use("/users", USER_API);
server.use("/cards", CARDS_API);

server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

