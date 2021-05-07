import * as Sequelize from "sequelize";
import {Sequelize as SequelizeConstructor} from "sequelize";
import * as credentials from "../credentials.json";

export async function checkIfUserIsAdmin(userID: number) {
    const sequelize = establishDatabaseConnection();
    const Admins = await defineAndSyncAdminTableModel(sequelize);
    return await checkTableForAdminEntry(userID, Admins);
}

function establishDatabaseConnection() {
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
    return Admins;
}

async function checkTableForAdminEntry(userID: number, Admins: any) {
    const adminEntry = await Admins.findOne({where: {id: userID}});
    if(adminEntry !== null) {
        return true;
    }
    return false;
}
