import * as ChangeCredits from "./changetokens";
import {User, Client} from "discord.js";

function getFakeUserFromMention(argument: string): User | undefined {
    return new User(new Client(), {});
}
var changeTokensCommand = new ChangeCredits.ChangeTokensCommand(getFakeUserFromMention);

describe("Check Required Arguments", () => {
    test("Entering invalid token change operation 'notadd' should return 'false'", async () => {
        var areArgsValid = await changeTokensCommand.checkRequiredArgs(["notadd"]);
        expect(areArgsValid.valid).toBeFalsy();
    });
});
