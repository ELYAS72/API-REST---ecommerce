const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config')

const Role = db.define("role", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    }
})

Role.sync().then(
()=>{
    Role.findOrCreate({
        where: {
            name: "admin"
        },
        defaults : {
            name: "admin"
        }
    })
    Role.findOrCreate({
        where: {
            name: "seller"
        },
        defaults : {
            name: "seller"
        }
    })
    Role.findOrCreate({
        where: {
            name: "buyer"
        },
        defaults : {
            name: "buyer"
        }
    })
    Role.findOrCreate({
        where: {
            name: "user"
        },
        defaults : {
            name: "user"
        }
    })
}
)

module.exports = Role
