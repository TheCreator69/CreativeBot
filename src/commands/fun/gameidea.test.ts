import * as GameIdea from "./gameidea";

test("Processes the word 'Apple' and returns 'An'", () => {
    expect(GameIdea.getCorrectFormOfArticle("Apple")).toBe("An");
});

test("Processes the word 'Mango' and returns 'A'", () => {
    expect(GameIdea.getCorrectFormOfArticle("Mango")).toBe("A");
});
