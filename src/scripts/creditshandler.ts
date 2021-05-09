import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../credentials.json";

export async function getCreditsForUser(userID: bigint) {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
    return userEntry.credits;
}

export async function incrementCreditsForUser(userID: bigint, incrementAmount: number) {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
    await updateUserCredits(userID, userEntry.credits + incrementAmount, Credits);
}

export async function setCreditsForUser(userID: bigint, amount: number) {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    await updateUserCredits(userID, amount, Credits);
}

export async function getCreditsRankForUser(userID: bigint) {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    return await sortTableEntriesAndReturnPosition(Credits, userID);
}

function establishDatabaseConnection() {
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncCreditsTableModel(sequelize: any) {
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

async function returnExistingEntryOrCreateNewOne(userID: bigint, Credits: any) {
    const userEntry = await Credits.findOne({where: {userID: userID}});
    if(userEntry === null) {
        return await Credits.create({userID: userID, credits: 0});
    }
    else {
        return userEntry;
    }
}

async function updateUserCredits(userID: bigint, newCredits: number, Credits: any) {
    if(newCredits < 0) {
        newCredits = 0;
    }
    var newCreditsConverted = newCredits.toString();
    await Credits.update({
        credits: newCreditsConverted
    }, {
        where: {userID: userID}
    });
}

async function sortTableEntriesAndReturnPosition(Credits: any, userID: bigint) {
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
