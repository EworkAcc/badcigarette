'use client';

import Link from 'next/link';
import Navigation from '@/components/NavBar';

export default function EmailSentPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-red-400 mb-2">Check Your Email</h1>
            <p className="text-gray-300 mb-6">
              We've sent a verification link to your email address. 
              Please check your inbox and click the link to verify your account.
            </p>
            
            <div className="bg-yellow-900 border border-yellow-700 rounded p-3 mb-6">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> The verification link expires in 5 minutes for security.
              </p>
            </div>
            
            <Link
              href="/signon"
              className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}