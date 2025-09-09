const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService')

const router = express.Router()

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  )
}

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, dateOfBirth, gender, password } = req.body

    // Validate input
    if (!name || !username || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, username, email, password, date of birth, and gender'
      })
    }

    // Check if user exists with email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      })
    }

    // Create user (chưa xác nhận email)
    const user = new User({ name, username, email, dateOfBirth, gender, password })
    
    // Tạo mã xác nhận email
    const verificationCode = user.generateEmailVerificationCode()
    await user.save()

    // Gửi email xác nhận
    const emailResult = await sendVerificationEmail(email, username, verificationCode)
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Vẫn cho phép đăng ký thành công nhưng thông báo lỗi email
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      requiresVerification: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
})

// @route   POST /api/auth/verify-email
// @desc    Verify email with code
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body

    // Validate input
    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and verification code'
      })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Verify code
    if (!user.verifyEmailCode(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      })
    }

    // Update user as verified
    user.isEmailVerified = true
    user.emailVerificationCode = null
    user.emailVerificationExpires = null
    await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username)

  // Update last login timestamp
  user.lastLogin = new Date()
  await user.save()

  // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin
      }
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    })
  }
})

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Generate new verification code
    const verificationCode = user.generateEmailVerificationCode()
    await user.save()

    // Send verification email
    const emailResult = await sendVerificationEmail(email, user.username, verificationCode)
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      })
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/auth/test-verify-email (CHỈ DÙNG CHO DEV)
// @desc    Test email verification without sending email
// @access  Public
router.post('/test-verify-email', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      })
    }

    // Tự động verify user (chỉ cho development)
    user.isEmailVerified = true
    user.emailVerificationCode = null
    user.emailVerificationExpires = null
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Email verified successfully (Test mode)',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Test verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during test verification'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
  const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Normalize login identifier and allow username or email
    const loginId = (email || '').trim()
    const query = loginId.includes('@')
      ? { email: loginId.toLowerCase() }
      : { username: loginId }

    // Find user
    const user = await User.findOne(query).select('+password')
    if (process.env.NODE_ENV !== 'production') {
      console.log('[LOGIN] id:', loginId, '| query:', query, '| found:', !!user)
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[LOGIN] password valid:', isPasswordValid)
    }
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Bỏ phần kiểm tra email verification - cho phép login mà không cần verify email
    // if (!user.isEmailVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Please verify your email before logging in',
    //     requiresVerification: true,
    //     email: user.email
    //   })
    // }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        bio: req.user.bio,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, bio, currentPassword, newPassword } = req.body
    const userId = req.user._id

    // Tìm user hiện tại
    const user = await User.findById(userId).select('+password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Nếu đổi mật khẩu
    if (currentPassword && newPassword) {
      // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      // Validate mật khẩu mới
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        })
      }

      user.password = newPassword
    }

    // Cập nhật thông tin profile
    if (username !== undefined) {
      // Kiểm tra username đã tồn tại chưa
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        })
      }
      user.username = username
    }

    if (email !== undefined) {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        })
      }
      user.email = email
    }

    if (bio !== undefined) {
      user.bio = bio
    }

    // Lưu user
    await user.save()

    // Trả về user đã cập nhật (không có password)
    const updatedUser = await User.findById(userId)
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    })
  }
})

// @route   GET /api/auth/debug-user/:email (CHỈ DÙNG CHO DEV)
// @desc    Debug user information
// @access  Public
router.get('/debug-user/:email', async (req, res) => {
  try {
    const { email } = req.params
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found',
        email: email
      })
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        hasPassword: !!user.password
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

module.exports = router
