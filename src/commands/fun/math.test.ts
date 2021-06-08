import * as Math from "./math";

test("Checks if the numbers '4' and '2' return 'true'", () => {
    expect(Math.isNumberMultipleOf(4, 2)).toBeTruthy();
});

test("Checks if the numbers '10' and '5' return 'true'", () => {
    expect(Math.isNumberMultipleOf(10, 5)).toBeTruthy();
});

test("Checks if the numbers '5' and '2' return 'false'", () => {
    expect(Math.isNumberMultipleOf(5, 2)).toBeFalsy();
});

test("Checks if the numbers '19' and '1' return 'true'", () => {
    expect(Math.isNumberMultipleOf(19, 1)).toBeTruthy();
});
