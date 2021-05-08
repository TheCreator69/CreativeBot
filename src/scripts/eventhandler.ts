import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../credentials.json";

export async function getEventChannel(serverID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    return await getEventChannelEntry(serverID, EventChannels);
}

export function checkIfEventChannelIsActive(channelEntry: any) {
    return checkEventChannelEntryForActivity(channelEntry);
}

export async function setEventChannelActivity(serverID: bigint, active: boolean) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await toggleEventChannelEntry(EventChannels, serverID, active);
}

export async function createEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await createEventChannelEntry(EventChannels, serverID, channelID);
}

export async function changeEventChannel(serverID: bigint, channelID: bigint) {
    const sequelize = establishDatabaseConnection();
    const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    await changeEventChannelEntry(EventChannels, serverID, channelID);
}

export async function deleteEventChannel(serverID: bigint) {
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
    return EventChannels;
}

async function getEventChannelEntry(serverID: bigint, EventChannels: any) {
    return await EventChannels.findOne({where: {serverID: serverID}});
}

function checkEventChannelEntryForActivity(channelEntry: any) {
    return channelEntry.channelActive;
}

async function toggleEventChannelEntry(EventChannels: any, serverID: bigint, active: boolean) {
    var activeConverted = active.toString();
    await EventChannels.update({
        channelActive: activeConverted
    }, {
        where: {serverID: serverID}
    });
}

async function createEventChannelEntry(EventChannels: any, serverID: bigint, channelID: bigint) {
    await EventChannels.create({
        serverID: serverID,
        eventChannelID: channelID,
        channelActive: false
    });
}

async function changeEventChannelEntry(EventChannels: any, serverID: bigint, newChannelID: bigint) {
    await EventChannels.update({eventChannelID: newChannelID}, {
        where: {
            serverID: serverID
        }
    });
}

async function deleteEventChannelEntry(EventChannels: any, serverID: bigint) {
    await EventChannels.destroy({
        where: {serverID: serverID}
    });
}
