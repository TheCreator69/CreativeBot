import {Message, MessageAttachment, User} from "discord.js";
import * as Canvas from "canvas";
import * as TokenTableAccessor from "../../scripts/tokentableaccessor";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";
import {client} from "../../index";

export class LeaderboardCommand implements CreativeCommand {
    name = Localizer.translate("leaderboard.name");
    description = Localizer.translate("leaderboard.description");
    syntax = Localizer.translate("leaderboard.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    async execute(message: Message, args: string[]) {
        let topUserEntries = await this.getTopTenUsers();
        let leaderboardImageBuffer = await this.drawLeaderboard(topUserEntries);
        let leaderboardAttachment = new MessageAttachment(leaderboardImageBuffer, "leaderboard.png");
        message.channel.send(leaderboardAttachment);
    }

    async getTopTenUsers(): Promise<TokenTableAccessor.UserEntry[]> {
        let topUserEntries: TokenTableAccessor.UserEntry[] = [];
        for(let i = 1; i <= 9; i++) {
            var userEntryAtRank = await TokenTableAccessor.getUserEntryAtRank(i);
            if(userEntryAtRank !== undefined) {
                topUserEntries.push(userEntryAtRank);
            }
        }
        return topUserEntries;
    }

    async drawLeaderboard(topUserEntries: TokenTableAccessor.UserEntry[]): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1000, topUserEntries.length * 150);
        const context = canvas.getContext("2d");
        const leaderboardImage = await Canvas.loadImage("./media/TokensLeaderboard.png");
        context.drawImage(leaderboardImage, 0, 0, canvas.width, 1500);

        for(let i = 0; i < topUserEntries.length; i++) {
            let userEntry = topUserEntries[i];
            let user = await client.users.fetch(userEntry.userID.toString());
            if(user === undefined) break;
            await this.drawUserInfo(context, i, user, userEntry);
        }
        return canvas.toBuffer();
    }

    async drawUserInfo(context: Canvas.CanvasRenderingContext2D, i: number, user: User, userEntry: TokenTableAccessor.UserEntry): Promise<void> {
        context.font = "80px Arial";
        context.fillStyle = this.getFillStyleForRank(i);
        let correctRankNumber = i + 1;
        context.fillText(correctRankNumber.toString(), 65, 100 + i * 150);

        const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 125, 25 + i * 150, 100, 100);

        context.font = "50px Bahnschrift";
        context.fillText(user.username, 250, 65 + i * 150);

        context.font = "50px Arial";
        context.fillStyle = "#ffff00";
        context.fillText(userEntry.tokens.toString(), 300, 125 + i * 150);

        context.fillStyle = "#ff0000";
        context.fillText(userEntry.vouchTokens.toString(), 500, 125 + i * 150);
    }

    getFillStyleForRank(rank: number): string {
        if(rank === 0) return "#dd8000";
        else if(rank === 1) return "#f0f0f0";
        else if(rank === 2) return "#dd8f42";
        else return "#ffffff";
    }
}
