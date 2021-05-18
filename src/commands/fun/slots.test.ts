import {determineCreditsWon, selectSeeminglyRandomSymbols, getHorizontalRowCount, getDiagonalRowCount} from "./slots";

test("Checks if a bet of 10 and no rows of symbols returns a win of 0", () => {
    expect(determineCreditsWon(0, 0, 10)).toEqual(0);
});

test("Checks if a bet of 10 and 1 horizontal row of symbols returns a win of 20", () => {
    expect(determineCreditsWon(1, 0, 10)).toEqual(20);
});

test("Checks if a bet of 10 and 3 horizontal rows of symbols returns a win of 60", () => {
    expect(determineCreditsWon(3, 0, 10)).toEqual(60);
});

test("Checks if a bet of 10 and 1 diagonal row of symbols returns a win of 40", () => {
    expect(determineCreditsWon(0, 1, 10)).toEqual(40);
});

test("Checks if a bet of 10 and 2 diagonal rows of symbols returns a win of 80", () => {
    expect(determineCreditsWon(0, 2, 10)).toEqual(80);
});

test("Checks if a bet of 10, 1 horizontal, and 1 diagonal rows of symbols returns a win of 60", () => {
    expect(determineCreditsWon(1, 1, 10)).toEqual(60);
});

test("Checks if a bet of 10, 3 horizontal, and 2 diagonal rows of symbols returns a win of 140", () => {
    expect(determineCreditsWon(3, 2, 10)).toEqual(140);
});

test("Checks if array output by function is of expected length", () => {
    expect(selectSeeminglyRandomSymbols()).toHaveLength(9);
});

test("Checks if no horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "different", "same", "1", "2", "3", "4", "5", "6"];
    expect(getHorizontalRowCount(mockSymbols)).toEqual(0);
});

test("Checks if first horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "1", "2", "3", "4", "5", "6"];
    expect(getHorizontalRowCount(mockSymbols)).toEqual(1);
});

test("Checks if second horizontal row gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "2", "same", "same", "same", "6", "7", "8"];
    expect(getHorizontalRowCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "2", "same", "same", "same", "alsoSame", "alsoSame", "alsoSame"];
    expect(getHorizontalRowCount(mockSymbols)).toEqual(2);
});

test("Checks if 3 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "alsoSame", "alsoSame", "alsoSame", "stillSame", "stillSame", "stillSame"];
    expect(getHorizontalRowCount(mockSymbols)).toEqual(3);
});

test("Checks if 1 diagonal row from the top left gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "2", "3", "same", "5", "6", "7", "same"];
    expect(getDiagonalRowCount(mockSymbols)).toEqual(1);
});

test("Checks if 1 diagonal row from the top right gets detected in random symbol array", () => {
    const mockSymbols: string[] = ["0", "1", "same", "3", "same", "5", "same", "7", "8"];
    expect(getDiagonalRowCount(mockSymbols)).toEqual(1);
});

test("Checks if 2 diagonal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "same", "3", "same", "5", "same", "7", "same"];
    expect(getDiagonalRowCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "1", "same", "3", "same", "5", "same", "7", "same"];
    expect(getDiagonalRowCount(mockSymbols)).toEqual(2);
});

test("Checks if 2 diagonal rows and 3 horizontal rows get detected in random symbol array", () => {
    const mockSymbols: string[] = ["same", "same", "same", "same", "same", "same", "same", "same", "same"];
    expect(getDiagonalRowCount(mockSymbols)).toEqual(2);
    expect(getHorizontalRowCount(mockSymbols)).toEqual(3);
});
