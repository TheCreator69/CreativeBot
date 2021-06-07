import * as Slots from "./slots";

var slotsCommand = new Slots.SlotsCommand();

test("Checks if a bet of 10 and no rows of symbols returns a win of 0", () => {
    expect(slotsCommand.determineCreditsWon(0, 0, 10)).toEqual(0);
});

test("Checks if a bet of 10 and 1 horizontal row of symbols returns a win of 20", () => {
    expect(slotsCommand.determineCreditsWon(1, 0, 10)).toEqual(20);
});

test("Checks if a bet of 10 and 3 horizontal rows of symbols returns a win of 60", () => {
    expect(slotsCommand.determineCreditsWon(3, 0, 10)).toEqual(60);
});

test("Checks if a bet of 10 and 1 diagonal row of symbols returns a win of 40", () => {
    expect(slotsCommand.determineCreditsWon(0, 1, 10)).toEqual(40);
});

test("Checks if a bet of 10 and 2 diagonal rows of symbols returns a win of 80", () => {
    expect(slotsCommand.determineCreditsWon(0, 2, 10)).toEqual(80);
});

test("Checks if a bet of 10, 1 horizontal, and 1 diagonal rows of symbols returns a win of 60", () => {
    expect(slotsCommand.determineCreditsWon(1, 1, 10)).toEqual(60);
});

test("Checks if a bet of 10, 3 horizontal, and 2 diagonal rows of symbols returns a win of 140", () => {
    expect(slotsCommand.determineCreditsWon(3, 2, 10)).toEqual(140);
});

test("Checks if array output by function is of expected length", () => {
    expect(slotsCommand.selectSeeminglyRandomSymbols()).toHaveLength(slotsCommand.slotRows * slotsCommand.slotColumns);
});

test("Checks if no horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "different", "same", "1", "2", "3", "4", "5", "6"];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(0);
});

test("Checks if first horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "1", "2", "3", "4", "5", "6"];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if second horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "2", "same", "same", "same", "6", "7", "8"];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "2", "same", "same", "same", "alsoSame", "alsoSame", "alsoSame"];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 3 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "alsoSame", "alsoSame", "alsoSame", "stillSame", "stillSame", "stillSame"];
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(3);
});

test("Checks if 1 diagonal row from the top left gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "2", "3", "same", "5", "6", "7", "same"];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 1 diagonal row from the top right gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "same", "3", "same", "5", "same", "7", "8"];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 diagonal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "same", "3", "same", "5", "same", "7", "same"];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "same", "3", "same", "5", "same", "7", "same"];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal rows and 3 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "same", "same", "same", "same", "same", "same"];
    expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toEqual(2);
    expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toEqual(3);
});
