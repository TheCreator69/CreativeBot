const Winston = require("winston");

const logFormat = Winston.format.printf(({level, message, timestamp}) => {
    return `${timestamp} - ${level}: ${message}`;
});

const logger = Winston.createLogger({
    transports: [new Winston.transports.Console()],
    format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.colorize({all: true, colors: {"info": "white", "warn": "yellow", "error": "red"}}),
        logFormat),
    exitOnError: false
});

module.exports = {
    info(message) {
        log("info", message);
    },
    warn(message) {
        log("warn", message);
    },
    error(message) {
        log("error", message);
    }
};

function log(level, message) {
    if(process.env.NODE_ENV !== "production") {
        logger.log({
            level: level,
            message: message
        });
    }
}
