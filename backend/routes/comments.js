const express = require('express')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/comments/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name role')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: comments.length,
      data: comments
    })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    })
  }
})

// @route   POST /api/comments/:postId
// @desc    Create new comment on a post
// @access  Private
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      })
    }

    // Check if post exists
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Create comment
    const comment = new Comment({
      content: content.trim(),
      author: req.user._id,
      post: req.params.postId
    })

    await comment.save()
    
    // Populate author info
    await comment.populate('author', 'name role')

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment
    })
  } catch (error) {
    console.error('Create comment error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating comment'
    })
  }
})

// @route   PUT /api/comments/comment/:commentId
// @desc    Update comment
// @access  Private
router.put('/comment/:commentId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      })
    }

    let comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      })
    }

    // Update comment
    comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: content.trim() },
      { new: true, runValidators: true }
    ).populate('author', 'name role')

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    })
  } catch (error) {
    console.error('Update comment error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating comment'
    })
  }
})

// @route   DELETE /api/comments/comment/:commentId
// @desc    Delete comment
// @access  Private
router.delete('/comment/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      })
    }

    await Comment.findByIdAndDelete(req.params.commentId)

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    })
  }
})

module.exports = router
