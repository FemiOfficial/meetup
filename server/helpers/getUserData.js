const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const User = require("../models/User");
const Relationship = require("../models/Relationship");

module.exports = getUserData = (data) => {
        User.findOne({ 
            where: {id: data.id}
        })
        .then(user => {
            data = {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                country: user.country,
                category: user.category,
                qualifications: user.qualifications,
                interests: user.interests,
            }
            return data;
        })
           
}


