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
    //var format = 4;
    //Format #0: A mix of GENRE and GENRE set in a LOCATION
    //Format #1: A GENRE set in LOCATION
    //Format #2: A GENRE where MODIFIER
    //Format #3: THEME, but MODIFIER
    //Format #4: A GENRE about a THEME
    var ideaString = "**Game Idea:** \n";
    switch(format) {
        case 0:
            //FIX: two identical genres
            ideaString = ideaString.concat("A mix of ", getRandomArrayElement(genres), " and ", getRandomArrayElement(genres), " set ", getRandomArrayElement(locations));
            break;
        case 1:
            //FIX: Sometimes, "A" needs to be "An" to be gramatically correct (applies to formats 0, 1, 2 and 4)
            ideaString = ideaString.concat("A ", getRandomArrayElement(genres), " set ", getRandomArrayElement(locations));
            break;
        case 2:
            ideaString = ideaString.concat("A ", getRandomArrayElement(genres), " where ", getRandomArrayElement(modifiers));
            break;
        case 3:
            //FIX: Capitalize the first letter of the theme
            ideaString = ideaString.concat(getRandomArrayElement(themes), ", but ", getRandomArrayElement(modifiers));
            break;
        case 4:
            ideaString = ideaString.concat("A ", getRandomArrayElement(genres), " about ", getRandomArrayElement(themes));
            break;
        default:
            ideaString = "Just make GTA 6 lol";
            break;
    }
    return ideaString;
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
