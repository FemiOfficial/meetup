const express = require("express");
const Sequelize = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Op = Sequelize.Op;

const userRouter = express.Router();

const cors = require("cors");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const User = require("../models/User");
const Relationship = require("../models/Relationship");

User.hasMany(Relationship, {foreignKey: 'id'})
Relationship.belongsTo(User, {foreignKey: 'user_id_two'})

const checkAuth = require("../middlewares/checkAuth");

//const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, './uploads/'));
    },
    filename: (req, file, cb) => {
      let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

      
      cb(null, decoded.id + '.png');
    }
});
let upload = multer({storage: storage});

userRouter.use(cors());

//REGISTER

userRouter.post('/register', (req, res) => {
    const today = new Date();

    const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        password : req.body.password,
        role : req.body.role,
        created : today
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            const hash = bcrypt.hashSync(userData.password, 10)
            userData.password = hash;
            userData.loggedIn = 'online';
            User.create(userData)
            .then(user => {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: '24h'
                })
                res.json({
                    token
                })
            })
            .catch(err => {
                res.send(`error ${err}`)
             })
        } else {
            res.json( {error: 'User already exists'})
        }
    })
    .catch(err => {
        res.send(`error: ${err}`)
    })
})

userRouter.post('/login', (req, res) => {
    console.log(req.body.password);
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user){
            res.status(404).json({error: 'This email does not exist on meetupcareers'})
        } else {

            if(bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues,
                    process.env.SECRET_KEY, {
                        expiresIn: '24h'
                    })
               user.update({loggedIn: "online"})
                res.json({ token })
            } else {
                res.status(404).json({error: 'Invalid Username or password'})
            }

        }
 
    })
    .catch(err => {
        res.send(`error: ${err}`)
    })
})

userRouter.post('/forgotPassword', (req, res) => {
    let token = Buffer.from(crypto.randomBytes(20), 'hex').toString('hex');
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then( user => {
        if(!user) {
            res.status(404).send('user not found');
        } else {

            user.update({
                resetpassword_token: token,
                resetpassword_expirydate: Date.now + 3600000
          })
        
          const smtptransport = nodemailer.createTransport({
              service: 'GMAIL',
              auth: {
                  user: 'mariecrown95@gmail.com',
                  pass: 'rartyt2018'
              }
          });
    
          let mailOptions = {
              to: user.email,
              from: 'info@meetupcareers.com',
              subject: 'Meetup Careers Password Reset',
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          }
    
          smtptransport.sendMail(mailOptions, function(err) {
            res.send('An e-mail has been sent to ' + user.email + ' with further instructions.');
          });
    

        }

    })
})



userRouter.post('/logout', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    User.findOne({
        where: {
            id: decoded.id
        }
    })
    .then( user => {
        user.update({loggedIn: "offline"})
        res.json({user})
    })
});
//PROFILE
userRouter.post('/profile', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    User.findOne({
        where: {
            id: decoded.id
        }
    })
        .then(user => {
            if(user) {
                res.send(user)
            } else {
                res.json({error: 'User does not exist'})
            }
        })
        .catch(err => {
            res.send(`error ${err}`)
        })
})

userRouter.post('/updateProfile', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    console.log(req.body)
    User.update(
        req.body, 
        { where: { id: decoded.id }
    })
    .then( user => [
        res.json({user})
    ])
    .catch(err => {
        res.send(`error ${err}`)
    })

})

userRouter.post('/bio/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(user => {
            if(user) {
                res.send(user)
            } else {
                res.json({error: 'User does not exist'})
            }
        })
        .catch(err => {
            res.send(`error ${err}`)
        })
    
});


userRouter.post('/sendRequest/:id', checkAuth.verifyToken, (req, res) => {

    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    if(decoded.id == req.params.id) {
        res.json({
            error: "cannot send a mentorship request to self"
        })
    } 
    else {

        let userData = {
            user_id_one: decoded.id,
            user_id_two: req.params.id,
            // 0: pending, 1: accepted, 2: declined, 3: blocked 
            status: 0,
            //id of the user sending the request
            action_user_id: decoded.id
        }

        Relationship.findOne(
            {
               where: {
                   user_id_one: decoded.id,
                   user_id_two: userData.user_id_two,
                   status: userData.status
               } 
            }
        )
        .then(user => {
            if(user){
                res.json({
                    error: 'request cannot be sent twice'
                })
            } else {

                Relationship.create(userData)
                .then(user => {
                    res.json({
                        message: 'request sent'
                    })
                })
                .catch(err => {
                    res.send(`error ${err}`)
                    })

            }

        })
        .catch(err => {
            res.send(`error ${err}`)
        })
        
    }
    
});

