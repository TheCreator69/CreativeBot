const config = require("../config.json");
const Sequelize = require("sequelize");

module.exports = {
    name: "message",
    async execute(message, client) {
        if(!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) {
            message.channel.send("Sorry, but this command is invalid :frowning:");
            return;
        }

        var commandMapEntry = client.commands.get(command);
        if(commandMapEntry.admin_only && !await findOutIfUserIsAdmin(message)) {
            message.channel.send("Sorry, but this command is invalid :frowning:");
            return;
        }
        if(args.length < commandMapEntry.min_args) {
            message.channel.send("You need to provide the require arguments for the command to work! See `%help " + commandMapEntry.name + "` for details!");
            return;
        }
        commandMapEntry.execute(message, args);
    }
};

async function findOutIfUserIsAdmin(message) {
    const sequelize = establishDatabaseConnection();
    const Admins = await defineAndSyncAdminTableModel(sequelize);
    return await checkIfUserIsAdmin(message, Admins);
}

function establishDatabaseConnection() {
    return new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncAdminTableModel(sequelize) {
    const Admins = sequelize.define("admins", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        }
    }, {
        timestamps: false
    });
    await Admins.sync();
    return Admins;
}

async function checkIfUserIsAdmin(message, Admins) {
    const adminEntry = await Admins.findOne({where: {id: message.author.id}});
    if(adminEntry !== null) {
        return true;
    }
}
