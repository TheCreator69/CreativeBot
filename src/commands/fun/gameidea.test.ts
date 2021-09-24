import * as GameIdea from "./gameidea";

describe("English Article Function", () => {
    test("'Apple' should return 'An'", () => {
        expect(GameIdea.getCorrectFormOfArticle("Apple")).toBe("An");
    });

    test("'Mango' should return 'A'", () => {
        expect(GameIdea.getCorrectFormOfArticle("Mango")).toBe("A");
    });
});
