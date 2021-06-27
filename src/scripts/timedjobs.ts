import * as Scheduler from "node-schedule";
import * as TTA from "./tokentableaccessor";

export function scheduleTimedJobs() {
    const vouchTokenResetRule = new Scheduler.RecurrenceRule();
    vouchTokenResetRule.tz = "Etc/GMT";
    vouchTokenResetRule.hour = 0;
    Scheduler.scheduleJob(vouchTokenResetRule, async function() {
        await TTA.resetVouchTokens();
    });
}
