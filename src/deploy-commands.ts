import {SlashCommandBuilder} from "@discordjs/builders";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {token} from "./credentials.json";
import * as fs from "fs";
import * as path from "path";
//import * as Localizer from "./scripts/localizer";
import * as CommandFactory from "./scripts/commandfactory";

const commands: any[] = [];

var srcDirPath = getAbsoluteSourceDirPathForEnv();
readCommandFilesAndRegisterCommands(srcDirPath);

const rest = new REST({version: "9"}).setToken(token);

rest.put(Routes.applicationGuildCommands("861740280638341180", "822898508495323196"), {body: commands})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);


function getAbsoluteSourceDirPathForEnv(): string {
    if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        return path.resolve(process.cwd(), "./src");
    }
    else {
        return path.resolve(process.cwd(), "./build");
    }
}

function readCommandFilesAndRegisterCommands(srcDirPath: string): void {
    const commandFolders = fs.readdirSync(`${srcDirPath}/commands`);

    for(const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${srcDirPath}/commands/${folder}`).filter(filterDirectoryForTSAndJSFilesWithoutTests);

        for(const file of commandFiles) {
            const commandModule = require(`./commands/${folder}/${file}`);
            var commandInstance = CommandFactory.createCommand(file, commandModule);

            if(commandInstance === undefined) return;
            commands.push(commandInstance.data.toJSON());
        }
    }
}

function filterDirectoryForTSAndJSFilesWithoutTests(file: string): boolean {
    if(file.endsWith(".js") || file.endsWith(".ts")) {
        if(!file.endsWith(".test.ts")) {
            return true;
        }
        else return false;
    }
    else return false;
}
