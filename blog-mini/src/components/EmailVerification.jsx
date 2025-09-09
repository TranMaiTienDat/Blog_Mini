import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendVerification, clearError } from '../features/auth/authSlice';

const EmailVerification = ({ email, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Cleanup function
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      await dispatch(verifyEmail({ email, verificationCode })).unwrap();
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      await dispatch(resendVerification({ email })).unwrap();
      setCountdown(60); // 60 seconds countdown
      alert('Verification code sent successfully!');
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  const handleTestVerify = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/test-verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      } else {
        alert(data.message || 'Test verification failed');
      }
    } catch (error) {
      console.error('Test verification failed:', error);
      alert('Test verification failed');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <h2>📧 Verify Your Email</h2>
          <p>We've sent a verification code to:</p>
          <strong className="email-display">{email}</strong>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyEmail} className="verification-form">
          <div className="form-group">
            <label htmlFor="verificationCode">Enter 6-digit verification code:</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              placeholder="000000"
              maxLength={6}
              className="verification-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-verify"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="verification-actions">
          <p>Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            className="btn btn-outline btn-resend"
            disabled={countdown > 0 || isLoading}
          >
            {countdown > 0 
              ? `Resend in ${formatTime(countdown)}` 
              : 'Resend Code'
            }
          </button>
          
          {/* Test button for development */}
          <button
            type="button"
            onClick={handleTestVerify}
            className="btn btn-warning btn-test"
            disabled={isLoading}
            style={{ marginTop: '1rem' }}
          >
            🧪 Test Verify (Dev Only)
          </button>
        </div>

        <div className="verification-info">
          <div className="info-item">
            <span className="info-icon">⏰</span>
            <span>Code expires in 15 minutes</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span>Keep this code private</span>
          </div>
          <div className="info-item">
            <span className="info-icon">📱</span>
            <span>Check your spam folder if needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
