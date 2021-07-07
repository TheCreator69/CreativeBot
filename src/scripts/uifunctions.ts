import* as Canvas from "canvas";

export function getFittingFontSize(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, text: string, fontStartingSize: number): string {
    do {
        context.font = `${fontStartingSize -= 5}px Arial`;
    } while(context.measureText(text).width > canvas.width - 100);

    return context.font;
}

export function createStringFromArray(args: string[], startingIndex: number): string {
    var text = "";
    for(var i = startingIndex; i < args.length; i++) {
        text += args[i] + " ";
    }
    return text;
}

export function createStringFromArrayWithSeparator(args: string[], startingIndex: number, argSeparator: string): string {
    var text = "";
    for(var i = startingIndex; i < args.length; i++) {
        if(i === args.length - 1) text += args[i];
        else text += args[i] + argSeparator;
    }
    return text;
}
