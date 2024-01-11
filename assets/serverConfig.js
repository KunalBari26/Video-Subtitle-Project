require('dotenv').config();
const port = process.env.PORT;
const environment = process.env.ENVIRONMENT;

module.exports = {
    port,
    environment,
};
