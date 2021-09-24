import * as Slots from "./slots";

var slotsCommand = new Slots.SlotsCommand();

describe("Determine Credits Won", () => {
    test("A bet of '10' with no lines of symbols should return a win of '0'", () => {
        expect(slotsCommand.determineCreditsWon(0, 0, 0, 10)).toBe(0);
    });

    test("A bet of '10' with 1 horizontal line should return a win of '20'", () => {
        expect(slotsCommand.determineCreditsWon(1, 0, 0, 10)).toBe(20);
    });

    test("A bet of '10' with 3 horizontal lines should return a win of '60'", () => {
        expect(slotsCommand.determineCreditsWon(3, 0, 0, 10)).toBe(60);
    });

    test("A bet of '10' with 1 diagonal line should return a win of '40'", () => {
        expect(slotsCommand.determineCreditsWon(0, 1, 0, 10)).toBe(40);
    });

    test("A bet of '10' with 2 diagonal lines should return a win of '80'", () => {
        expect(slotsCommand.determineCreditsWon(0, 2, 0, 10)).toBe(80);
    });

    test("A bet of '10' with 1 horizontal & 1 diagonal line should return a win of '60'", () => {
        expect(slotsCommand.determineCreditsWon(1, 1, 0, 10)).toBe(60);
    });

    test("A bet of '10' with 3 horizontal & 2 diagonal lines should return a win of '140'", () => {
        expect(slotsCommand.determineCreditsWon(3, 2, 0, 10)).toBe(140);
    });

    test("A bet of '10' with 1 vertical line should return a win of '20'", () => {
        expect(slotsCommand.determineCreditsWon(0, 0, 1, 10)).toBe(20);
    });

    test("A bet of '10' with 3 vertical lines should return a win of '60'", () => {
        expect(slotsCommand.determineCreditsWon(0, 0, 3, 10)).toBe(60);
    });

    test("A bet of '10' with 1 horizontal & 1 vertical line should return a win of '40'", () => {
        expect(slotsCommand.determineCreditsWon(1, 0, 1, 10)).toBe(40);
    });
});



describe("Select Seemingly Random Symbols", () => {
    test("The symbol array should have a length of 9", () => {
        expect(slotsCommand.selectSeeminglyRandomSymbols()).toHaveLength(9);
    });
});



describe("Get Horizontal Line Count", () => {
    test("'0' horizontal lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "different", "same",
            "3", "4", "5",
            "6", "7", "8"
        ];
        expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toBe(0);
    });

    test("'1' horizontal line should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "same", "same",
            "3", "4", "5",
            "6", "7", "8"
        ];
        expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toBe(1);
    });

    test("'1' horizontal line should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "0", "1", "2",
            "same", "same", "same",
            "6", "7", "8"
        ];
        expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toBe(1);
    });

    test("'2' horizontal lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "0", "1", "2",
            "same", "same", "same",
            "same", "same", "same"
        ];
        expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toBe(2);
    });

    test("'3' horizontal lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "same", "same",
            "same", "same", "same",
            "same", "same", "same"
        ];
        expect(slotsCommand.getHorizontalLineCount(mockSymbols)).toBe(3);
    });
});



describe("Get Diagonal Line Count", () => {
    test("'1' diagonal line should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "1", "2",
            "3", "same", "5",
            "6", "7", "same"
        ];
        expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toBe(1);
    });

    test("'1' diagonal line should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "0", "1", "same",
            "3", "same", "5",
            "same", "7", "8"
        ];
        expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toBe(1);
    });

    test("'2' diagonal lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "1", "same",
            "3", "same", "5",
            "same", "7", "same"
        ];
        expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toBe(2);
    });

    test("'2' diagonal lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "same", "same",
            "same", "same", "same",
            "same", "same", "same"
        ];
        expect(slotsCommand.getDiagonalLineCount(mockSymbols)).toBe(2);
    });
});



describe("Get Vertical Line Count", () => {
    test("'1' vertical line should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "1", "2",
            "same", "4", "5",
            "same", "7", "8"
        ];
        expect(slotsCommand.getVerticalLineCount(mockSymbols)).toBe(1);
    });

    test("'1' vertical lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "0", "1", "same",
            "3", "4", "same",
            "6", "7", "same"
        ];
        expect(slotsCommand.getVerticalLineCount(mockSymbols)).toBe(1);
    });

    test("'2' vertical lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "1", "same",
            "same", "4", "same",
            "same", "7", "same"
        ];
        expect(slotsCommand.getVerticalLineCount(mockSymbols)).toBe(2);
    });

    test("'3' vertical lines should be detected in symbol array", () => {
        const mockSymbols: string[] = [
            "same", "same", "same",
            "same", "same", "same",
            "same", "same", "same"
        ];
        expect(slotsCommand.getVerticalLineCount(mockSymbols)).toBe(3);
    });
});
