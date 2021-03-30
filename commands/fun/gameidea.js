module.exports = {
    name: "gameidea",
    description: "Generates a random game idea.",
    syntax: "gameidea",
    execute(message, args) {
        var gameIdea = generateGameIdea();
        message.channel.send(gameIdea);
    }
};

function generateGameIdea() {
    var format = Math.floor(Math.random() * 4);
    //Format #0: A mix of GENRE and GENRE set (in) LOCATION
    //Format #1: A GENRE set (in) LOCATION
    //Format #2: A GENRE where MODIFIER
    //Format #3: THEME, but MODIFIER
    //Format #4: A GENRE about (a) THEME
    var ideaString = "**Game Idea:** \n";
    switch(format) {
        case 0:
            ideaString = formatZero(ideaString);
            break;
        case 1:
            ideaString = formatOne(ideaString);
            break;
        case 2:
            ideaString = formatTwo(ideaString);
            break;
        case 3:
            ideaString = formatThree(ideaString);
            break;
        case 4:
            ideaString = formatFour(ideaString);
            break;
        default:
            ideaString = ideaString + "Just make GTA 6 lol";
            break;
    }
    return ideaString;
}

function formatZero(ideaString) {
    var genre0 = getRandomArrayElement(genres);
    var genre1 = getRandomArrayElement(genres);

    if(genre1 == genre0) {
        var modifiedGenreArray = genres.slice();
        var genre0Index = modifiedGenreArray.indexOf(genre0);
        modifiedGenreArray.splice(genre0Index, 1);
        genre1 = getRandomArrayElement(modifiedGenreArray);
    }

    return ideaString = ideaString + "A mix of " + genre0 + " and " + genre1 + " set " + getRandomArrayElement(locations);
}

function formatOne(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString = ideaString + getCorrectFormOfArticle(genre) + genre + " set " + getRandomArrayElement(locations);
}

function formatTwo(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString = ideaString + getCorrectFormOfArticle(genre) + genre + " where " + getRandomArrayElement(modifiers);
}

function formatThree(ideaString) {
    var theme = getRandomArrayElement(themes);
    theme = theme.replace(/^\w/, (c) => c.toUpperCase());
    return ideaString = ideaString + theme + ", but " + getRandomArrayElement(modifiers);
}

function formatFour(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString = ideaString + getCorrectFormOfArticle(genre) + genre + " about " + getRandomArrayElement(themes);
}

function getCorrectFormOfArticle(nextWord) {
    nextWord = nextWord.toLowerCase();
    var vowels = ["a", "e", "i", "o", "u"];
    for(let vowel of vowels) {
        if(nextWord.startsWith(vowel)) {
            return "An ";
        }
    }
    return "A ";
}

function getRandomArrayElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}


var genres = [
    "Stealth game",
    "Platformer",
    "Racing game",
    "Idle game",
    "First-Person Shooter",
    "Third-Person Shooter",
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
    "Drawing Game",
    "Browser Based Game",
    "Card Game",
    "Webcam/Mic Game",
    "VR Game",
    "Flying Game",
    "Sound based game",
    "Sound based horror game",
    "Mouse only game",
    "keyboard only game",
    "Midi instrument game",
    "Real life object game (eg, skylanders, amiibo etc.)",
    "Gacha Game"
];
var themes = [ //Come after "about" and at the start of a sentence
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
    "a car chase",
    "robbing a bank",
    "re-uniting a friendship",
    "hiding in a bunker",
    "summoning something",
    "buying upgrades too get better",
    "Slicing objects",
    "possesed puppets"
];
var modifiers = [ //Come after "where" and "but"
    "gravity is inverted",
    "keys are rebound every few seconds",
    "the player is blind",
    "dying is part of the progression",
    "the player and the enemies are controlled at the same time",
    "you can walk on walls",
    "the only move is jumping",
    "the player manipulates the environment instead of the main character",
    "the world is in 4D",
    "the world can switch between two places mid match",
    "you can draw too create something",
    "the player is scared of the mouse",
    "the world is turned upside down",

];
var locations = [ //Come after "set"
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
    "on top of an airship"
];