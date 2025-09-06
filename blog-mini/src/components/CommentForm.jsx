import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createComment } from '../features/comments/commentsSlice'

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Please enter a comment!')
      return
    }

    if (content.trim().length > 500) {
      alert('Comment cannot exceed 500 characters!')
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createComment({ 
        postId, 
        content: content.trim() 
      })).unwrap()
      setContent('')
    } catch (error) {
      alert('Failed to post comment: ' + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="comment-form-login">
        <p>Please <a href="/login">login</a> to leave a comment.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="comment-form-header">
        <strong>Leave a comment as {user?.name}</strong>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        maxLength="500"
        rows="4"
        disabled={isSubmitting}
        required
      />
      <div className="comment-form-footer">
        <div className="character-count">
          {content.length}/500 characters
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
