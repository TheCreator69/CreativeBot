import {client} from "../../index";
import {GuildMember} from "discord.js";

var creativeGuildID = "765328952495046696";
var distinguishedMemberRoleID = "767423198957928448";
var creativeGuild = client.guilds.cache.get(creativeGuildID);

export async function addRoleToTopEarner(userID: bigint): Promise<void> {
    var currentDateGMT = new Date();
    if(currentDateGMT.getDate() < 7) return;

    var topEarner = creativeGuild?.members.cache.get(userID.toString());
    if(topEarner === undefined) return;
    topEarner.roles.add(distinguishedMemberRoleID);
}

export async function removeTopEarnerRoles(): Promise<void> {
    var membersWithRole = creativeGuild?.members.cache.filter((member: GuildMember) => {
        return member.roles.cache.has(distinguishedMemberRoleID);
    });

    if(membersWithRole === undefined) return;
    for(let member of membersWithRole) {
        await member[1].roles.remove(distinguishedMemberRoleID);
    }
}
