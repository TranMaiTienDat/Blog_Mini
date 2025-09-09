const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')

const router = express.Router()

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/', 'video/']
  if (allowed.some(prefix => file.mimetype.startsWith(prefix))) {
    cb(null, true)
  } else {
    cb(new Error('Only images and videos are allowed'))
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 25 * 1024 * 1024 } })

// POST /api/media/upload
router.post('/upload', auth, upload.single('file'), (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }
  const publicUrl = `/uploads/${file.filename}`
  res.status(201).json({ success: true, url: publicUrl, filename: file.filename, mimetype: file.mimetype, size: file.size })
})

module.exports = router
