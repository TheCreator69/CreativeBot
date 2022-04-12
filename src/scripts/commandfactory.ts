import {commands} from "../index";
import {CreativeCommand} from "./def/commanddef";
import {getUserFromMention} from "./discordutil";
import {LogChamp, Category} from "./logchamp";

var logChampInst = new LogChamp(Category.Startup);

export function createCommand(file: string, commandModule: any): CreativeCommand | undefined {
    file = file.substr(0, file.length - 3);
    var createdCommand: CreativeCommand | undefined;
    switch(file) {
        case "react": createdCommand = new commandModule.ReactionCommand(); break;
        case "setevent": createdCommand = new commandModule.SetEventCommand(); break;
        case "submit": createdCommand = new commandModule.SubmitCommand(); break;
        case "toggleevent": createdCommand = new commandModule.ToggleEventCommand(); break;
        case "gameidea": createdCommand = new commandModule.GameIdeaCommand(); break;
        case "math": createdCommand = new commandModule.MathCommand(); break;
        case "obama": createdCommand = new commandModule.ObamaCommand(); break;
        case "slots": createdCommand = new commandModule.SlotsCommand(); break;
        case "thumbsup": createdCommand = new commandModule.ThumbsupCommand(); break;
        case "changelog": createdCommand = new commandModule.ChangelogCommand(); break;
        case "help": createdCommand = new commandModule.HelpCommand(commands); break;
        case "ping": createdCommand = new commandModule.PingCommand(); break;
        case "socials": createdCommand = new commandModule.SocialsCommand(); break;
        case "testcmd": createdCommand = new commandModule.TestCommand(); break;
        case "changetokens": createdCommand = new commandModule.ChangeTokensCommand(getUserFromMention); break;
        case "leaderboard": createdCommand = new commandModule.LeaderboardCommand(); break;
        case "tokens": createdCommand = new commandModule.TokensCommand(); break;
        case "tokensystem": createdCommand = new commandModule.TokenSystemCommand(); break;
        case "vouch": createdCommand = new commandModule.VouchCommand(); break;
        default: createdCommand = undefined;
    }
    logChampInst.debug("Command object requested", {fileName: file, commandName: createdCommand?.name});
    return createdCommand;
}
