import {CreativeCommand} from "../../scripts/commanddef";
import {Message} from "discord.js";

export interface GameIdeaFormatter {
    format: () => string
}

export class BaseFormatter implements GameIdeaFormatter {
    gameIdeaCommand;
    constructor(_gameIdeaCommand: GameIdeaCommand) {
        this.gameIdeaCommand = _gameIdeaCommand;
    }

    format() {
        return "";
    }
}

export class TwoGenresFormatter extends BaseFormatter {
    format() {
        var genre0 = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.genres);
        var genre1 = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.genres);

        if(genre1 == genre0) {
            var modifiedGenreArray = this.gameIdeaCommand.genres.slice();
            var genre0Index = modifiedGenreArray.indexOf(genre0);
            modifiedGenreArray.splice(genre0Index, 1);
            genre1 = this.gameIdeaCommand.getRandomArrayElement(modifiedGenreArray);
        }

        return "A mix of " + genre0 + " and " + genre1 + " set " + this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.locations);
    }
}

export class OneGenreFormatter extends BaseFormatter {
    format() {
        var genre = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.genres);
        return this.gameIdeaCommand.getCorrectFormOfArticle(genre) + genre + " set " + this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.locations);
    }
}

export class GenreWithModifierFormatter extends BaseFormatter {
    format() {
        var genre = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.genres);
        return this.gameIdeaCommand.getCorrectFormOfArticle(genre) + genre + " where " + this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.modifiers);
    }
}

export class ThemeWithModifierFormatter extends BaseFormatter {
    format() {
        var theme = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.themes);
        theme = theme.replace(/^\w/, (c: string) => c.toUpperCase());
        return theme + ", but " + this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.modifiers);
    }
}

export class GenreWithThemeFormatter extends BaseFormatter {
    format() {
        var genre = this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.genres);
        return this.gameIdeaCommand.getCorrectFormOfArticle(genre) + genre + " about " + this.gameIdeaCommand.getRandomArrayElement(this.gameIdeaCommand.themes);
    }
}

export class GameIdeaCommand implements CreativeCommand {
    name = "gameidea";
    description = "Generates a random game idea";
    syntax = "gameidea";
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        var gameIdea = this.generateGameIdea();
        message.channel.send(gameIdea);
    }

    formatters: GameIdeaFormatter[] = [
        new TwoGenresFormatter(this),
        new OneGenreFormatter(this),
        new GenreWithModifierFormatter(this),
        new ThemeWithModifierFormatter(this),
        new GenreWithThemeFormatter(this)
    ];

    generateGameIdea(): string {
        var randomformatIndex = Math.floor(Math.random() * this.formatters.length);
        var ideaString = "**Game Idea:** \n";
        ideaString += this.formatters[randomformatIndex].format();
        return ideaString;
    }

    getCorrectFormOfArticle(nextWord: string): string {
        nextWord = nextWord.toLowerCase();
        var vowels = ["a", "e", "i", "o", "u"];
        for(let vowel of vowels) {
            if(nextWord.startsWith(vowel)) {
                return "An ";
            }
        }
        return "A ";
    }

    getRandomArrayElement(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    genres = [
        "Stealth game",
        "Platformer",
        "Racing game",
        "Idle game",
        "First-Person shooter",
        "Third-Person shooter",
        "Survival game",
        "Rhythm game",
        "Horror game",
        "Visual Novel",
        "Real-time strategy game",
        "Role-playing game",
        "MMORPG",
        "MOBA",
        "Fighting game",
        "Text-based adventure game",
        "Sandbox game",
        "Simulator",
        "City builder",
        "Party game",
        "Puzzle game",
        "Sports game",
        "Educational game",
        "Psychological horror game",
        "Drawing bame",
        "Browser-based game",
        "Card game",
        "Webcam/Mic game",
        "VR game",
        "Flying game",
        "Sound-based game",
        "Mouse only game",
        "Keyboard only game",
        "Midi instrument game",
        "Real-life object game (eg, skylanders, amiibo etc.)",
        "Gacha Game"
    ];
    themes = [ //Come after "about" and at the start of a sentence
        "an ambush",
        "an escort mission",
        "an intense chase",
        "an AI-controlled giant creature",
        "alternating perspectives",
        "a rainy night",
        "house cleaning",
        "busting your brothers",
        "fighting mythical creatures",
        "exploring old castle ruins",
        "cooking the ultimate meal",
        "infiltrating a cult",
        "a cat brewing up spells",
        "an epic, high-speed car chase",
        "robbing a bank",
        "re-uniting a friendship",
        "hiding in a bunker",
        "summoning a terrifying monster",
        "slicing objects",
        "possesed puppets",
        "mind control",
        "an eating contest"
    ];
    modifiers = [ //Come after "where" and "but"
        "gravity is inverted",
        "keys are rebound every few seconds",
        "the player is blind",
        "dying is part of the progression",
        "the player and the enemies are controlled at the same time",
        "you can walk on walls",
        "the only move is jumping",
        "the player controls the environment instead of the main character",
        "the world is in 4D",
        "the world can switch between two places at any time",
        "you can draw to create something",
        "the player is scared of the computer mouse",
        "the world is turned upside down",
        "you can only move a certain direction for a certain amount of time",
        "blinking is the main mechanic",
        "you use the second player to guide you",
        "someone is always watching",
    ];
    locations = [ //Come after "set"
        "in a haunted house",
        "in a narrow subway tunnel",
        "on a small, peaceful island",
        "in an average middle-class household",
        "in an enchanted forest",
        "under the ocean",
        "on a small river with a strong current",
        "inside of a delicious cake",
        "inside a treehouse",
        "inside the ruins of an old castle",
        "in an abandoned amusement park",
        "inside of an active volcano",
        "after the Second World War",
        "in a post-apocalyptic world",
        "on top of an airship",
        "on a moving colossus",
        "on a party yacht",
        "in a self-driving car",
        "on an airplane that is about to crash",
        "on an alien spaceship abducting you",
        "on an uncharted planet",
        "in a school full of dolphins",
        "in a submarine fighting sharks",
        "before the dawn of time",
        "at a concert",
        "at an illegal rave",
        "at the mall"
    ];
}
