const express = require('express')
const Vote = require('../models/Vote')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/votes/:targetType/:targetId/:voteType
// @desc    Vote on a post or comment (upvote/downvote)
// @access  Private
router.post('/:targetType/:targetId/:voteType', authMiddleware, async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.params

    // Validate parameters
    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type. Must be Post or Comment'
      })
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be upvote or downvote'
      })
    }

    // Check if target exists
    const Model = targetType === 'Post' ? Post : Comment
    const target = await Model.findById(targetId)
    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`
      })
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user._id,
      target: targetId,
      targetType
    })

    let oldVoteType = null
    if (existingVote) {
      oldVoteType = existingVote.voteType
      
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType) {
        await Vote.findByIdAndDelete(existingVote._id)
        
        // Update target vote count
        if (voteType === 'upvote') {
          target.upvotes = Math.max(0, target.upvotes - 1)
        } else {
          target.downvotes = Math.max(0, target.downvotes - 1)
        }
        await target.save()

        return res.json({
          success: true,
          message: 'Vote removed',
          voteRemoved: true,
          upvotes: target.upvotes,
          downvotes: target.downvotes
        })
      } else {
        // Change vote type
        existingVote.voteType = voteType
        await existingVote.save()
      }
    } else {
      // Create new vote
      await Vote.create({
        user: req.user._id,
        target: targetId,
        targetType,
        voteType
      })
    }

    // Update target vote counts
    if (oldVoteType && oldVoteType !== voteType) {
      // Changing from one vote type to another
      if (oldVoteType === 'upvote') {
        target.upvotes = Math.max(0, target.upvotes - 1)
        target.downvotes += 1
      } else {
        target.downvotes = Math.max(0, target.downvotes - 1)
        target.upvotes += 1
      }
    } else {
      // New vote
      if (voteType === 'upvote') {
        target.upvotes += 1
      } else {
        target.downvotes += 1
      }
    }

    await target.save()

    res.json({
      success: true,
      message: `${voteType} added successfully`,
      voteType,
      upvotes: target.upvotes,
      downvotes: target.downvotes
    })
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while processing vote'
    })
  }
})

// @route   GET /api/votes/:targetType/:targetId/user-vote
// @desc    Get current user's vote on a target
// @access  Private
router.get('/:targetType/:targetId/user-vote', authMiddleware, async (req, res) => {
  try {
    const { targetType, targetId } = req.params

    const vote = await Vote.findOne({
      user: req.user._id,
      target: targetId,
      targetType
    })

    res.json({
      success: true,
      userVote: vote ? vote.voteType : null
    })
  } catch (error) {
    console.error('Get user vote error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user vote'
    })
  }
})

// @route   GET /api/votes/:targetType/:targetId/counts
// @desc    Get vote counts for a target
// @access  Public
router.get('/:targetType/:targetId/counts', async (req, res) => {
  try {
    const { targetType, targetId } = req.params

    // Validate parameters
    if (!['Post', 'Comment'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      })
    }

    const Model = targetType === 'Post' ? Post : Comment
    const target = await Model.findById(targetId)
    
    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`
      })
    }

    res.json({
      success: true,
      upvotes: target.upvotes || 0,
      downvotes: target.downvotes || 0
    })
  } catch (error) {
    console.error('Get vote counts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vote counts'
    })
  }
})

module.exports = router
