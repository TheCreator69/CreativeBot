# Creative Bot

## EXPERIMENTAL TYPESCRIPT CONVERSION BRANCH
Refactoring Checklist:
- [] Move responsibility of connecting to database out of scripts
- [] Remove "hidden" input arguments like the active database connection
- [] Make use of interfaces to allow for mock objects (e.g. a mock database for testing)
- [] Remove any "anys" as types and define objects & interfaces for input arguments
- [] Add classes for modules in the scripts folder
- [] Add return types for functions
- [] Split large execute() functions for commands into smaller, more modular functions
- [] Add enums if needed
- [] Rename variables and functions if needed
- [] Reorganize functions when needed
- [] Make sure that state changes can be easily traced outside of the function responsible (functions changing state as input arguments)

This discord bot is being created by TheCreator with [TypeScript](https://www.typescriptlang.org/), using discord.js.\
**It is intended for my personal use only.**\
That's why it can only do the things I want it to do.
But I have still added support for multiple servers, just in case (even though I just own one).

## What it can do
- [x] Fun Commands: generate a random game idea, simulate a slot machine and create an inspiring Obama message
- [x] Creative Credits System: every time you're active on the Creative Discord, the bot will award you a few credits
- [x] Event System: I'd like to host regular events on my Discord and my bot will help me with this :smile:

### Node Modules used
- [discord.js](https://discord.js.org/#/) (interaction with the Discord Bot API via JavaScript)
- [canvas](https://nodecanvas.paradoxnotion.com/documentation/) (image manipulation)
- [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) (more ways of running my bot processes)
- [eslint](https://eslint.org/docs/user-guide/getting-started) (checking my code for style inconsistencies)
- [winston](https://github.com/winstonjs/winston) (more sophisticated logging)
- [sequelize](https://sequelize.org/master/) (accessing databases in an easier to read way)
- [jest](https://jestjs.io/) (automated code testing)

### Other Credits
Obama Picture: http://www.acclaimimages.com/_gallery/_free_images/0519-0906-1522-3927_president_barack_obama_points_at_you_o.jpg
