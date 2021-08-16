import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../../credentials.json";
import * as LogChamp from "../logchamp";

export async function getEventChannel(serverID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    LogChamp.info("FETCH: Event channel", {serverID: serverID});
    return await getEventChannelEntry(serverID, EventChannels);
}

export function checkIfEventChannelIsActive(channelEntry: any) {
    var channelActive = checkEventChannelEntryForActivity(channelEntry);
    LogChamp.info("FETCH: Event channel status", {active: channelActive});
    return channelActive;
}

export async function setEventChannelActivity(serverID: bigint, active: boolean) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await toggleEventChannelEntry(EventChannels, serverID, active);
    LogChamp.info("UPDATE: Event channel status", {serverID: serverID, active: active});
}

export async function createEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await createEventChannelEntry(EventChannels, serverID, channelID);
    LogChamp.info("UPDATE: Event channel ID", {serverID: serverID, channelID: channelID});
}

export async function changeEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await changeEventChannelEntry(EventChannels, serverID, channelID);
    LogChamp.info("UPDATE: Change event channel ID", {serverID: serverID, channelID: channelID});
}

export async function deleteEventChannel(serverID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await deleteEventChannelEntry(EventChannels, serverID);
    LogChamp.info("UPDATE: Delete event channel", {serverID: serverID});
}

function establishDatabaseConnection() {
    LogChamp.info("Events: database connection established");
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
    LogChamp.info("Events: Synced table");
    return EventChannels;
}

async function getEventChannelEntry(serverID: bigint, EventChannels: any) {
    LogChamp.info("FETCH: Event channel entry", {serverID: serverID});
    return await EventChannels.findOne({where: {serverID: serverID}});
}

function checkEventChannelEntryForActivity(channelEntry: any) {
    LogChamp.info("FETCH: Event channel entry status");
    return channelEntry.channelActive;
}

async function toggleEventChannelEntry(EventChannels: any, serverID: bigint, active: boolean) {
    var activeConverted = active.toString();
    await EventChannels.update({
        channelActive: activeConverted
    }, {
        where: {serverID: serverID}
    });
    LogChamp.info("UPDATE: Event channel entry status");
}

async function createEventChannelEntry(EventChannels: any, serverID: bigint, channelID: bigint) {
    await EventChannels.create({
        serverID: serverID,
        eventChannelID: channelID,
        channelActive: false
    });
    LogChamp.info("CREATE: Event channel entry");
}

async function changeEventChannelEntry(EventChannels: any, serverID: bigint, newChannelID: bigint) {
    await EventChannels.update({eventChannelID: newChannelID}, {
        where: {
            serverID: serverID
        }
    });
    LogChamp.info("UPDATE: Event channel entry");
}

async function deleteEventChannelEntry(EventChannels: any, serverID: bigint) {
    await EventChannels.destroy({
        where: {serverID: serverID}
    });
    LogChamp.info("DESTROY: Event channel entry");
}
