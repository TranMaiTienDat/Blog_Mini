import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComments, clearComments } from '../features/comments/commentsSlice'
import Comment from './Comment'
import CommentForm from './CommentForm'

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch()
  const { comments, isLoading, error } = useSelector((state) => state.comments)

  useEffect(() => {
    if (postId) {
      dispatch(fetchComments(postId))
    }
    
    return () => {
      dispatch(clearComments())
    }
  }, [dispatch, postId])

  if (isLoading) {
    return <div className="comments-loading">Loading comments...</div>
  }

  return (
    <div className="comment-section">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>
      
      {error && (
        <div className="comments-error">
          Error loading comments: {error}
        </div>
      )}
      
      <CommentForm postId={postId} />
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
