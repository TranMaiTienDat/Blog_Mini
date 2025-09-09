import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearError } from '../features/auth/authSlice'
import EmailVerification from '../components/EmailVerification'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })
  
  const [showVerification, setShowVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    
    return () => {
      dispatch(clearError())
    }
  }, [isAuthenticated, navigate, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Xóa validation error khi user thay đổi input
    if (validationError) {
      setValidationError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous validation errors
    setValidationError('')
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match!')
      return
    }
    
    const { confirmPassword, ...userData } = formData
    
    // Validate date of birth (must be at least 13 years old)
    const today = new Date()
    const birthDate = new Date(formData.dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      setValidationError('You must be at least 13 years old to register!')
      return
    }
    
    try {
      const result = await dispatch(registerUser(userData)).unwrap()
      if (result.requiresVerification) {
        setRegisteredEmail(formData.email)
        setShowVerification(true)
      }
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  const handleVerificationSuccess = () => {
    setShowVerification(false)
    navigate('/')
  }

  if (showVerification) {
    return (
      <EmailVerification 
        email={registeredEmail} 
        onVerificationSuccess={handleVerificationSuccess}
      />
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              minLength={3}
              maxLength={30}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]} // Không cho phép chọn ngày trong tương lai
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="6"
            />
          </div>
          
          {validationError && <div className="error-message">{validationError}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
