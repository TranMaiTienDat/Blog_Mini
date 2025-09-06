import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostById, deletePost, clearCurrentPost } from '../features/posts/postsSlice'
import CommentSection from '../components/CommentSection'
import VoteButtons from '../components/VoteButtons'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentPost, isLoading, error } = useSelector((state) => state.posts)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id))
    }
    
    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(id)).unwrap()
        navigate('/')
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return <div className="loading">Loading post...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="not-found">
        <h2>Post not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{currentPost.title}</h1>
        <div className="post-meta">
          <span className="author">By {currentPost.author?.name || 'Unknown'}</span>
          <span className="date">{formatDate(currentPost.createdAt)}</span>
        </div>
      </div>
      
      <div className="post-content">
        {currentPost.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="post-vote-section">
        <VoteButtons targetType="Post" targetId={currentPost._id} />
      </div>
      
      <div className="post-actions">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
        
        {user && (user.id === currentPost.authorId || user.role === 'admin') && (
          <>
            <Link to={`/posts/${currentPost._id}/edit`} className="btn btn-primary">
              Edit Post
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Post
            </button>
          </>
        )}
      </div>
      
      <CommentSection postId={id} />
    </div>
  )
}

export default PostDetail
