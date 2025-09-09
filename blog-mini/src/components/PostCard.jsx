import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deletePost } from '../features/posts/postsSlice'
import VoteButtons from './VoteButtons'

const PostCard = ({ post }) => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post._id))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="post-card">
      <h3 className="post-title">
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h3>
      
      <p className="post-excerpt">
        {(() => {
          const content = post?.content || ''
          return content.length > 150 ? `${content.substring(0, 150)}...` : content
        })()}
      </p>
      
      <div className="post-meta">
        <span className="post-author">By {post.author?.name || 'Unknown'}</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      
      <div className="post-footer">
        <VoteButtons targetType="Post" targetId={post._id} />
        
        {user && (user.id === post.authorId || user.role === 'admin') && (
          <div className="post-actions">
            <Link to={`/posts/${post._id}/edit`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Delete
            </button>
            {user.role === 'admin' && user.id !== post.authorId && (
              <span className="admin-badge">Admin Action</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard
