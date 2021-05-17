import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../credentials.json";

export interface CreditsRanking {
    position: number,
    max: number
}

export async function getCreditsForUser(userID: bigint): Promise<number> {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
    return userEntry.credits;
}

export async function incrementCreditsForUser(userID: bigint, incrementAmount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Credits);
    await updateUserCredits(userID, userEntry.credits + incrementAmount, Credits);
}

export async function setCreditsForUser(userID: bigint, amount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    await updateUserCredits(userID, amount, Credits);
}

export async function getCreditsRankForUser(userID: bigint): Promise<CreditsRanking> {
    const sequelize = establishDatabaseConnection();
    const Credits = await defineAndSyncCreditsTableModel(sequelize);
    return await sortTableEntriesAndReturnRank(Credits, userID);
}

function establishDatabaseConnection(): SequelizeConstructor {
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncCreditsTableModel(sequelize: SequelizeConstructor): Promise<Sequelize.ModelCtor<Sequelize.Model<any, any>>> {
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

async function updateUserCredits(userID: bigint, newCredits: number, Credits: any): Promise<void> {
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

async function sortTableEntriesAndReturnRank(Credits: any, userID: bigint): Promise<CreditsRanking> {
    const sortedEntries = await Credits.findAll({
        order: [
            ["credits", "DESC"]
        ]
    });
    var position = 0;
    var userIDConverted = userID.toString();
    for(var i = 0; i < sortedEntries.length; i++) {
        if(userIDConverted === sortedEntries[i].userID) {
            position = i + 1;
        }
    }
    var rankObject: CreditsRanking = {
        position: position,
        max: sortedEntries.length
    };
    return rankObject;
}
