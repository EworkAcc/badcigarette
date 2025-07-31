'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/NavBar';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'EmailExistsWithDifferentProvider':
        return {
          title: 'Account Already Exists',
          message: 'This email is already registered with a password. Please sign in with your email and password instead of Google.',
          action: 'Sign in with Email',
          actionHref: '/signon'
        };
      case 'OAuthSignin':
        return {
          title: 'OAuth Sign-in Error',
          message: 'There was an error signing in with your OAuth provider. Please try again.',
          action: 'Try Again',
          actionHref: '/signon'
        };
      case 'OAuthCallback':
        return {
          title: 'OAuth Callback Error',
          message: 'There was an error processing your OAuth sign-in. Please try again.',
          action: 'Try Again',
          actionHref: '/signon'
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication. Please try again.',
          action: 'Try Again',
          actionHref: '/signon'
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg 
                  className="h-6 w-6 text-red-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 19.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-red-400 mb-4">
                {errorInfo.title}
              </h1>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {errorInfo.message}
              </p>
              
              <div className="space-y-3">
                <Link
                  href={errorInfo.actionHref}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors inline-block"
                >
                  {errorInfo.action}
                </Link>
                
                <Link
                  href="/"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors inline-block"
                >
                  Back to Home
                </Link>
              </div>
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