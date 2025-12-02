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

// Get single poll (public)
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .then(poll => {
      if (!poll) return res.status(404).json({ msg: 'Poll not found' });
      res.json(poll);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Poll not found' });
      res.status(500).send('Server Error');
    });
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

  router.post('/:id/vote', (req, res) => {
    const { answers } = req.body; 
  
    Poll.findById(req.params.id)
      .then(poll => {
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
  
        poll.votes.push({ answers });
        return poll.save();
      })
      .then(poll => {
          // poll might be undefined if we returned 404 above, so check for headersSent
          if (!res.headersSent) res.json(poll);
      })
      .catch(err => {
        console.error(err.message);
        if (!res.headersSent) res.status(500).send('Server Error');
      });
  });
    
router.delete('/:id', auth, (req, res) => {
  Poll.findOne({ _id: req.params.id, creator: req.user.id })
    .then(poll => {
      if (!poll) {
        res.status(404).json({ msg: 'Poll not found or unauthorized' });
        return null;
      }
      return Poll.findByIdAndDelete(req.params.id);
    })
    .then(deleted => {
      if (deleted) res.json({ msg: 'Poll removed' });
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send('Server Error');
    });
});

router.put('/:id', auth, (req, res) => {
  const { title, questions } = req.body;

  Poll.findOne({ _id: req.params.id, creator: req.user.id })
    .then(poll => {
      if (!poll) {
        res.status(404).json({ msg: 'Poll not found or unauthorized' });
        return null;
      }
      poll.title = title;
      poll.questions = questions;
      return poll.save();
    })
    .then(updatedPoll => {
      if (updatedPoll) res.json(updatedPoll);
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send('Server Error');
    });
  });

module.exports = router;