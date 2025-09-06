import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../features/posts/postsSlice'

const PostForm = ({ post, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.posts)
  
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
      })
    }
  }, [post])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (post) {
        // Update existing post
        await dispatch(updatePost({ id: post.id, postData: formData })).unwrap()
      } else {
        // Create new post
        await dispatch(createPost(formData)).unwrap()
      }
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter post title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          placeholder="Write your post content here..."
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={isLoading} className="btn btn-primary">
        {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
      </button>
    </form>
  )
}

export default PostForm
