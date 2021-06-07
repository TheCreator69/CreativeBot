import * as GameIdea from "./gameidea";

var gameIdeaCommand = new GameIdea.GameIdeaCommand();

test("Processes the word 'Apple' and returns 'An'", () => {
    expect(gameIdeaCommand.getCorrectFormOfArticle("Apple")).toBe("An");
});

test("Processes the word 'Mango' and returns 'A'", () => {
    expect(gameIdeaCommand.getCorrectFormOfArticle("Mango")).toBe("A");
});
