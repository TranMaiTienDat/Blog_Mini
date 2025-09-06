const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['Post', 'Comment']
  },
  voteType: {
    type: String,
    required: true,
    enum: ['upvote', 'downvote']
  }
}, {
  timestamps: true
})

// Compound index to ensure one vote per user per target
voteSchema.index({ user: 1, target: 1, targetType: 1 }, { unique: true })

// Index for better query performance
voteSchema.index({ target: 1, targetType: 1 })

module.exports = mongoose.model('Vote', voteSchema)
