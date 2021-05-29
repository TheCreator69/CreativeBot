import * as Help from "./help";
import {CreativeCommand} from "../../scripts/commanddef";
import {Message, Collection} from "discord.js";

test("Sorts an array with commands 'Apple' and 'Banana'. Expects 'Apple' to be at index 0", () => {
    const mockCollection = new Collection<string, CreativeCommand>();
    mockCollection["Banana"] = {name: "Banana", description: "", syntax: "", min_args: 0, admin_only: false, async checkRequiredArgs(message: Message, args: string[]): Promise<boolean> {return true;}, execute(message: Message, args: string[]): void {}};
    mockCollection["Apple"] = {name: "Apple", description: "", syntax: "", min_args: 0, admin_only: false, async checkRequiredArgs(message: Message, args: string[]): Promise<boolean> {return true;}, execute(message: Message, args: string[]): void {}};

    var helpCommand = new Help.Command(mockCollection);
    
    const sortedArray = helpCommand.sortCommandsAlphabetically(mockCollection.array());
    expect(sortedArray[0].name).toBe("Apple");
});
