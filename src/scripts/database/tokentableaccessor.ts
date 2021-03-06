import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../../credentials.json";
import {LogChamp, Category} from "../logchamp";

var logChampInst = new LogChamp(Category.DatabaseQuery);

export interface TokenRanking {
    position: number,
    max: number
}

export interface UserEntry {
    userID: bigint,
    tokens: number,
    vouchTokens: number
}

export async function getTokensOfUser(userID: bigint): Promise<number> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Tokens);
    sequelize.close();

    logChampInst.info("FETCH: User tokens", {userID: userID, tokens: userEntry.tokens});
    return userEntry.tokens;
}

export async function getVouchTokensOfUser(userID: bigint): Promise<number> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Tokens);
    sequelize.close();

    logChampInst.info("FETCH: User vouch tokens", {userID: userID, tokens: userEntry.vouchTokens});
    return userEntry.vouchTokens;
}

export async function incrementTokensOfUser(userID: bigint, incrementAmount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Tokens);
    await updateUserTokens(userID, userEntry.tokens + incrementAmount, Tokens);

    logChampInst.info("UPDATE: User tokens", {userID: userID, newTokens: userEntry.tokens});
    sequelize.close();
}

export async function setVouchTokensOfUser(userID: bigint, amount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    await updateUserVouchTokens(userID, amount, Tokens);

    logChampInst.info("UPDATE: User vouch tokens", {userID: userID, amount: amount});
    sequelize.close();
}

export async function incrementVouchTokensOfUser(userID: bigint, incrementAmount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const userEntry = await returnExistingEntryOrCreateNewOne(userID, Tokens);
    await updateUserVouchTokens(userID, userEntry.vouchTokens + incrementAmount, Tokens);

    logChampInst.info("UPDATE: User vouch tokens", {userID: userID, amount: incrementAmount, vouchTokens: userEntry.vouchTokens});
    sequelize.close();
}

export async function setTokensOfUser(userID: bigint, amount: number): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    await updateUserTokens(userID, amount, Tokens);

    logChampInst.info("UPDATE: User tokens", {userID: userID});
    sequelize.close();
}

export async function resetVouchTokens(): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    await resetAllUserVouchTokens(Tokens);

    logChampInst.info("UPDATE: User vouch tokens");
    sequelize.close();
}

export async function resetTokens(): Promise<void> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    await resetAllUserTokens(Tokens);

    logChampInst.info("UPDATE: User tokens");
    sequelize.close();
}

export async function getTokenRankOfUser(userID: bigint): Promise<TokenRanking> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const tokenRank = await sortTableEntriesAndReturnRank(Tokens, userID);
    sequelize.close();

    logChampInst.info("FETCH: User token rank", {userID: userID, tokenRank: tokenRank});
    return tokenRank;
}

export async function getUserEntryAtRank(rank: number): Promise<UserEntry | undefined> {
    const sequelize = establishDatabaseConnection();
    const Tokens = await defineAndSyncTokensTableModel(sequelize);
    const userEntry = await sortTableEntriesAndReturnEntryAtRank(Tokens, rank);
    sequelize.close();

    logChampInst.info("FETCH: User object at token rank", {rank: rank, userEntry: userEntry});
    return userEntry;
}

export async function getTopTenUsers(): Promise<UserEntry[]> {
    let topUserEntries: UserEntry[] = [];
    for(let i = 1; i <= 10; i++) {
        var userEntryAtRank = await getUserEntryAtRank(i);
        if(userEntryAtRank !== undefined) {
            topUserEntries.push(userEntryAtRank);
        }
    }

    logChampInst.info("FETCH: Top ten users", {userEntryLength: topUserEntries.length});
    return topUserEntries;
}

function establishDatabaseConnection(): SequelizeConstructor {
    logChampInst.debug("Tokens: database connection established");
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncTokensTableModel(sequelize: SequelizeConstructor): Promise<Sequelize.ModelCtor<Sequelize.Model<any, any>>> {
    const Tokens = sequelize.define("tokens", {
        userID: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        tokens: {
            type: Sequelize.INTEGER
        },
        vouchTokens: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    });
    await Tokens.sync();
    logChampInst.debug("Tokens: Synced table");
    return Tokens;
}

async function returnExistingEntryOrCreateNewOne(userID: bigint, Tokens: any) {
    const userEntry = await Tokens.findOne({where: {userID: userID}});
    if(userEntry === null) {
        logChampInst.debug("CREATE: user entry", {userID: userID});
        return await Tokens.create({userID: userID, tokens: 0, vouchTokens: 10});
    }
    else {
        logChampInst.debug("FETCH: user entry", {userID: userID});
        return userEntry;
    }
}

async function updateUserTokens(userID: bigint, newTokens: number, Tokens: any): Promise<void> {
    if(newTokens < 0) {
        newTokens = 0;
    }
    var newTokensConverted = newTokens.toString();
    await Tokens.update({
        tokens: newTokensConverted
    }, {
        where: {userID: userID}
    });
    logChampInst.debug("UPDATE: user tokens", {userID: userID, tokens: newTokens});
}

async function updateUserVouchTokens(userID: bigint, newVouchTokens: number, Tokens: any): Promise<void> {
    if(newVouchTokens < 0) {
        newVouchTokens = 0;
    }
    var newVouchTokensConverted = newVouchTokens.toString();
    await Tokens.update({
        vouchTokens: newVouchTokensConverted
    }, {
        where: {userID: userID}
    });
    logChampInst.debug("UPDATE: user vouch tokens", {userID: userID, vouchTokens: newVouchTokens});
}

async function resetAllUserVouchTokens(Tokens: any): Promise<void> {
    await Tokens.update({
        vouchTokens: 10
    }, {
        where: {
            vouchTokens: {
                [Sequelize.Op.lt]: 10
            }
        }
    });
}

async function resetAllUserTokens(Tokens: any): Promise<void> {
    await Tokens.update({
        tokens: 0
    }, {
        where: {
            tokens: {
                [Sequelize.Op.gt]: 0
            }
        }
    });
}

async function sortTableEntriesAndReturnRank(Tokens: any, userID: bigint): Promise<TokenRanking> {
    const sortedEntries = await sortTableEntriesByRank(Tokens);
    var position = 0;
    var userIDConverted = userID.toString();
    for(var i = 0; i < sortedEntries.length; i++) {
        if(userIDConverted === sortedEntries[i].userID) {
            position = i + 1;
        }
    }
    var rankObject: TokenRanking = {
        position: position,
        max: sortedEntries.length
    };
    logChampInst.debug("FETCH: user token rank", {userID: userID, rankPosition: position});
    return rankObject;
}

async function sortTableEntriesAndReturnEntryAtRank(Tokens: any, rank: number): Promise<UserEntry | undefined> {
    const sortedEntries = await sortTableEntriesByRank(Tokens);
    const entry = sortedEntries[rank - 1];
    if(entry === undefined) return;
    var userEntry: UserEntry = {
        userID: entry.userID,
        tokens: entry.tokens,
        vouchTokens: entry.vouchTokens
    };
    logChampInst.debug("FETCH: user entry at token rank", {userEntry: userEntry});
    return userEntry;
}

async function sortTableEntriesByRank(Tokens: any): Promise<any> {
    const sortedEntries = await Tokens.findAll({
        order: [
            ["tokens", "DESC"]
        ]
    });
    return sortedEntries;
}
