import * as Help from "./help";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {Message, Collection} from "discord.js";

const mockCollection = new Collection<string, CreativeCommand>();
var helpCommand = new Help.HelpCommand(mockCollection);

beforeAll(() => {
    mockCollection.set("Banana", {
        name: "Banana", description: "", syntax: "", min_args: 0, admin_only: false, guild_only: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    mockCollection.set("Cherry", {
        name: "Cherry", description: "", syntax: "", min_args: 0, admin_only: true, guild_only: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    mockCollection.set("Apple", {
        name: "Apple", description: "", syntax: "", min_args: 0, admin_only: false, guild_only: false,
        async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {return {valid: true};},
        execute(message: Message, args: string[]): void {}
    });
    helpCommand = new Help.HelpCommand(mockCollection);
});

test("Sorts an array with commands 'Apple', 'Banana' and 'Cherry'. Expects 'Apple' to be at index 0", () => {
    const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
    expect(sortedArray[0].name).toBe("Apple");
});

test("Sorts an array with commands 'Apple', 'Banana' and 'Cherry'. Expects 'Banana' to be at index 1", () => {
    const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
    expect(sortedArray[1].name).toBe("Banana");
});

test("Sorts an array with commands 'Apple', 'Banana' and 'Cherry'. Expects 'Cherry' to be at index 2", () => {
    const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
    expect(sortedArray[2].name).toBe("Cherry");
});

test("Checks if the 'Null' command exists. Expects result to be false", () => {
    expect(helpCommand.doesCommandExistForAuthor(["Null"])).toBeFalsy();
});

test("Checks if the Apple command exists when the player isn't an admin and the command isn't admin-only. Expects result to be true", () => {
    expect(helpCommand.doesCommandExistForAuthor(["Apple"])).toBeTruthy(); //admin_only = false
});

test("Checks if the Cherry command exists when the player isn't an admin and the command is admin-only. Expects result to be false", () => {
    expect(helpCommand.doesCommandExistForAuthor(["Cherry"])).toBeFalsy(); //admin_only = true
});

test("Checks if the Apple command exists when the player is an admin and the command isn't admin-only. Expects result to be true", () => {
    helpCommand.isCommandSenderAdmin = true;
    expect(helpCommand.doesCommandExistForAuthor(["Apple"])).toBeTruthy(); //admin_only = false
    helpCommand.isCommandSenderAdmin = false;
});

test("Checks if the Cherry command exists when the player is an admin and the command is admin-only. Expects result to be true", () => {
    helpCommand.isCommandSenderAdmin = true;
    expect(helpCommand.doesCommandExistForAuthor(["Cherry"])).toBeTruthy(); //admin_only = true
    helpCommand.isCommandSenderAdmin = false;
});

test("Attempts to get the command 'Null' from the list of commands and expects the return value to be undefined", () => {
    expect(helpCommand.getCommandInstance(["Null"])).toBeUndefined();
});

test("Attempts to get the command 'Banana' from the list of commands and expects the return value not to be undefined - basically, to be defined", () => {
    expect(helpCommand.getCommandInstance(["Banana"])).not.toBeUndefined();
});
