const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // Kết nối MongoDB - có thể dùng local hoặc MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

module.exports = connectDB