userRouter.post('/respondRequest', checkAuth.verifyToken, (req, res) => {
    
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    console.group(req.body)
    Relationship.findOne({
        where: {
            user_id_one: decoded.id,
            user_id_two: req.body.response.requestID          
        }
    })
    .then( request => {
        if(request) {
            request.update({status: req.body.response.status})
            res.json({request, message: 'request accepted'})
        }
    })
    .catch(err => {
        res.send(`error ${err}`)
    })

})

userRouter.post('/pendingRequest', checkAuth.verifyToken, (req, res) => {

    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    var userData = [];

    var data;

    Relationship.findAll({
        include: [{
            model: User,
            required: true
           }],
        where: {
            user_id_one: decoded.id,
            status: 0
        }
    })
    .then(users => {

        if(users) {

            res.json({
                users
            })
        } else {
            res.json({
               message: 'No pending requests' 
            })
        }
    })
})

userRouter.post('/relationships', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Relationship.findAll({
        include: [{
            model: User,
            required: true
        }],
        where: {
            user_id_one: decoded.id,
            [Op.or]: [{ status:1 }, { status:3 }] 
        }
    })
    .then(users => {
        if(users) {
            res.json({
                users
            })
        } else {
            res.json({
                message: 'No mentorship relationship' 
            })
        }
    })
})

userRouter.post('/checkRelationship/:id', (req, res) => {
    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    Relationship.findOne({
        where: {
            user_id_one: decoded.id,
            user_id_two: req.params.id
        }
    })
    .then(user => {
        if(user) {
            res.send(true)
        } else {
            res.send(false)
        }
    })


});

userRouter.post('/findMentee', (req, res) => {

    let searchData = {};

    searchData.name = req.body.search.name ? req.body.search.name : '';
    searchData.category = req.body.search.category ? req.body.search.category : '';
    searchData.field = req.body.search.field ? req.body.search.field : '';


    console.log(req.body)
    
    User.findAll({
        where: {
            [Op.or]: [
                {firstname: searchData.name},
                {lastname: searchData.name},
                {category: searchData.category},
                {field: searchData.field}
             ],
             role: 'mentee'
        }
    })
    .then(mentees => {
        res.json({mentees})
    })
    .catch(err => {
        res.send(err)
    })

});

userRouter.post('/mentees', (req, res) => {
    
    User.findAll({
        where: {
             role: 'mentee'
        }
    })
    .then(mentees => {
        res.json({mentees})
    })
    .catch(err => {
        res.send(err)
    })

});

userRouter.post('/findMentor', (req, res) => {

    let searchData = {};

    searchData.name = req.body.search.name ? req.body.search.name : '';
    searchData.category = req.body.search.category ? req.body.search.category : '';
    searchData.field = req.body.search.field ? req.body.search.field : '';


    console.log(req.body)
    
    User.findAll({
        where: {
            [Op.or]: [
                {firstname: searchData.name},
                {lastname: searchData.name},
                {category: searchData.category},
                {field: searchData.field}
             ],
             role: 'mentor'
        }
    })
    .then(mentees => {
        res.json({mentees})
    })
    .catch(err => {
        res.send(err)
    })

});

userRouter.post('/mentors', (req, res) => {
    
    User.findAll({
        where: {
             role: 'mentor'
        }
    })
    .then(mentees => {
        res.json({mentees})
    })
    .catch(err => {
        res.send(err)
    })

});

userRouter.post('/upload',upload.single('photo'), (req, res) => {
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

userRouter.post('/getprofilepic/:id', (req, res) => {

    if(fs.existsSync(path.join(__dirname,`./uploads/${req.params.id}.png`))) {
       res.sendFile(path.join(__dirname,`./uploads/${req.params.id}.png`))
    } else {
        res.sendFile(path.join(__dirname,`./uploads/icon.png`)) 
    }

})
module.exports = userRouter;