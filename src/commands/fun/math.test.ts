import * as Math from "./math";

describe("Multiple Of Function", () => {
    test("'4' as a potential multiple of '2' should return 'true'", () => {
        expect(Math.isNumberMultipleOf(4, 2)).toBeTruthy();
    });

    test("'10' as a potential multiple of '5' should return 'true'", () => {
        expect(Math.isNumberMultipleOf(10, 5)).toBeTruthy();
    });

    test("'5' as a potential multiple of '2' should return 'false'", () => {
        expect(Math.isNumberMultipleOf(5, 2)).toBeFalsy();
    });

    test("'19' as a potential multiple of '1' should return 'true'", () => {
        expect(Math.isNumberMultipleOf(19, 1)).toBeTruthy();
    });
});
