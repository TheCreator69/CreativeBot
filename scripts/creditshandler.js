const Sequelize = require("sequelize");

module.exports = {
    async getCreditsForUser(userID) {
        const sequelize = establishDatabaseConnection();
        const Credits = await defineAndSyncCreditsTableModel(sequelize);
        const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
        return userEntry.credits;
    },
    async incrementCreditsForUser(userID, incrementAmount) {
        const sequelize = establishDatabaseConnection();
        const Credits = await defineAndSyncCreditsTableModel(sequelize);
        const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
        await updateUserCredits(userID, userEntry.credits + incrementAmount, Credits);
    },
    async setCreditsForUser(userID, amount) {
        const sequelize = establishDatabaseConnection();
        const Credits = await defineAndSyncCreditsTableModel(sequelize);
        const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
        await updateUserCredits(userID, amount, Credits);
    },
    async getCreditsRankForUser(userID) {
        const sequelize = establishDatabaseConnection();
        const Credits = await defineAndSyncCreditsTableModel(sequelize);
        return await sortTableEntriesAndReturnPosition(Credits, userID);
    }
};

function establishDatabaseConnection() {
    return new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncCreditsTableModel(sequelize) {
    const Credits = sequelize.define("credits", {
        userID: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        credits: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    });
    await Credits.sync();
    return Credits;
}

async function returnExistingEntryOrCreateNewOne(userID, Credits) {
    const userEntry = await Credits.findOne({where: {userID: userID}});
    if(userEntry === null) {
        return await Credits.create({userID: userID, credits: 0});
    }
    else {
        return userEntry;
    }
}

async function updateUserCredits(userID, newCredits, Credits) {
    newCredits = newCredits.toString();
    await Credits.update({
        credits: newCredits
    }, {
        where: {userID: userID}
    });
}

async function sortTableEntriesAndReturnPosition(Credits, userID) {
    const sortedEntries = await Credits.findAll({
        order: [
            ["credits", "DESC"]
        ]
    });
    var position = 0;
    for(var i = 0; i < sortedEntries.length; i++) {
        if(userID === sortedEntries[i].userID) {
            position = i + 1;
        }
    }
    var rankObject = {
        position: position,
        max: sortedEntries.length
    };
    return rankObject;
}
