import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification, reload } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check verification status periodically
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.emailVerified) {
      navigate('/');
      return;
    }

    // Check every 3 seconds if email has been verified
    const interval = setInterval(async () => {
      try {
        await reload(user); // Refresh the user's token
        if (user.emailVerified) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We sent a verification email to {user.email}
          </p>
        </div>

        <div className="rounded-md bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6">
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          {message && (
            <div className="text-green-600 dark:text-green-400 text-sm text-center">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log out
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Please click the link in the verification email to continue.
            If you don't see it, check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
} 