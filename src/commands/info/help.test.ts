import * as Help from "./help";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import {Message, Collection} from "discord.js";

const mockCollection = new Collection<string, CreativeCommand>();
var helpCommand = new Help.HelpCommand(mockCollection);



beforeAll(() => {
    mockCollection.set("Banana", {
        name: "Banana", description: "", syntax: "", minArgs: 0, adminOnly: false, guildOnly: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    mockCollection.set("Cherry", {
        name: "Cherry", description: "", syntax: "", minArgs: 0, adminOnly: true, guildOnly: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    mockCollection.set("Apple", {
        name: "Apple", description: "", syntax: "", minArgs: 0, adminOnly: false, guildOnly: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    helpCommand = new Help.HelpCommand(mockCollection);
});



describe("Sort Command Array", () => {
    test("Sorted array of commands 'Apple', 'Banana' and 'Cherry' should return 'Apple' at index '0'", () => {
        const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
        expect(sortedArray[0].name).toBe("Apple");
    });

    test("Sorted array of commands 'Apple', 'Banana' and 'Cherry' should return 'Banana' at index '1'", () => {
        const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
        expect(sortedArray[1].name).toBe("Banana");
    });

    test("Sorted array of commands 'Apple', 'Banana' and 'Cherry' should return 'Cherry' at index '2'", () => {
        const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
        expect(sortedArray[2].name).toBe("Cherry");
    });
});



describe("Does Command Exist for non-admin", () => {
    test("Command of name 'Null' should return false", () => {
        expect(helpCommand.doesCommandExistForAuthor(["Null"])).toBeFalsy();
    });

    test("Non-admin-exclusive command of name 'Apple' should return 'true'", () => {
        expect(helpCommand.doesCommandExistForAuthor(["Apple"])).toBeTruthy();
    });

    test("Admin-exclusive command of name 'Cherry' should return 'false'", () => {
        expect(helpCommand.doesCommandExistForAuthor(["Cherry"])).toBeFalsy();
    });
});



describe("Does Command Exist for admin", () => {
    beforeAll(() => {
        helpCommand.isCommandSenderAdmin = true;
    });

    test("Non-admin-exclusive command of name 'Apple' should return 'true'", () => {
        expect(helpCommand.doesCommandExistForAuthor(["Apple"])).toBeTruthy();
    });

    test("Admin-exclusive command of name 'Cherry' should return 'true'", () => {
        expect(helpCommand.doesCommandExistForAuthor(["Cherry"])).toBeTruthy();
    });

    afterAll(() => {
        helpCommand.isCommandSenderAdmin = false;
    });
});



describe("Get Command Instance", () => {
    test("Command instance of command named 'Null' should be 'undefined'", () => {
        expect(helpCommand.getCommandInstance(["Null"])).toBeUndefined();
    });

    test("Command instance of command named 'Banana' should be 'defined'", () => {
        expect(helpCommand.getCommandInstance(["Banana"])).toBeDefined();
    });
});
