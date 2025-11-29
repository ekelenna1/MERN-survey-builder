const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Missing fields' });
  }

  User.findOne({ username })
    .then(existingUser => {
      if (existingUser) {
        res.status(400).json({ msg: 'User already exists' });
        return null;
      }

      const user = new User({ username, password });
      
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          user.password = hash;
          return user.save();
        });
    })
    .then(user => {
      if (!user) return; // Already handled error state

      jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, username: user.username } });
        }
      );
    })
    .catch(err => res.status(500).send(err.message));
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.status(400).json({ msg: 'Invalid credentials' });
          return null;
        }
  
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              res.status(400).json({ msg: 'Invalid credentials' });
              return null;
            }
            return user;
          });
      })
      .then(user => {
        if (!user) return; // Handled error state
  
        jwt.sign(
          { user: { id: user.id } },
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username } });
          }
        );
      })
      .catch(err => res.status(500).send(err.message));
  });
  
  module.exports = router;