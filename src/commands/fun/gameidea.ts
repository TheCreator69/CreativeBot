import {CreativeCommand} from "../../scripts/def/commanddef";
import {Message} from "discord.js";
import * as Localizer from "../../scripts/localizer";

export interface GameIdeaFormatter {
    format: () => string
}

export class TwoGenresFormatter implements GameIdeaFormatter {
    format() {
        let genre0 = getRandomArrayElement(genres);
        let genre1 = getRandomArrayElement(genres);
        let location = getRandomArrayElement(locations);

        if(genre1 == genre0) {
            var modifiedGenreArray = genres.slice();
            var genre0Index = modifiedGenreArray.indexOf(genre0);
            modifiedGenreArray.splice(genre0Index, 1);
            genre1 = getRandomArrayElement(modifiedGenreArray);
        }

        return Localizer.translate("gameidea.twoGenresFormat", {genre0: genre0, genre1: genre1, location: location});
    }
}

export class OneGenreFormatter implements GameIdeaFormatter {
    format() {
        let genre = getRandomArrayElement(genres);
        let article = getCorrectFormOfArticle(genre);
        let location = getRandomArrayElement(locations);
        return Localizer.translate("gameidea.oneGenreFormat", {article: article, genre: genre, location: location});
    }
}

export class GenreWithModifierFormatter implements GameIdeaFormatter {
    format() {
        let genre = getRandomArrayElement(genres);
        let article = getCorrectFormOfArticle(genre);
        let modifier = getRandomArrayElement(modifiers);
        return Localizer.translate("gameidea.genreWithModifierFormat", {article: article, genre: genre, modifier: modifier});
    }
}

export class ThemeWithModifierFormatter implements GameIdeaFormatter {
    format() {
        let theme = getRandomArrayElement(themes);
        theme = theme.replace(/^\w/, (c: string) => c.toUpperCase());
        let modifier = getRandomArrayElement(modifiers)
        return Localizer.translate("gameidea.themeWithModiferFormat", {theme: theme, modifier: modifier});
    }
}

export class GenreWithThemeFormatter implements GameIdeaFormatter {
    format() {
        let genre = getRandomArrayElement(genres);
        let article = getCorrectFormOfArticle(genre);
        let theme = getRandomArrayElement(themes);
        return Localizer.translate("gameidea.genreWithThemeFormat", {article: article, genre: genre, theme: theme});
    }
}

export class GameIdeaCommand implements CreativeCommand {
    name = Localizer.translate("gameidea.name");
    description = Localizer.translate("gameidea.description");
    syntax = Localizer.translate("gameidea.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        var gameIdea = this.generateGameIdea();
        message.channel.send(gameIdea);
    }

    formatters: GameIdeaFormatter[] = [
        new TwoGenresFormatter(),
        new OneGenreFormatter(),
        new GenreWithModifierFormatter(),
        new ThemeWithModifierFormatter(),
        new GenreWithThemeFormatter()
    ];

    generateGameIdea(): string {
        var randomformatIndex = Math.floor(Math.random() * this.formatters.length);
        var ideaString = Localizer.translate("gameidea.gameIdeaHeader");
        ideaString += this.formatters[randomformatIndex].format();
        return ideaString;
    }
}

export function getCorrectFormOfArticle(nextWord: string): string {
    nextWord = nextWord.toLowerCase();
    var vowels = ["a", "e", "i", "o", "u"];
    for(let vowel of vowels) {
        if(nextWord.startsWith(vowel)) {
            return "An";
        }
    }
    return "A";
}

export function getRandomArrayElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
}

export const genres = [
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
    "Drawing game",
    "Browser-based game",
    "Card game",
    "Webcam or Mic game",
    "VR game",
    "Flying simulator",
    "Sound-based game",
    "Mouse only game",
    "Keyboard only game",
    "Midi instrument game",
    "Real-life object game (eg, skylanders, amiibo etc.)",
    "Gacha game"
];
export const themes = [ //Come after "about" and at the start of a sentence
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
    "an eating contest",
    "aliens",
    "magic and spells",
    "Microwaveable Cat"
];
export const modifiers = [ //Come after "where" and "but"
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
    "The controls are numbers",
    "the screen moves opposite to your movement"
];
export const locations = [ //Come after "set"
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
