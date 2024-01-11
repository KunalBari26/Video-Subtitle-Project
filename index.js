const express = require('express');
const app = express();
const serverConfig = require('./assets/serverConfig');
const databaseConnection = require('./assets/connectToDB');

async function connectToDatabase() {
    console.log('\n ================================== \n');
    console.log('Making connection with database');
    const sequelize = await databaseConnection.initiateConnection.connect();
    return sequelize;
}
async function terminateDatabaseConnection() {
    console.log('\n ================================== \n');
    console.log('Terminating connection with database');
    const closedConnecttion =
        await databaseConnection.initiateConnection.disconnect();
}
async function main() {
    app.get('/', async (req, res) => {
        res.json({
            status: 200,
            action: 'success',
            message: 'You have reached to the home page of application',
        });
    });

    app.listen(serverConfig.port, async () => {
        console.log('Server started on port ', serverConfig.port);
    });
    const SEQUELIZE = await connectToDatabase();
}
main();
