const sequelize = require("./db");
const {DataTypes} = require("sequelize");

const User = sequelize.define('user', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
})

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE},
    author_id: {type: DataTypes.INTEGER}
})
 const UserEvent = sequelize.define('user_event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
 })

 User.belongsToMany(Event, {through: UserEvent});
 Event.belongsToMany(User, {through: UserEvent});

 module.exports = {
    User, Event, UserEvent
 }