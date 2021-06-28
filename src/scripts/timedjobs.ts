import * as Scheduler from "node-schedule";
import * as TTA from "./tokentableaccessor";
import {client} from "../index";
import {GuildMember} from "discord.js";

export function scheduleTimedJobs() {
    const vouchTokenResetRule = new Scheduler.RecurrenceRule();
    vouchTokenResetRule.tz = "Etc/GMT";
    vouchTokenResetRule.hour = 0;
    const vouchTokenResetJob = Scheduler.scheduleJob(vouchTokenResetRule, async function() {
        await TTA.resetVouchTokens();
    });

    const tokenAndRoleResetRule = new Scheduler.RecurrenceRule();
    tokenAndRoleResetRule.tz = "Etc/GMT";
    tokenAndRoleResetRule.date = 1;
    const tokenAndRoleResetJob = Scheduler.scheduleJob(tokenAndRoleResetRule, async function() {
        await TTA.resetTokens();
        removeTopEarnerRoles();
    });
}

function removeTopEarnerRoles() {
    var creativeGuildID = "765328952495046696";
    var distinguishedMemberRoleID = "767423198957928448";

    var creativeGuild = client.guilds.cache.get(creativeGuildID);
    var membersWithRole = creativeGuild?.members.cache.filter((member: GuildMember) => {
        return member.roles.cache.has(distinguishedMemberRoleID);
    });

    if(membersWithRole === undefined) return;
    for(let member of membersWithRole) {
        member[1].roles.remove(distinguishedMemberRoleID);
    }
}
