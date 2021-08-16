import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../../credentials.json";
import * as LogChamp from "../logchamp";

export async function checkIfUserIsAdmin(userID: bigint) {
    const sequelize = establishDatabaseConnection();
    const Admins = await defineAndSyncAdminTableModel(sequelize);
    LogChamp.info("Check for user admin privileges", {userID: userID});
    return await checkTableForAdminEntry(userID, Admins);
}

function establishDatabaseConnection() {
    LogChamp.info("Admins: database connection established");
    return new SequelizeConstructor(credentials.db_name, credentials.db_username, credentials.db_password, {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
}

async function defineAndSyncAdminTableModel(sequelize: any) {
    const Admins = sequelize.define("admins", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        }
    }, {
        timestamps: false
    });
    await Admins.sync();
    LogChamp.info("Admins: Synced table");
    return Admins;
}

async function checkTableForAdminEntry(userID: bigint, Admins: any) {
    const adminEntry = await Admins.findOne({where: {id: userID}});

    if(adminEntry !== null) {
        LogChamp.info("User is an admin", {userID: userID});
        return true;
    }

    LogChamp.info("User is not an admin", {userID: userID});
    return false;
}
