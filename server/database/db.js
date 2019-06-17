const Sequelize = require("sequelize");
const db = {};
// const sequelize = new Sequelize("meet_upnode",
//         "root", "", {
//             host: "localhost",
//             dialect: "mysql",
//             operatorsAliases: false,

//             pool: {
//                 max: 5,
//                 min: 0,
//                 acquire: 30000,
//                 idle: 10000
//             }
//         })

const sequelize = new Sequelize("heroku_c27a069b2f6b005",
        "b97c9dff61b4b0", "0bd03b8f", {
            host: "us-cdbr-iron-east-02.cleardb.net",
            dialect: "mysql",
            operatorsAliases: false,

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        })

db.sequelize = sequelize;
db.Sequelize = Sequelize


module.exports = db;