const { Sequelize, DataTypes, FLOAT } = require('sequelize');
const db = require('../../config')

const Carrier = db.define("carrier", {
    id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timeLimit: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    minWeight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    maxWeight: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
})

module.exports = Carrier