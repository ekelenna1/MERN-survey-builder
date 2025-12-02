const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  expiresAt: { type: Date },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    text: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['multiple-choice', 'checkbox', 'text', 'scale', 'ranked']
    },
    options: [String]
  }],
  votes: [{
    submittedAt: { type: Date, default: Date.now },
    answers: [{
      questionIndex: Number,
      response: mongoose.Schema.Types.Mixed
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);