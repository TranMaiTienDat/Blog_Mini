const express = require('express')
const User = require('../models/User')
const Post = require('../models/Post')
const Vote = require('../models/Vote')
const auth = require('../middleware/auth')

const router = express.Router()

// Simple role guard
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' })
  }
  next()
}

// GET /api/admin/analytics
router.get('/analytics', auth, requireAdmin, async (req, res) => {
  try {
    const [postCount, userCount, votesAgg, tagsAgg] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
      Vote.aggregate([
        { $group: { _id: null, totalUpvotes: { $sum: { $cond: [{ $eq: ['$voteType', 'upvote'] }, 1, 0] } }, totalDownvotes: { $sum: { $cond: [{ $eq: ['$voteType', 'downvote'] }, 1, 0] } } } },
        { $project: { _id: 0, totalUpvotes: 1, totalDownvotes: 1, avgScore: { $subtract: ['$totalUpvotes', '$totalDownvotes'] } } }
      ]),
      Post.aggregate([
        { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ])

    const votes = votesAgg[0] || { totalUpvotes: 0, totalDownvotes: 0, avgScore: 0 }

    res.json({
      success: true,
      data: {
        postCount,
        userCount,
        likes: votes.totalUpvotes,
        dislikes: votes.totalDownvotes,
        avgScore: votes.avgScore,
        topTags: tagsAgg.map(t => ({ tag: t._id, count: t.count }))
      }
    })
  } catch (err) {
    console.error('Analytics error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' })
  }
})

module.exports = router
