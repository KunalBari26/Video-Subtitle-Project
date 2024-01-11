const developmentConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
};
const databaseURI = process.env.DB_URI;

module.exports = {
    developmentConfig,
    databaseURI,
};
