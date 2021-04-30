const Sequelize = require("sequelize");

module.exports = {
    async getEventChannel(guildID) {
        const sequelize = establishDatabaseConnection();
        const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
        return await getEventChannelEntry(guildID, EventChannels);
    },
    async checkIfEventChannelIsActive(channelEntry) {
        return checkEventChannelEntryForActivity(channelEntry);
    },
    async setEventChannelActivity(guildID, active) {
        const sequelize = establishDatabaseConnection();
        const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
        const channelEntry = await getEventChannelEntry(guildID, EventChannels);
        await toggleEventChannelEntry(EventChannels, channelEntry, active);
    },
    //Function for creating an event channel in a server
    async createEventChannel(guildID, channelID) {
        const sequelize = establishDatabaseConnection();
        const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
    },
    async setEventChannel(guildID, channelID) {
        //Function for changing an event channel in a server
    },
    async deleteEventChannel(guildID) {
        //Function for deleting an event channel in a server
    }
};

function establishDatabaseConnection() {
    return new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
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

async function getEventChannelEntry(guildID, EventChannels) {
    return await EventChannels.findOne({where: {serverID: guildID}});
}

async function checkEventChannelEntryForActivity(channelEntry) {
    return channelEntry.channelActive;
}

async function toggleEventChannelEntry(EventChannels, channelEntry, active) {
    active = active.toString();
    await EventChannels.update({
        channelActive: active
    }, {
        where: {serverID: channelEntry.serverID}
    });
}
