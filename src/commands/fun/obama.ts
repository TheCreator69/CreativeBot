import {MessageAttachment, Message} from "discord.js";
import * as Canvas from "canvas";
import * as UIFunctions from "../../scripts/uifunctions";
import * as fs from "fs";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";

export class ObamaCommand implements CreativeCommand {
    name = "obama";
    description = "Sends an inspiring Obama picture with an equally inspiring message (hopefully)";
    syntax = "obama <message>";
    min_args = 1;
    admin_only = false;
    guild_only = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        await this.sendObamaImageWithText(message, args);
    }

    async sendObamaImageWithText(message: Message, args: string[]): Promise<void> {
        var obamaImageBuffer = await this.createObamaImageBuffer(args);
        var attachment = new MessageAttachment(obamaImageBuffer, "obama-is-very-inspiring.png");
        message.channel.send(attachment);
    }

    async createObamaImageBuffer(args: string[]): Promise<Buffer> {
        let obamaImage = await this.loadRandomObamaImageFromFolder();

        const canvas = Canvas.createCanvas(obamaImage.width, obamaImage.height);
        const context = canvas.getContext("2d");

        await this.drawImage(canvas, context, obamaImage);
        this.drawText(canvas, context, args);

        return canvas.toBuffer();
    }

    async loadRandomObamaImageFromFolder(): Promise<Canvas.Image> {
        const obamaImages = fs.readdirSync("./media").filter(function(file) {
            return file.endsWith(".png");
        });
        const randomObamaIndex = Math.floor(Math.random() * obamaImages.length);
        let obamaImage = await Canvas.loadImage("./media/obama_" + randomObamaIndex + ".png");
        return obamaImage;
    }

    async drawImage(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, obamaImage: Canvas.Image): Promise<void> {
        context.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);
    }

    drawText(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, args: string[]): void {
        var imageText = UIFunctions.createStringFromArray(args, 0);

        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.font = UIFunctions.getFittingFontSize(canvas, context, imageText, Math.floor(canvas.width / 17));
        context.fillText(imageText, canvas.width / 2, Math.floor(canvas.height / 5));
    }

}
