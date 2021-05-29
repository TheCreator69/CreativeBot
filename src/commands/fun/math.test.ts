import * as Math from "./math";

var mathCommand = new Math.MathCommand();
var mathQuestionToTest: Math.MathQuestion;

beforeAll(() => {
    mathQuestionToTest = mathCommand.generateMathQuestion();
});

test("Checks if the numbers '4' and '2' return 'true'", () => {
    expect(mathCommand.isNumberMultipleOf(4, 2)).toBeTruthy();
});

test("Checks if the numbers '10' and '5' return 'true'", () => {
    expect(mathCommand.isNumberMultipleOf(10, 5)).toBeTruthy();
});

test("Checks if the numbers '5' and '2' return 'false'", () => {
    expect(mathCommand.isNumberMultipleOf(5, 2)).toBeFalsy();
});

test("Checks if the numbers '19' and '1' return 'true'", () => {
    expect(mathCommand.isNumberMultipleOf(19, 1)).toBeTruthy();
});

test("Checks if the generated math question has an initialValue larger than 0", () => {
    expect(mathQuestionToTest.initialValue).toBeGreaterThan(0);
});

test("Checks if the generated math question has a term larger than 0", () => {
    expect(mathQuestionToTest.term).toBeGreaterThan(0);
});

test("Checks if the calculated time for answering is equal to 4000 for two multiples of 10 and an addition", () => {
    expect(mathCommand.calculateTimeForAnswering(10, true, 10)).toEqual(4000);
});

test("Checks if the calculated time for answering is equal to 5000 for a multiple of 2, a multiple of 10 and an addition", () => {
    expect(mathCommand.calculateTimeForAnswering(8, true, 10)).toEqual(5000);
});

test("Checks if the calculated time for answering is equal to 6000 for an odd initialValue, a multiple of 10 and an addition", () => {
    expect(mathCommand.calculateTimeForAnswering(7, true, 10)).toEqual(6000);
});

test("Checks if the calculated time for answering is equal to 4000 for a multiple of 10, a term of 4 and an addition", () => {
    expect(mathCommand.calculateTimeForAnswering(10, true, 4)).toEqual(4000);
});

test("Checks if the calculated time for answering is equal to 8000 for a multiple of 10, a term of 49 and an addition", () => {
    expect(mathCommand.calculateTimeForAnswering(10, true, 49)).toEqual(8000);
});


test("Checks if the calculated time for answering is equal to 6000 for two multiples of 10 and a subtraction", () => {
    expect(mathCommand.calculateTimeForAnswering(10, false, 10)).toEqual(6000);
});

test("Checks if the calculated time for answering is equal to 7000 for a multiple of 2, a multiple of 10 and a subtraction", () => {
    expect(mathCommand.calculateTimeForAnswering(8, false, 10)).toEqual(7000);
});

test("Checks if the calculated time for answering is equal to 8000 for an odd initialValue, a multiple of 10 and a subtraction", () => {
    expect(mathCommand.calculateTimeForAnswering(7, false, 10)).toEqual(8000);
});

test("Checks if the calculated time for answering is equal to 6000 for a multiple of 10, a term of 4 and a subtraction", () => {
    expect(mathCommand.calculateTimeForAnswering(10, false, 4)).toEqual(6000);
});

test("Checks if the calculated time for answering is equal to 10000 for a multiple of 10, a term of 49 and a subtraction", () => {
    expect(mathCommand.calculateTimeForAnswering(10, false, 49)).toEqual(10000);
});
