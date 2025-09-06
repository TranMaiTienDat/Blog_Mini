import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../features/posts/postsSlice'
import PostCard from '../components/PostCard'

const Home = () => {
  const dispatch = useDispatch()
  const { posts, isLoading, error } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  if (isLoading) {
    return <div className="loading">Loading posts...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to BlogMini</h1>
        <p>Discover amazing stories and share your thoughts</p>
      </div>
      
      <div className="posts-section">
        <h2>Latest Posts</h2>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts available yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
