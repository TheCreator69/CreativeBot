import * as ChangeCredits from "./changecredits";
import {User, Client} from "discord.js";

function getFakeUserFromMention(argument: string): User | undefined {
    return new User(new Client(), {});
}
var changeCreditsCommand = new ChangeCredits.ChangeCreditsCommand(getFakeUserFromMention);

test("Checks if entering an invalid operation returns false", async () => {
    var areArgsValid = await changeCreditsCommand.checkRequiredArgs(["notadd"]);
    expect(areArgsValid.valid).toBeFalsy();
});
