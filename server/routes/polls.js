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

router.post('/', auth, (req, res) => {
    const { title, questions } = req.body;
  
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ msg: 'Please include a title and at least one question.' });
    }
  
    const newPoll = new Poll({
      title,
      questions,
      creator: req.user.id
    });
  
    newPoll.save()
      .then(poll => res.json(poll))
      .catch(err => {
        console.error(err.message);
        res.status(500).send('Server Error');
      });
  });

module.exports = router;