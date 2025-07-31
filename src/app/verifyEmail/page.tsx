'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/NavBar';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  const handleResendVerification = async () => {
    const email = prompt('Please enter your email address to resend verification:');
    if (!email) return;

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resendVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      alert(response.ok ? data.message : data.message);
    } catch (error) {
      alert('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-400 mb-2">
                Bad Cigarettes
              </h1>
              <p className="text-sm text-gray-400 mb-8">CIGARETTES ARE BAD</p>

              {status === 'loading' && (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-300">Verifying your email...</p>
                </div>
              )}

              {status === 'success' && (
                <div>
                  <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-green-400 mb-2">Email Verified!</h2>
                  <p className="text-gray-300 mb-6">{message}</p>
                  <Link
                    href="/signon"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Continue to Sign In
                  </Link>
                </div>
              )}

              {status === 'error' && (
                <div>
                  <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-red-400 mb-2">Verification Failed</h2>
                  <p className="text-gray-300 mb-6">{message}</p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                    
                    <Link
                      href="/signon"
                      className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-300">Health Warning</h3>
                <p className="text-sm text-red-200 mt-1">
                  Cigarettes cause cancer, heart disease, and other serious health conditions.
                  Consider quitting for your health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}