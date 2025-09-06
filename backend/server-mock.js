const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mockDb = require('./config/mockDb')

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// JWT Secret
const JWT_SECRET = 'your-super-secret-jwt-key-for-blog-platform'

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    
    const user = mockDb.findUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is valid but user not found.' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    })
  }
}

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Register request received:', req.body)
  
  try {
    const { name, email, password, dateOfBirth, gender } = req.body

    if (!name || !email || !password || !dateOfBirth || !gender) {
      console.log('❌ Missing required fields')
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, date of birth, and gender'
      })
    }

    // Validate age (must be at least 13 years old)
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      console.log('❌ User too young:', age)
      return res.status(400).json({
        success: false,
        message: 'You must be at least 13 years old to register'
      })
    }

    // Check if user exists
    const existingUser = mockDb.findUserByEmail(email)
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = mockDb.createUser({
      name,
      email,
      dateOfBirth,
      gender,
      password: hashedPassword
    })

    console.log('✅ User created successfully:', email)

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender
      }
    })
  } catch (error) {
    console.error('❌ Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find user
    const user = mockDb.findUserByEmail(email)
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('❌ User not found for email:', email)
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('🔐 Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password')
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = generateToken(user._id)
    console.log('✅ Login successful for:', email)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// POSTS ROUTES
// Get all posts
app.get('/api/posts', (req, res) => {
  try {
    const posts = mockDb.getAllPosts()
    res.json(posts)
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts'
    })
  }
})

// Get single post
app.get('/api/posts/:id', (req, res) => {
  try {
    const post = mockDb.getPostById(req.params.id)
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    res.json(post)
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post'
    })
  }
})

// Create post
app.post('/api/posts', authMiddleware, (req, res) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      })
    }

    const post = mockDb.createPost({
      title,
      content,
      author: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      },
      authorId: req.user._id
    })

    res.status(201).json(post)
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating post'
    })
  }
})

// Update post
app.put('/api/posts/:id', authMiddleware, (req, res) => {
  try {
    const { title, content } = req.body
    const post = mockDb.getPostById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    if (post.authorId !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      })
    }

    const updatedPost = mockDb.updatePost(req.params.id, { title, content })

    res.json(updatedPost)
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating post'
    })
  }
})

// Delete post
app.delete('/api/posts/:id', authMiddleware, (req, res) => {
  try {
    const post = mockDb.getPostById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    if (post.authorId !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      })
    }

    mockDb.deletePost(req.params.id)

    res.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post'
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog Platform API is running! (Mock Mode)',
    timestamp: new Date().toISOString(),
    users: mockDb.users.length,
    posts: mockDb.posts.length
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (Mock Mode)`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🧪 Test Login: admin@test.com / password123`)
})

module.exports = app
