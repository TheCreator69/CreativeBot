import * as Winston from "winston";

const logFormat = Winston.format.printf(({level, message, timestamp}) => {
    return `${timestamp} - ${level}: ${message}`;
});

const logger = Winston.createLogger({
    transports: [new Winston.transports.Console()],
    format: Winston.format.combine(
        Winston.format.timestamp({format: "DD.MM.YYYY, HH:mm:ss"}),
        Winston.format.colorize({all: true, colors: {"info": "white", "warn": "yellow", "error": "red"}}),
        logFormat),
    exitOnError: false
});

export function info(message: string) {
    log("info", message);
}

export function warn(message: string) {
    log("warn", message);
}

export function error(message: string) {
    log("error", message);
}

function log(level: string, message: string) {
    logger.log({
        level: level,
        message: message
    });
}
