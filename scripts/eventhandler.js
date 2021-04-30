const Sequelize = require("sequelize");

module.exports = {
    async getEventChannelForGuild(guildID) {
        const sequelize = establishDatabaseConnection();
        const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
        return await getGuildEventChannel(guildID, EventChannels);
    },
    async getIfEventChannelIsActive(channelEntry) {
        return checkIfEventChannelIsActive(channelEntry);
    },
    async toggleEventChannel(guildID, active) {
        const sequelize = establishDatabaseConnection();
        const EventChannels = await defineAndSyncEventChannelTableModel(sequelize);
        const channelEntry = await getGuildEventChannel(guildID, EventChannels);
        await toggleEventChannelInternal(EventChannels, channelEntry, active);
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

async function getGuildEventChannel(guildID, EventChannels) {
    return await EventChannels.findOne({where: {serverID: guildID}});
}

async function checkIfEventChannelIsActive(channelEntry) {
    return channelEntry.channelActive;
}

async function toggleEventChannelInternal(EventChannels, channelEntry, active) {
    active = active.toString();
    await EventChannels.update({
        channelActive: active
    }, {
        where: {serverID: channelEntry.serverID}
    });
}
