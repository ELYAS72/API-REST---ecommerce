const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config')
const Role = require('./roleModel')
const Etre = require('./etreModel')
const bcrypt = require('bcrypt');
const Address = require('./addressModel');

const User = db.define("user" , {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    hooks: {
        beforeCreate: (User) => {
            User.password = User.password && User.password != "" ? bcrypt.hashSync(User.password, 10) : "";
        }
    }
})
User.belongsToMany(Role, {through: Etre})
Role.belongsToMany(User, {through: Etre})

User.hasMany(Address)
Address.belongsTo(User)

db.sync();
module.exports = User

