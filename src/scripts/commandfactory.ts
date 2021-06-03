import {commands} from "../index";
import {CreativeCommand} from "./commanddef";
import {getUserFromMention} from "./discordutil";

export function createCommand(file: string, commandModule: any): CreativeCommand | undefined {
    file = file.substr(0, file.length - 3);
    switch(file) {
        case "changecredits": return new commandModule.ChangeCreditsCommand(getUserFromMention);
        case "credits": return new commandModule.CreditsCommand();
        case "setevent": return new commandModule.SetEventCommand();
        case "submit": return new commandModule.SubmitCommand();
        case "toggleevent": return new commandModule.ToggleEventCommand();
        case "gameidea": return new commandModule.GameIdeaCommand();
        case "math": return new commandModule.MathCommand();
        case "obama": return new commandModule.ObamaCommand();
        case "slots": return new commandModule.SlotsCommand();
        case "thumbsup": return new commandModule.ThumbsupCommand();
        case "help": return new commandModule.HelpCommand(commands);
        case "ping": return new commandModule.PingCommand();
        case "socials": return new commandModule.SocialsCommand();
        case "testcmd": return new commandModule.TestCommand();
        default: return undefined;
    }
}
