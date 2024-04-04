const {Sequelize} = require("sequelize");

module.exports = new Sequelize(
    'calendar_db',
    'postgres',
    'andre2004',
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
)