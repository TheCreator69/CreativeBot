import {Canvas, CanvasRenderingContext2D} from "canvas";
import {LogChamp, Category} from "./logchamp";

var logChampInst = new LogChamp(Category.TextProcessing);

export function getFittingFontSize(canvas: Canvas, context: CanvasRenderingContext2D, text: string, fontStartingSize: number): string {
    do {
        context.font = `${fontStartingSize -= 5}px Arial`;
    } while(context.measureText(text).width > canvas.width - 100);

    logChampInst.debug("Font resizing requested", {startSize: fontStartingSize, font: context.font, text: text});
    return context.font;
}

export function createStringFromArray(args: string[], startingIndex: number): string {
    var text = "";
    for(var i = startingIndex; i < args.length; i++) {
        text += args[i] + " ";
    }
    logChampInst.debug("Created string from array", {array: args, string: text, startIndex: startingIndex});
    return text;
}

export function createStringFromArrayWithSeparator(args: string[], startIndex: number, argSeparator: string): string {
    var text = "";
    for(var i = startIndex; i < args.length; i++) {
        if(i === args.length - 1) text += args[i];
        else text += args[i] + argSeparator;
    }
    logChampInst.debug("Created string from array with separator", {array: args, string: text, startIndex: startIndex, separator: argSeparator});
    return text;
}

export function createStringFromArrayWithSeparatorAndEndOffset(args: string[], startIndex: number, endIndexOffset: number, argSeparator: string): string {
    var text = "";
    for(var i = startIndex; i < args.length - endIndexOffset; i++) {
        if(i === args.length - (endIndexOffset + 1)) text += args[i];
        else text += args[i] + argSeparator;
    }
    logChampInst.debug("Created string from array with separator and end offset", {array: args, string: text, startIndex: startIndex, endOffset: endIndexOffset, separator: argSeparator});
    return text;
}
