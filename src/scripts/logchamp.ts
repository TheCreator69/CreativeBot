import * as Winston from "winston";

const logger = Winston.createLogger({
    format: Winston.format.combine(
        Winston.format.timestamp({format: "DD.MM.YYYY, HH:mm:ss"}),
        Winston.format.prettyPrint()
    ),
    exitOnError: false,
    transports: [
        new Winston.transports.File({filename: "error.log", level: "error"}),
        new Winston.transports.File({filename: "output.log"})
    ],
});

if(process.env.NODE_ENV !== "production") {
    logger.add(new Winston.transports.Console());
}

export function info(message: string, ...args: any[]) {
    log("info", message, args);
}

export function warn(message: string, ...args: any[]) {
    log("warn", message, args);
}

export function error(message: string, ...args: any[]) {
    log("error", message, args);
}

function log(level: string, message: string, ...args: any[]) {
    logger.log(level, message, args);
}
