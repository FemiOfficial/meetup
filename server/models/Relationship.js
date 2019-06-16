const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'relationship',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          user_id_one: {
            type: Sequelize.INTEGER,
          },
          user_id_two: {
            type: Sequelize.INTEGER,
          },
          status : {
            type: Sequelize.INTEGER,
          },
          action_user_id : {
            type: Sequelize.INTEGER,
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