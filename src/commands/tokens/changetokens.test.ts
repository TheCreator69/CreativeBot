import * as ChangeCredits from "./changecredits";
import {User, Client} from "discord.js";

function getFakeUserFromMention(argument: string): User | undefined {
    return new User(new Client(), {});
}
var changeTokensCommand = new ChangeCredits.ChangeTokensCommand(getFakeUserFromMention);

test("Checks if entering an invalid operation returns false", async () => {
    var areArgsValid = await changeTokensCommand.checkRequiredArgs(["notadd"]);
    expect(areArgsValid.valid).toBeFalsy();
});
