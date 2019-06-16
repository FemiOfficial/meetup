const jwt = require("jsonwebtoken");

const CheckAuth = {};

CheckAuth.verifyToken = (req, res, next) => {
  const authToken = req.body.token || req.query.token || 
  req.headers['x-access-token'] || 
  req.headers.Authorization || req.headers.authorization;

  let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)


  const expired = decoded.exp < Date.now() /1000 ? true : false

  if (authToken && !expired) {
      next();
  } else {
    return res.status(401).json({ error: 'no token provided' });
  }
};

module.exports = CheckAuth;
