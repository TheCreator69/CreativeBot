const Sequelize = require("sequelize");

module.exports = {
    async findOutIfUserIsAdmin(userID) {
        const sequelize = establishDatabaseConnection();
        const Admins = await defineAndSyncAdminTableModel(sequelize);
        return await checkIfUserIsAdmin(userID, Admins);
    }
};

function establishDatabaseConnection() {
    return new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncAdminTableModel(sequelize) {
    const Admins = sequelize.define("admins", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        }
    }, {
        timestamps: false
    });
    await Admins.sync();
    return Admins;
}

async function checkIfUserIsAdmin(userID, Admins) {
    const adminEntry = await Admins.findOne({where: {id: userID}});
    if(adminEntry !== null) {
        return true;
    }
}
