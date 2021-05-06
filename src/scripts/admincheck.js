const Sequelize = require("sequelize");
const credentials = require("../credentials.json");

module.exports = {
    checkIfUserIsAdmin
};

async function checkIfUserIsAdmin(userID) {
    const sequelize = establishDatabaseConnection();
    const Admins = await defineAndSyncAdminTableModel(sequelize);
    return await checkTableForAdminEntry(userID, Admins);
}

function establishDatabaseConnection() {
    return new Sequelize(credentials.db_name, credentials.db_username, credentials.db_password, {
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

async function checkTableForAdminEntry(userID, Admins) {
    const adminEntry = await Admins.findOne({where: {id: userID}});
    if(adminEntry !== null) {
        return true;
    }
}
