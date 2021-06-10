import {Message, MessageAttachment, User} from "discord.js";
import * as Canvas from "canvas";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";
import {client} from "../../index";

export class LeaderboardCommand implements CreativeCommand {
    name = Localizer.translate("leaderboard.name");
    description = Localizer.translate("leaderboard.description");
    syntax = Localizer.translate("leaderboard.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    async execute(message: Message, args: string[]) {
        let topUserEntries = await this.getTopTenUsers();
        let leaderboardImageBuffer = await this.drawLeaderboard(topUserEntries);
        let leaderboardAttachment = new MessageAttachment(leaderboardImageBuffer, "leaderboard.png");
        message.channel.send(leaderboardAttachment);
    }

    async getTopTenUsers(): Promise<CreditsHandler.UserEntry[]> {
        let topUserEntries: CreditsHandler.UserEntry[] = [];
        for(let i = 1; i <= 9; i++) {
            var userEntryAtRank = await CreditsHandler.getUserEntryAtRank(i);
            if(userEntryAtRank !== undefined) {
                topUserEntries.push(userEntryAtRank);
            }
        }
        return topUserEntries;
    }

    async drawLeaderboard(topUserEntries: CreditsHandler.UserEntry[]): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1000, topUserEntries.length * 150);
        const context = canvas.getContext("2d");
        const leaderboardImage = await Canvas.loadImage("./media/CreditsLeaderboard.png");
        context.drawImage(leaderboardImage, 0, 0, canvas.width, 1500);

        for(let i = 0; i < topUserEntries.length; i++) {
            let userEntry = topUserEntries[i];
            let user = await client.users.fetch(userEntry.userID.toString());
            if(user === undefined) break;
            await this.drawUserInfo(context, i, user, userEntry);
        }
        return canvas.toBuffer();
    }

    async drawUserInfo(context: Canvas.CanvasRenderingContext2D, i: number, user: User, userEntry: CreditsHandler.UserEntry): Promise<void> {
        context.font = "80px Arial";
        context.fillStyle = this.getFillStyleForRank(i);
        let correctRankNumber = i + 1;
        context.fillText(correctRankNumber.toString(), 40, 100 + i * 150);

        const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 125, 25 + i * 150, 100, 100);

        context.font = "50px Bahnschrift";
        context.fillText(user.username, 250, 70 + i * 150);
        context.font = "50px Arial";
        context.fillStyle = "#ffff00";
        context.fillText(userEntry.credits.toString(), 310, 120 + i * 150);
    }

    getFillStyleForRank(rank: number): string {
        if(rank === 0) return "#ffd700";
        else if(rank === 1) return "#c0c0c0";
        else if(rank === 2) return "#cd7f32";
        else return "#ffffff";
    }
}
