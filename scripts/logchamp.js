const Winston = require("winston");

const logger = Winston.createLogger({
    transports: [new Winston.transports.Console()],
    format: Winston.format.simple(),
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
    logger.log({
        level: level,
        message: message
    });
}
