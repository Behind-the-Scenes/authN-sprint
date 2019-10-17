// Imports needed - bcrypt & jsonwebtoken
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Required - users.model + secrets config
const Users = require('../users/users.model.js');
const secrets = require('../config/secrets.js');

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body; // << bring in the entire body from the req

  const hash = bcrypt.hashSync(user.password, 8) // << create a constant that will hash our password from the user

  user.password = hash; // << set the password to the hash so the DB never sees the real password

  Users.add(user)
    .then(saved => {
      res.status(200).json(saved)
    })
    .catch(err => {
      res.status(500).json({ message: "There was an error logging in." })
    })
});


router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username }) // look in our DB for the username provided from the body
    .first() // << the first one to match, unique usernames only so there are no dupes
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)) {
        // if true, create a JWT
        const token = generateToken(user);
        // add that token to response - sending back to user hashed!
        res.status(200).json({ 
          message: `Weclome ${user.username}!`,
          token,
       });
      } else {
        res.status(401).json({ message: "Invalid Credentials" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "There was an error loggin in." })
    })
});

// Create a MW function that generates a JWT

function generateToken(user) {
  // 1 Create Payload
  const payload = {
    username: user.username,
    subject: user.id
  }

  // 2 create a secret
  // const secret = 'I will change to the secrets config file soon....shhh';

  // 3 create options
  const options = {
    expiresIn: '1h', // < adds a claim of the expiration time
  }

  return (payload, secrets.jwtSecret, options)

};

module.exports = router;
