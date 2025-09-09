const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Import routes
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')
const voteRoutes = require('./routes/votes')
const adminRoutes = require('./routes/admin')
const mediaRoutes = require('./routes/media')

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
// Configure CORS for local dev and GitHub Pages (and allow override via env)
const defaultOrigins = ['http://localhost:5173', 'https://tranmaitiendat.github.io']
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
const origins = allowedOrigins.length ? allowedOrigins : defaultOrigins

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true)
    if (origins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
// Serve uploaded media files
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/media', mediaRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog Platform API is running!',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error)
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
