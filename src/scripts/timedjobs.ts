import * as Scheduler from "node-schedule";
import * as TTA from "./tokentableaccessor";

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
    });
}
