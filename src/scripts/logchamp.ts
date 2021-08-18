import * as Winston from "winston";

const logger = Winston.createLogger({
    format: Winston.format.combine(
        Winston.format.timestamp({format: "DD.MM.YYYY, HH:mm:ss.SSS"}),
        Winston.format.prettyPrint()
    ),
    transports: [
        new Winston.transports.File({filename: "error.log", level: "error", maxsize: 10000000, maxFiles: 1}),
        new Winston.transports.File({filename: "output.log", level: "info", maxsize: 10000000, maxFiles: 5, tailable: true})
    ],
    exitOnError: false,
});

if(process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
    logger.add(new Winston.transports.Console({level: "debug", consoleWarnLevels: ["warn", "error"]}));
}

export class LogChamp {
    logCategory: Category = Category.Default;

    constructor(category: Category) {
        this.logCategory = category;
    }

    debug(message: string, ...args: any[]) {
        this.log("debug", message, args);
    }

    info(message: string, ...args: any[]) {
        this.log("info", message, args);
    }

    warn(message: string, ...args: any[]) {
        this.log("warn", message, args);
    }

    error(message: string, ...args: any[]) {
        this.log("error", message, args);
    }

    private log(level: string, message: string, ...args: any[]) {
        var messageWithCategory = `${Category[this.logCategory]}:>${message}`;
        logger.log(level, messageWithCategory, args);
    }
}

export enum Category {
    Default,

    Startup,
    Shutdown,

    //Input
    DiscordJSEvent,
    UserInput,
    CronJob,

    //Processing
    TextProcessing,
    ImageProcessing,
    Localization,
    DatabaseQuery,

    //Output
    BotMessage,
    DiscordAction
}
