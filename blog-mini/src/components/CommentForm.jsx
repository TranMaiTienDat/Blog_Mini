import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createComment } from '../features/comments/commentsSlice'

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('http://localhost:3001/api/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: form
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed')
  const url = data.url?.startsWith('http') ? data.url : `http://localhost:3001${data.url}`
      const isImage = data.mimetype?.startsWith('image/')
      const snippet = isImage ? `![](${url})` : `[Video](${url})`
      setContent(prev => (prev ? prev + "\n" + snippet : snippet))
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      e.target.value = ''
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
      <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          Insert media
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{ display: 'none' }} />
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
