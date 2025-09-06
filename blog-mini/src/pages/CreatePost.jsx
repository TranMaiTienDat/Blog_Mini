import { useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm'

const CreatePost = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/')
  }

  return (
    <div className="create-post">
      <div className="page-header">
        <h1>Create New Post</h1>
        <p>Share your thoughts with the community</p>
      </div>
      
      <div className="form-container">
        <PostForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default CreatePost
