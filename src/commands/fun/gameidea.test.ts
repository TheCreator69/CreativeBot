import {getCorrectFormOfArticle} from "./gameidea";

test("Processes the word 'Apple' and returns 'An '", () => {
    expect(getCorrectFormOfArticle("Apple")).toBe("An ");
});

test("Processes the word 'Mango' and returns 'A '", () => {
    expect(getCorrectFormOfArticle("Mango")).toBe("A ");
});
