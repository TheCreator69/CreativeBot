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
    //var format = 1;
    //Format #0: A mix of GENRE and GENRE set in a LOCATION
    //Format #1: A GENRE set in LOCATION
    //Format #2: A GENRE where MODIFIER
    //Format #3: THEME, but MODIFIER
    //Format #4: A GENRE about a THEME
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
            //FIX: Capitalize the first letter of the theme
            ideaString = ideaString.concat(getRandomArrayElement(themes), ", but ", getRandomArrayElement(modifiers));
            break;
        case 4:
            ideaString = formatFour(ideaString);
            break;
        default:
            ideaString = "Just make GTA 6 lol";
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

    return ideaString.concat("A mix of ", genre0, " and ", genre1, " set ", getRandomArrayElement(locations));
}

function formatOne(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString.concat(getCorrectFormOfArticle(genre), genre, " set ", getRandomArrayElement(locations));
}

function formatTwo(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString.concat(getCorrectFormOfArticle(genre), genre, " where ", getRandomArrayElement(modifiers));
}

function formatFour(ideaString) {
    var genre = getRandomArrayElement(genres);
    return ideaString.concat(getCorrectFormOfArticle(genre), genre, " about ", getRandomArrayElement(themes));
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
    "Visual Novel"
];
var themes = [
    "an ambush",
    "an escort mission",
    "a chase",
    "a boss battle",
    "alternating perspectives",
    "a rainy night",
    "house cleaning"
];
var modifiers = [ //Needs to fit gramatically with "where" and "but"
    "gravity is inverted",
    "keys are rebound every few seconds",
    "the player is blind",
    "dying is part of the progression",
    "the player and the enemies are controlled at the same time",
    "you can walk on walls",
];
var locations = [ //Needs to fit gramatically with "set"
    "in a haunted house",
    "in a narrow subway tunnel",
    "on a small, peaceful island",
    "in an average middle-class household",
    "in an enchanted forest",
    "under the ocean",
    "on a small river with a strong current",
    "inside of a delicious cake",
    "inside a treehouse"
];
