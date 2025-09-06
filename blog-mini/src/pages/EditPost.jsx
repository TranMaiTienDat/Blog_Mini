import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostById, clearCurrentPost } from '../features/posts/postsSlice'
import PostForm from '../components/PostForm'

const EditPost = () => {
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

  const handleSuccess = () => {
    navigate(`/posts/${id}`)
  }

  // Check if user is authorized to edit this post
  if (currentPost && user && user.id !== currentPost.authorId && user.role !== 'admin') {
    return (
      <div className="unauthorized">
        <h2>Unauthorized</h2>
        <p>You can only edit your own posts.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <div className="loading">Loading post...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="not-found">
        <h2>Post not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="edit-post">
      <div className="page-header">
        <h1>Edit Post</h1>
        <p>Update your post content</p>
      </div>
      
      <div className="form-container">
        <PostForm post={currentPost} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default EditPost
