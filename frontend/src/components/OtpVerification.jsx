import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OtpVerification.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [canResendOTP, setCanResendOTP] = useState(false);

  const { verifyOTP, resendOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendOTP(true);
    }
  }, [timeLeft]);

  // Get email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email in URL, redirect to register
      navigate('/register');
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(email, otp);
      setSuccess('Email verified successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await resendOTP(email);
      setSuccess('OTP resent successfully! Check your email.');
      setTimeLeft(900); // Reset timer
      setCanResendOTP(false);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-card">
        <h2>Email Verification</h2>
        <p className="otp-instruction">
          We've sent a 6-digit verification code to:
          <br />
          <strong>{email}</strong>
        </p>
        <p className="otp-instruction">
          Please enter the code below to verify your email address.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="form-group">
            <label htmlFor="otp">Verification Code:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
              className="otp-input"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="verify-btn"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="otp-timer">
          {!canResendOTP ? (
            <p>Code expires in: <span className="timer">{formatTime(timeLeft)}</span></p>
          ) : (
            <p className="expired">Code has expired</p>
          )}
        </div>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={isLoading || !canResendOTP}
            className="resend-btn"
          >
            {isLoading ? 'Resending...' : 'Resend Code'}
          </button>
        </div>

        <div className="back-to-login">
          <button
            onClick={() => navigate('/login')}
            className="back-btn"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
