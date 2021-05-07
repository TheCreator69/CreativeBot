import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../credentials.json";

export async function getEventChannel(serverID) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    return await getEventChannelEntry(serverID, EventChannels);
}

export async function checkIfEventChannelIsActive(channelEntry) {
    return checkEventChannelEntryForActivity(channelEntry);
}

export async function setEventChannelActivity(serverID, active) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await toggleEventChannelEntry(EventChannels, serverID, active);
}

export async function createEventChannel(serverID, channelID) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await createEventChannelEntry(EventChannels, serverID, channelID);
}

export async function changeEventChannel(serverID, channelID) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await changeEventChannelEntry(EventChannels, serverID, channelID);
}

export async function deleteEventChannel(serverID) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await deleteEventChannelEntry(EventChannels, serverID);
}

function establishDatabaseConnection() {
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncEventChannelTableModel(sequelize) {
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
    return EventChannels;
}

async function getEventChannelEntry(serverID, EventChannels) {
    return await EventChannels.findOne({where: {serverID: serverID}});
}

async function checkEventChannelEntryForActivity(channelEntry) {
    return channelEntry.channelActive;
}

async function toggleEventChannelEntry(EventChannels, serverID, active) {
    active = active.toString();
    await EventChannels.update({
        channelActive: active
    }, {
        where: {serverID: serverID}
    });
}

async function createEventChannelEntry(EventChannels, serverID, channelID) {
    await EventChannels.create({
        serverID: serverID,
        eventChannelID: channelID,
        channelActive: false
    });
}

async function changeEventChannelEntry(EventChannels, serverID, newChannelID) {
    await EventChannels.update({eventChannelID: newChannelID}, {
        where: {
            serverID: serverID
        }
    });
}

async function deleteEventChannelEntry(EventChannels, serverID) {
    await EventChannels.destroy({
        where: {serverID: serverID}
    });
}
