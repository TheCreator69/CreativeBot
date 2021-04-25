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
