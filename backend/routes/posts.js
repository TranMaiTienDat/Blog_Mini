const express = require('express')
const Post = require('../models/Post')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email')

    res.json({
      success: true,
      count: posts.length,
      data: posts
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts'
    })
  }
})

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    res.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Get post error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching post'
    })
  }
})

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      })
    }

    // Create post
    const post = new Post({
      title,
      content,
      author: req.user._id,
      authorId: req.user._id
    })

    await post.save()
    
    // Populate author info
    await post.populate('author', 'name email')

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    })
  } catch (error) {
    console.error('Create post error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating post'
    })
  }
})

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body

    let post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user owns the post or is admin
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      })
    }

    // Update post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    ).populate('author', 'name email')

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    })
  } catch (error) {
    console.error('Update post error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating post'
    })
  }
})

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user owns the post or is admin
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting post'
    })
  }
})

module.exports = router
