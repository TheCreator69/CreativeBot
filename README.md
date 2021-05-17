# Creative Bot

## Refactoring Checklist
Now that the TypeScript conversion has been successful, it is time to refactor!
- [ ] Rename variables, functions and files if needed (remove words like "manager" and "handler")
- [ ] DRY (don't repeat yourself): sequelize objects for instance, and any other duplicate code
- [ ] Remove "hidden" input arguments like the active database connection used inside of functions
- [ ] Make sure that state changes can be easily traced outside of the function responsible (functions changing state as input arguments)
- [ ] Make use of interfaces to allow for mock objects (e.g. a mock database table for testing)
- [ ] Remove any "anys" as types and define objects & interfaces for input arguments
- [ ] Add return types for functions with TypeScript
- [ ] Add classes for modules in the scripts folder
- [ ] Split large execute() functions into smaller, more modular functions
- [ ] Reorganize functions if needed, extract them maybe
- [ ] Add enums if needed

This discord bot is being created by TheCreator with [TypeScript](https://www.typescriptlang.org/), using discord.js.\
**It is intended for my personal use only.**\
I have still added support for multiple servers, just in case, even though I just have one at the moment. Sharding is not supported, however.

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
- [jest](https://jestjs.io/) with [ts-jest](https://www.npmjs.com/package/ts-jest) (automated code testing)
- and more...

### Other Credits
Obama Pictures:
- http://www.acclaimimages.com/_gallery/_free_images/0519-0906-1522-3927_president_barack_obama_points_at_you_o.jpg
- https://ksassets.timeincuk.net/wp/uploads/sites/46/2017/08/Barack-Obama-1.jpg
- https://media1.popsugar-assets.com/files/thumbor/NwEsD8SynNHbb5XVqvPv4Zy3ED0/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2020/11/13/842/n/1922283/4493f6825faedaa70cd706.95048289_/i/what-is-barack-obamas-a-promised-land-book-about.jpg
- https://newsinafrica.co/wp-content/uploads/2017/12/Former-President-Barrack-Obama.jpg
