const router = require('express').Router();
const auth = require('../middleware/auth');
const Poll = require('../models/Poll');

// Get authenticated user's polls
router.get('/mine', auth, (req, res) => {
  Poll.find({ creator: req.user.id })
    .sort({ createdAt: -1 })
    .then(polls => res.json(polls))
    .catch(err => res.status(500).send('Server Error'));
});

module.exports = router;