import {MessageAttachment, Message} from "discord.js";
import * as Canvas from "canvas";
import * as UIFunctions from "../../scripts/uifunctions";
import * as fs from "fs";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";

export class ObamaCommand implements CreativeCommand {
    name = Localizer.translate("obama.name");
    description = Localizer.translate("obama.description");
    syntax = Localizer.translate("obama.syntax");
    minArgs = 1;
    adminOnly = false;
    guildOnly = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        var obamaImageBuffer = await this.createObamaImageBuffer(args);
        var attachment = new MessageAttachment(obamaImageBuffer, Localizer.translate("obama.imageName") + ".png");
        message.channel.send(attachment);
    }

    async createObamaImageBuffer(args: string[]): Promise<Buffer> {
        let obamaImage = await this.loadRandomObamaImageFromFolder();

        const canvas = Canvas.createCanvas(obamaImage.width, obamaImage.height);
        const context = canvas.getContext("2d");

        context.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);
        this.drawText(canvas, context, args);

        return canvas.toBuffer();
    }

    async loadRandomObamaImageFromFolder(): Promise<Canvas.Image> {
        const obamaImages = fs.readdirSync("./media").filter(function(file) {
            return file.endsWith(".png") && file.startsWith("obama_");
        });
        const randomObamaIndex = Math.floor(Math.random() * obamaImages.length);
        let obamaImage = await Canvas.loadImage("./media/obama_" + randomObamaIndex + ".png");
        return obamaImage;
    }

    drawText(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, args: string[]): void {
        var imageText = UIFunctions.createStringFromArray(args, 0);

        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.font = UIFunctions.getFittingFontSize(canvas, context, imageText, Math.floor(canvas.width / 17));
        context.fillText(imageText, canvas.width / 2, Math.floor(canvas.height / 5));
    }
}
