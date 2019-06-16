const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          firstname: {
            type: Sequelize.STRING,
          },
          lastname: {
            type: Sequelize.STRING,
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
          },
          role: {
            type: Sequelize.STRING,
          },
          category: {
            type: Sequelize.STRING,
          },
          mobile: {
            type: Sequelize.STRING,
          },
          password: {
            type: Sequelize.STRING,
          },
          country: {
            type: Sequelize.STRING,
          },
          qualifications: {
            type: Sequelize.STRING,
          },
          interests: {
            type: Sequelize.STRING,
          },
          field: {
            type: Sequelize.STRING,
          },
          loggedIn: {
            type: Sequelize.STRING,
          },
          resetpassword_token: {
            type: Sequelize.STRING
          },
          resetpassword_expirydate: {
            type: Sequelize.DATE,
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