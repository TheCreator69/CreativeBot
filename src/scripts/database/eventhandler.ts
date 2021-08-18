import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../../credentials.json";
import {LogChamp, Category} from "../logchamp";

var logChampInst = new LogChamp(Category.DatabaseQuery);

export async function getEventChannel(serverID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    logChampInst.info("FETCH: Event channel", {serverID: serverID});
    return await getEventChannelEntry(serverID, EventChannels);
}

export function checkIfEventChannelIsActive(channelEntry: any) {
    var channelActive = checkEventChannelEntryForActivity(channelEntry);
    logChampInst.info("FETCH: Event channel status", {active: channelActive});
    return channelActive;
}

export async function setEventChannelActivity(serverID: bigint, active: boolean) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await toggleEventChannelEntry(EventChannels, serverID, active);
    logChampInst.info("UPDATE: Event channel status", {serverID: serverID, active: active});
}

export async function createEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await createEventChannelEntry(EventChannels, serverID, channelID);
    logChampInst.info("UPDATE: Event channel ID", {serverID: serverID, channelID: channelID});
}

export async function changeEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await changeEventChannelEntry(EventChannels, serverID, channelID);
    logChampInst.info("UPDATE: Change event channel ID", {serverID: serverID, channelID: channelID});
}

export async function deleteEventChannel(serverID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await deleteEventChannelEntry(EventChannels, serverID);
    logChampInst.info("UPDATE: Delete event channel", {serverID: serverID});
}

function establishDatabaseConnection() {
    logChampInst.debug("Events: database connection established");
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncEventChannelTableModel(sequelize: any) {
    const EventChannels = sequelize.define("eventChannels", {
        serverID: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        eventChannelID: {
            type: Sequelize.BIGINT
        },
        channelActive: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        timestamps: false
    });
    await EventChannels.sync();
    logChampInst.debug("Events: Synced table");
    return EventChannels;
}

async function getEventChannelEntry(serverID: bigint, EventChannels: any) {
    logChampInst.debug("FETCH: Event channel entry", {serverID: serverID});
    return await EventChannels.findOne({where: {serverID: serverID}});
}

function checkEventChannelEntryForActivity(channelEntry: any) {
    logChampInst.debug("FETCH: Event channel entry status");
    return channelEntry.channelActive;
}

async function toggleEventChannelEntry(EventChannels: any, serverID: bigint, active: boolean) {
    var activeConverted = active.toString();
    await EventChannels.update({
        channelActive: activeConverted
    }, {
        where: {serverID: serverID}
    });
    logChampInst.debug("UPDATE: Event channel entry status");
}

async function createEventChannelEntry(EventChannels: any, serverID: bigint, channelID: bigint) {
    await EventChannels.create({
        serverID: serverID,
        eventChannelID: channelID,
        channelActive: false
    });
    logChampInst.debug("CREATE: Event channel entry");
}

async function changeEventChannelEntry(EventChannels: any, serverID: bigint, newChannelID: bigint) {
    await EventChannels.update({eventChannelID: newChannelID}, {
        where: {
            serverID: serverID
        }
    });
    logChampInst.debug("UPDATE: Event channel entry");
}

async function deleteEventChannelEntry(EventChannels: any, serverID: bigint) {
    await EventChannels.destroy({
        where: {serverID: serverID}
    });
    logChampInst.debug("DESTROY: Event channel entry");
}
