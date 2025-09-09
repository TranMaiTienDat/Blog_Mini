import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import EmailVerification from '../components/EmailVerification';

const VerificationPending = ({ email, onBackToLogin }) => {
  const { isLoading } = useSelector((state) => state.auth);

  const handleVerificationSuccess = () => {
    window.location.href = '/'; // Navigate to home after verification
  };

  return (
    <div className="verification-pending-container">
      <EmailVerification 
        email={email} 
        onVerificationSuccess={handleVerificationSuccess}
      />
      <div className="back-to-login">
        <button 
          onClick={onBackToLogin}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerificationPending;
