import {Client, Interaction} from "discord.js";
import {EventAttributes} from "../scripts/def/eventdef";
import {commands} from "../index";
import {LogChamp, Category} from "../scripts/logchamp";

var logChampInst = new LogChamp(Category.UserInput);

export var info: EventAttributes = {
    name: "interactionCreate",
}

export async function execute(client: Client, interaction: Interaction): Promise<void> {
    logChampInst.info("Interaction created!");
    if(!interaction.isCommand()) return;

    const commandName = interaction.commandName;
    logChampInst.info("Command name retrieved!", {
        name: interaction.commandName,
        interaction: interaction
    });
    if(!commandName) return;

    const commandToRun = commands.get(commandName);
    commandToRun?.executeInteraction(interaction);

    logChampInst.info("Command interaction executed!", {name: interaction.commandName});
}
