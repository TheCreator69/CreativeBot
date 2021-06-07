import * as Slots from "./slots";

var slotsCommand = new Slots.SlotsCommand();

test("Checks if a bet of 10 and no lines of symbols returns a win of 0", () => {
    expect(slotsCommand.determineCreditsWon(0, 0, 0, 10)).toEqual(0);
});

test("Checks if a bet of 10 and 1 horizontal line of symbols returns a win of 20", () => {
    expect(slotsCommand.determineCreditsWon(1, 0, 0, 10)).toEqual(20);
});

test("Checks if a bet of 10 and 3 horizontal lines of symbols returns a win of 60", () => {
    expect(slotsCommand.determineCreditsWon(3, 0, 0, 10)).toEqual(60);
});

test("Checks if a bet of 10 and 1 diagonal line of symbols returns a win of 40", () => {
    expect(slotsCommand.determineCreditsWon(0, 1, 0, 10)).toEqual(40);
});

test("Checks if a bet of 10 and 2 diagonal lines of symbols returns a win of 80", () => {
    expect(slotsCommand.determineCreditsWon(0, 2, 0, 10)).toEqual(80);
});

test("Checks if a bet of 10, 1 horizontal, and 1 diagonal line of symbols returns a win of 60", () => {
    expect(slotsCommand.determineCreditsWon(1, 1, 0, 10)).toEqual(60);
});

test("Checks if a bet of 10, 3 horizontal, and 2 diagonal lines of symbols returns a win of 140", () => {
    expect(slotsCommand.determineCreditsWon(3, 2, 0, 10)).toEqual(140);
});

test("Checks if a bet of 10 and 1 vertical line of symbols returns a win of 20", () => {
    expect(slotsCommand.determineCreditsWon(0, 0, 1, 10)).toEqual(20);
});

test("Checks if a bet of 10 and 3 vertical lines of symbols returns a win of 60", () => {
    expect(slotsCommand.determineCreditsWon(0, 0, 3, 10)).toEqual(60);
});

test("Checks if a bet of 10, 1 horizontal, and 1 vertical line of symbols returns a win of 40", () => {
    expect(slotsCommand.determineCreditsWon(1, 0, 1, 10)).toEqual(40);
});

test("Checks if array output by function is of expected length", () => {
    expect(slotsCommand.selectSeeminglyRandomSymbols()).toHaveLength(9);
});

test("Checks if no horizontal line gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "different", "same",
        "1", "2", "3",
        "4", "5", "6"
    ];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(0);
});

test("Checks if first horizontal line gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "same", "same",
        "1", "2", "3",
        "4", "5", "6"
    ];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if second horizontal line gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "0", "1", "2",
        "same", "same", "same",
        "6", "7", "8"
    ];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 horizontal lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "0", "1", "2",
        "same", "same", "same",
        "alsoSame", "alsoSame", "alsoSame"
    ];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 3 horizontal lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "same", "same",
        "alsoSame", "alsoSame", "alsoSame",
        "stillSame", "stillSame", "stillSame"
    ];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(3);
});

test("Checks if 1 diagonal line from the top left gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "1", "2",
        "3", "same", "5",
        "6", "7", "same"
    ];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 1 diagonal line from the top right gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "0", "1", "same",
        "3", "same", "5",
        "same", "7", "8"
    ];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 diagonal lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "1", "same",
        "3", "same", "5",
        "same", "7", "same"
    ];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "1", "same",
        "3", "same", "5",
        "same", "7", "same"
    ];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal lines and 3 horizontal lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "same", "same",
        "same", "same", "same",
        "same", "same", "same"
    ];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(3);
});

test("Checks if 1 vertical line gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "1", "2",
        "same", "4", "5",
        "same", "7", "8"
    ];
    expect(slotsCommand.getVerticalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 1 vertical line with offset gets detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "0", "1", "same",
        "3", "4", "same",
        "6", "7", "same"
    ];
    expect(slotsCommand.getVerticalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 vertical lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "1", "alsoSame",
        "same", "4", "alsoSame",
        "same", "7", "alsoSame"
    ];
    expect(slotsCommand.getVerticalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 3 vertical lines get detected in random symbol array", () => {
    const mockSymbols: string[] = [
        "same", "identical", "alsoSame",
        "same", "identical", "alsoSame",
        "same", "identical", "alsoSame"
    ];
    expect(slotsCommand.getVerticalLineCount(mockSymbols)).toEqual(3);
});
