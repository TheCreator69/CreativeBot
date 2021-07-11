import * as Scheduler from "node-schedule";
import * as TTA from "../database/tokentableaccessor";
import * as RoleManager from "./rolemanager";
import {client} from "../../index";

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
        await RoleManager.removeTopEarnerRoles();
    });

    const distinguishedRoleAwardRule = new Scheduler.RecurrenceRule();
    tokenAndRoleResetRule.tz = "Etc/GMT";
    tokenAndRoleResetRule.date = 7;
    const distinguishedRoleAwardJob = Scheduler.scheduleJob(tokenAndRoleResetRule, async function() {
        const topUserEntries = await TTA.getTopTenUsers();
        for(let i = 0; i < topUserEntries.length; i++) {
            let userEntry = topUserEntries[i];
            let user = await client.users.fetch(userEntry.userID.toString());
            if(user === undefined) break;
            await RoleManager.addRoleToTopEarner(BigInt(user.id));
        }
    });
}
