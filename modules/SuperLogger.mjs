
import Chalk from "chalk";
import { HTTPMethods } from "./httpConstants.mjs"
import fs from "fs/promises"

let COLORS = {};
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

class SuperLogger {
    static LOGGING_LEVELS = {
        ALL: 0,         // We output everything, no limits
        VERBOSE: 5,     // We output a lott, but not 
        NORMAL: 10,     // We output a moderate amount of messages
        IMPORTANT: 100, // We output just siginfican messages
        CRTICAL: 999    // We output only errors. 
    };

    #globalThreshold = SuperLogger.LOGGING_LEVELS.ALL;
    #loggers;

    static instance = null;

    constructor() {
        if (SuperLogger.instance == null) {
            SuperLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        return SuperLogger.instance;
    }

    static log(msg, logLevl = SuperLogger.LOGGING_LEVELS.NORMAL) {
        let logger = SuperLogger.instance;
        if (logger.#globalThreshold > logLevl) {
            return;
        }
        logger.#writeToLog(msg);
    }

    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {
        const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;
        return (req, res, next) => {
            if (this.#globalThreshold > threshold) {
                return;
            }
            this.#LogHTTPRequest(req, res, next);
        }
    }

    #LogHTTPRequest(req, res, next) {
        let type = req.method;
        const path = req.originalUrl;
        const when = new Date().toLocaleTimeString();
        type = colorize(type);
        this.#writeToLog([when, type, path].join(" "));
        next();
    }

    #writeToLog(msg) {
        msg += "\n";
        console.log(msg);
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => { });
    }
}

export default SuperLogger