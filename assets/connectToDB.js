const { Sequelize } = require('sequelize');
const config = require('./databaseConfig');
const sequelize = new Sequelize(config.databaseURI);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection Has Been Made Successfully With Database \n');
        console.log('=====================================================');
        return sequelize;
    } catch (error) {
        console.error(
            '\n Connection Cannot Be Made With Database Due To Following Errors ===>  \n\n',
            error
        );
        console.log('=====================================================');
        return null;
    }
}

async function disconnectDatabase() {
    try {
        await sequelize.close();
        console.log('Connection With The Database Has Been Terminated');
        console.log('=====================================================');
        return 0;
    } catch (error) {
        console.log(
            '\n Connection Could Not Be Terminated Because Of Following Errors ===> \n\n',
            error
        );
        console.log('=====================================================');
    }
}

const initiateConnection = {
    connect: async function () {
        const sequelize = await connectToDatabase();
    },
    disconnect: async function () {
        const disconnect = await disconnectDatabase();
    },
};

module.exports = {
    initiateConnection,
};
