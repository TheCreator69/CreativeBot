import {client} from "../../index";
import {GuildMember} from "discord.js";
import {LogChamp, Category} from "../logchamp";

var logChampInst = new LogChamp(Category.DiscordAction);

var creativeGuildID = "765328952495046696"; //Hard-coded, move to config?
var distinguishedMemberRoleID = "767423198957928448";
var creativeGuild = client.guilds.cache.get(creativeGuildID);

export async function addRoleToTopEarner(userID: bigint): Promise<void> {
    var currentDateGMT = new Date();
    if(currentDateGMT.getDate() < 7) {
        logChampInst.info("Top earner role not awarded because day of month < 7");
        return;
    }

    var topEarner = await creativeGuild?.members.fetch(userID.toString());
    if(topEarner === undefined) {
        logChampInst.warn("Top earner undefined!");
        return;
    }

    topEarner.roles.add(distinguishedMemberRoleID);
    logChampInst.info("Top earner role awarded", {user: topEarner.user.username});
}

export async function removeTopEarnerRoles(): Promise<void> {
    var membersWithRole = creativeGuild?.members.cache.filter((member: GuildMember) => {
        return member.roles.cache.has(distinguishedMemberRoleID);
    });

    if(membersWithRole === undefined) {
        logChampInst.info("No one had the top earner role, so no roles were removed!");
        return;
    }

    for(let member of membersWithRole) {
        await member[1].roles.remove(distinguishedMemberRoleID);
        logChampInst.info("Top earner role removed", {user: member[1].user.username});
    }
}
