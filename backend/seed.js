require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Post = require('./models/Post')
const connectDB = require('./config/db')

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...')
    console.log('📡 MongoDB URI:', process.env.MONGODB_URI)
    
    // Connect to database
    await connectDB()
    
    // Clear existing data
    await User.deleteMany({})
    await Post.deleteMany({})
    console.log('🗑️ Cleared existing data')
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'prefer-not-to-say',
      role: 'admin',
      password: hashedPassword
    })
    
    console.log('👤 Created admin user:', adminUser.email)
    
    // Create sample user
    const sampleUserPassword = await bcrypt.hash('user123', 10)
    const sampleUser = await User.create({
      name: 'Sample User',
      email: 'user@test.com',
      dateOfBirth: new Date('1995-05-15'),
      gender: 'male',
      password: sampleUserPassword
    })
    
    console.log('👤 Created sample user:', sampleUser.email)
    
    // Create sample posts
    const posts = [
      {
        title: 'Welcome to BlogMini',
        content: 'This is the first post on our blog platform. BlogMini is a modern, feature-rich blogging platform built with React and Node.js. Feel free to explore and create your own posts!',
        author: adminUser._id,
        authorId: adminUser._id
      },
      {
        title: 'Getting Started with React',
        content: 'React is a powerful JavaScript library for building user interfaces. In this post, we\'ll explore the basics of React components, state management, and best practices for building modern web applications.',
        author: adminUser._id,
        authorId: adminUser._id
      },
      {
        title: 'MongoDB and Express.js Integration',
        content: 'Learn how to integrate MongoDB with Express.js to build robust backend APIs. We\'ll cover database connections, schema design, and CRUD operations.',
        author: sampleUser._id,
        authorId: sampleUser._id
      }
    ]
    
    const createdPosts = await Post.create(posts)
    console.log(`📝 Created ${createdPosts.length} sample posts`)
    
    console.log('✅ Database seeding completed successfully!')
    console.log('📋 Test accounts:')
    console.log('   Admin: admin@test.com / password123')
    console.log('   User:  user@test.com / user123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

// Run seeding
seedData()
