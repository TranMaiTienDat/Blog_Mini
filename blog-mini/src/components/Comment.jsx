import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateComment, deleteComment } from '../features/comments/commentsSlice'
import VoteButtons from './VoteButtons'

const Comment = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEdit = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false)
      return
    }

    if (editContent.trim().length === 0) {
      alert('Comment cannot be empty!')
      return
    }

    try {
      await dispatch(updateComment({ 
        commentId: comment._id, 
        content: editContent.trim() 
      })).unwrap()
      setIsEditing(false)
    } catch (error) {
      alert('Failed to update comment: ' + error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap()
      } catch (error) {
        alert('Failed to delete comment: ' + error)
      }
    }
  }

  const canModify = user && (user.id === comment.author._id || user.role === 'admin')

  const renderContent = (text) => {
    // Very basic markdown rendering for images and links
    // Replace ![](url) with <img>
    const parts = text.split(/\n+/)
    return parts.map((line, idx) => {
      // Image pattern
      const imgMatch = line.match(/^!\[\]\(([^)]+)\)$/)
      if (imgMatch) {
        const src = imgMatch[1]
        return <div key={idx}><img src={src} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} /></div>
      }
      // Link pattern [Text](url)
      const linkMatch = line.match(/^\[([^\]]*)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const text = linkMatch[1]
        const href = linkMatch[2]
        return <p key={idx}><a href={href} target="_blank" rel="noreferrer">{text || href}</a></p>
      }
      return <p key={idx}>{line}</p>
    })
  }

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-author">
          <strong>{comment.author.name}</strong>
          {comment.author.role === 'admin' && (
            <span className="admin-badge-comment">ADMIN</span>
          )}
        </div>
        <div className="comment-date">{formatDate(comment.createdAt)}</div>
      </div>
      
      <div className="comment-content">
        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength="500"
              placeholder="Write your comment..."
              rows="3"
            />
            <div className="comment-edit-actions">
              <button onClick={handleEdit} className="btn btn-primary btn-sm">
                Save
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                }} 
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>{renderContent(comment.content)}</div>
        )}
      </div>
      
      <div className="comment-footer">
        <VoteButtons targetType="Comment" targetId={comment._id} />
        
        {canModify && !isEditing && (
          <div className="comment-actions">
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-edit btn-sm"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="btn btn-delete btn-sm"
            >
              Delete
            </button>
            {user.role === 'admin' && user.id !== comment.author._id && (
              <span className="admin-badge">Admin Action</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment
