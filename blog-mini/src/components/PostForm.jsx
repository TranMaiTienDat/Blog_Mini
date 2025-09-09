import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../features/posts/postsSlice'

const PostForm = ({ post, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  tags: ''
  })
  
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.posts)
  const fileInputRef = useRef(null)
  
  useEffect(() => {
    if (post) {
      setFormData({
  title: post.title || '',
  content: post.content || '',
  tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '')
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
  await dispatch(updatePost({ id: post._id || post.id, postData: { ...formData, tags: formData.tags } })).unwrap()
      } else {
        // Create new post
  await dispatch(createPost({ ...formData, tags: formData.tags })).unwrap()
      }
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const form = new FormData()
      form.append('file', file)
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '')
  const BACKEND_ORIGIN = API_BASE.replace(/\/api$/, '')
  const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: form
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed')
  const url = data.url?.startsWith('http') ? data.url : `${BACKEND_ORIGIN}${data.url}`
      // Insert markdown for image/video
      const isImage = data.mimetype?.startsWith('image/')
      const snippet = isImage ? `![](${url})` : `[Video](${url})`
      setFormData(prev => ({ ...prev, content: prev.content ? prev.content + "\n" + snippet : snippet }))
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      e.target.value = ''
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
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. react, javascript, ui"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <div className="toolbar" style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            Insert media
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleUpload} style={{ display: 'none' }} />
        </div>
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
