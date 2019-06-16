const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'message',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          sender: {
            type: Sequelize.INTEGER,
          },
          recipient: {
            type: Sequelize.INTEGER,
          },
          message: {
            type: Sequelize.STRING,
          },
          created: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW
          },
          updated: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
          }
        }, {
            timestamps: false
        }

)