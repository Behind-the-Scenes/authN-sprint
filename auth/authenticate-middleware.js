/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

// Imports needed - jwt and secrets config
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {
  // 1 create token for headers.auth
  const token = req.headers.authorization; // < client sends here or we send in header of insomnia

  if(token) {
    // check validity of token
    // async needs a cb function

    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        // foul play with our token
        res.status(401).json({ you: 'shall not pass!' });
      } else {
        // safe token
        res.username = decodedToken.username;
        next();
      }
    })
  } else {
    res.status(400).json({ message: "Please provide credentials." })
  }
};
