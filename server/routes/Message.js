const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const messageRouter = express.Router();

const cors = require("cors");

const jwt = require("jsonwebtoken");

const Relationship = require("../models/Relationship");
const User = require("../models/User");
const Message = require("../models/Messages");
const checkAuth = require("../middlewares/checkAuth");


User.hasMany(Message, {foreignKey: 'id'})
Message.belongsTo(User, {foreignKey: 'sender'})


messageRouter.use(cors());

process.env.SECRET_KEY = "secret"

messageRouter.post("/sendMessage", checkAuth.verifyToken, (req, res) => {

    console.log(req.body)
    
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    let messageData = {
        sender: decoded.id,
        recipient: req.body.message.recipient,
        message: req.body.message.message,
    }

    // check if a relationship exist (accepted)

    Relationship.findAll({
        where: {
            user_id_one: decoded.id,
            user_id_two: messageData.recipient,
            status: 1
        }
    })
    .then(exist => {
        if(exist.length === 0){
            res.json({
                message: 'no relationship with this user'
            })

        } else {

            Message.create(messageData)
            .then(message => {
                res.json({
                    messageData
                })
            })
            .catch(err => {
                res.send(`error ${err}`);
            })

        }

    })
    .catch(err => {
        res.send(err)
    })

});

messageRouter.post("/allmessages", checkAuth.verifyToken, (req, res) => {

    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    Message.findAll({
        include: [{
            model: User,
            required: true
        }],
        where: {
            recipient: decoded.id
        }
    })
    .then(message => {
        res.json({message})
    })
    .catch( err => {
        res.json(err)
    })

})



module.exports = messageRouter;
