import * as ChangeCredits from "./changetokens";
import {User, Client, Intents, SnowflakeUtil} from "discord.js";

function getFakeUserFromMention(argument: string): User | undefined {
    return new User(
        new Client({intents: Intents.FLAGS.GUILD_MESSAGES}),
        {id: SnowflakeUtil.generate(), username: "Dummy", discriminator: "1337", avatar: "bd7128ac32f"}
    );
}
var changeTokensCommand = new ChangeCredits.ChangeTokensCommand(getFakeUserFromMention);

describe("Check Required Arguments", () => {
    test("Entering invalid token change operation 'notadd' should return 'false'", async () => {
        var areArgsValid = await changeTokensCommand.checkRequiredArgs(["notadd"]);
        expect(areArgsValid.valid).toBeFalsy();
    });
});
