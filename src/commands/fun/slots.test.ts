import {determineCreditsWon} from "./slots";

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
