const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const countRouter = express.Router();

const cors = require("cors");

const jwt = require("jsonwebtoken");

const Relationship = require("../models/Relationship");
const checkAuth = require("../middlewares/checkAuth");

countRouter.use(cors());

countRouter.post('/countPendingRequests', checkAuth.verifyToken, (req, res) => {
    
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Relationship.findAll({
        where: {
            user_id_one: decoded.id,
            status: 0
        }
    })
    .then(users => {
        if(users) {
            res.json({
                count: Object.keys(users).length
            })
        } else {
            res.json({
               message: 'No pending requests' 
            })
        }
    })
    
 });

countRouter.post('/countRelationship', checkAuth.verifyToken, (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Relationship.findAll({
        where: {
            user_id_one: decoded.id,
            [Op.or]: [{ status:1 }, { status:3 }] 
        }
    })
    .then(users => {
        if(users) {
            res.json({
                count: Object.keys(users).length
            })
        } else {
            res.json({
               message: 'No mentorship relationship' 
            })
        }
    })
})


module.exports = countRouter;