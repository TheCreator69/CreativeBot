import * as ChangeCredits from "./changecredits";

var changeCreditsCommand = new ChangeCredits.ChangeCreditsCommand();
//Currently fails, because a function in checkRequiredArgs() calls a function which calls "client" from "index.ts". Wonderful.
//Gotta add callbacks or something like that.

test("Checks if entering an invalid operation returns false", async () => {
    var areArgsValid = await changeCreditsCommand.checkRequiredArgs(["notadd"]);
    expect(areArgsValid.valid).toBeFalsy();
});
