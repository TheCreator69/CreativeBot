import * as GameIdea from "./gameidea";

var gameIdeaCommand = new GameIdea.GameIdeaCommand();

var gameIdeaCommandWithoutFormatters = new GameIdea.GameIdeaCommand();
class MockFormatter extends GameIdea.BaseFormatter {
    format() {
        return "Mock";
    }
}

beforeAll(() => {
    gameIdeaCommandWithoutFormatters.formatters = [];
});

test("Processes the word 'Apple' and returns 'An'", () => {
    expect(gameIdeaCommand.getCorrectFormOfArticle("Apple")).toBe("An");
});

test("Processes the word 'Mango' and returns 'A'", () => {
    expect(gameIdeaCommand.getCorrectFormOfArticle("Mango")).toBe("A");
});

test("Adds a formatter to command and tests returned string", () => {
    gameIdeaCommandWithoutFormatters.formatters = [new MockFormatter(gameIdeaCommandWithoutFormatters)];
    expect(gameIdeaCommandWithoutFormatters.generateGameIdea()).toBe("**Game Idea:** \nMock");
});
