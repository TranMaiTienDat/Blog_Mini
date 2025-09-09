import React from 'react';
import { Link } from 'react-router-dom';

const AuthLanding = () => {
  return (
    <div className="auth-landing">
      <div className="landing-container">
        <div className="landing-header">
          <h1>Welcome to Blog Mini</h1>
          <p>Share your thoughts, connect with others, and discover amazing content</p>
        </div>

        <div className="landing-features">
          <div className="feature-card">
            <h3>Write & Share</h3>
            <p>Create beautiful blog posts and share your ideas with the community</p>
          </div>
          
          <div className="feature-card">
            <h3>Engage & Comment</h3>
            <p>Join conversations, leave comments, and connect with like-minded people</p>
          </div>
          
          <div className="feature-card">
            <h3>Vote & Appreciate</h3>
            <p>Show your appreciation for great content with our voting system</p>
          </div>
        </div>

        <div className="landing-actions">
          <h2>Get Started Today</h2>
          <p>Join our community and start sharing your story</p>
          
          <div className="auth-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              Sign In
            </Link>
          </div>
        </div>

        <div className="landing-stats">
          <div className="stat-item">
            <h4>Modern Platform</h4>
            <p>Built with latest technologies</p>
          </div>
          <div className="stat-item">
            <h4>Secure & Safe</h4>
            <p>Your data is protected</p>
          </div>
          <div className="stat-item">
            <h4>User Friendly</h4>
            <p>Easy to use interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;
