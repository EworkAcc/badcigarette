
"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Navigation from '@/components/NavBar';
import SignupPopup from '@/components/SignupPopup';
import ForgotPasswordPopup from '@/components/ForgotPasswordPopup';
import ConsentPopup from '@/components/ConsentPopup'; 
import { simpleGoogleSignIn } from '@/lib/googleAuth';
import { getAuthCookie, removeAuthCookie, UserData } from '@/lib/authUtils.client';
import { TermsOfServicePopup, PrivacyPolicyPopup } from '@/components/PPPTOS';

interface CreateUserParams {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  termsOfServiceAccepted: boolean; 
  privacyPolicyAccepted: boolean;  
  dataSellingConsent: boolean;     
}

interface GoogleConsentParams {
  termsOfService: boolean;
  privacyPolicy: boolean;
  dataSellingConsent: boolean;
}

interface PendingGoogleData {
  googleId: string;
  email: string;
  name: string;
  image?: string;
}

const LoginPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams: URLSearchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showGoogleConsentPopup, setShowGoogleConsentPopup] = useState(false);
  const [pendingGoogleData, setPendingGoogleData] = useState<PendingGoogleData | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = getAuthCookie();
      setUserData(user);
      setIsLoading(false);
    };

    checkAuth();

        const handleGoogleConsentRequired = async () => {
      const errorParam = searchParams.get("error");
      const messageParam = searchParams.get("message");
      const emailParam = searchParams.get("email");

      if (errorParam === "EmailExistsWithDifferentProvider") {
        setError("This email is already registered with a password. Please sign in with your email and password instead of Google.");
      } else if (errorParam === "GoogleConsentRequired") {
        console.log("Google consent required - fetching pending user data");

        if (!emailParam) {
          console.error("GoogleConsentRequired error without email parameter.");
          setError("Google sign-in session expired. Please try signing in again.");
          return;
        }

        try {
          const response = await fetch(`/api/auth/pendingGoogleUser?email=${encodeURIComponent(emailParam)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch pending user data: ${response.statusText}`);
          }
          const data = await response.json();
          const pendingData = data.userData;

          if (!pendingData) {
            console.log("No pending data found for email, showing error");
            setError("Google sign-in session expired. Please try signing in again.");
            return;
          }

          setPendingGoogleData(pendingData);
          setShowGoogleConsentPopup(true);
        } catch (e) {
          console.error("Error fetching pending Google user data:", e);
          setError("Google sign-in session expired. Please try signing in again.");
        }
      } else if (messageParam) {
        setSuccessMessage(decodeURIComponent(messageParam));
      }
    };

    handleGoogleConsentRequired();

    const handleStorageChange = () => {
      checkAuth();
    };


    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (error) {
      setError('');
      setShowResendButton(false);
    }
   
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setError('');
    setSuccessMessage('');
   
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.user) {
          setUserData(responseData.user);
         
          setTimeout(() => {
            window.dispatchEvent(new Event('storage'));
          }, 100);
         
          router.push('/');
        } else {
          setTimeout(() => {
            const user = getAuthCookie();
            if (user) {
              setUserData(user);
              window.dispatchEvent(new Event('storage'));
              router.push('/');
            }
          }, 200);
        }
      } else {
        if (responseData.requiresVerification) {
          setError(responseData.message);
          setShowResendButton(true);
          setUserEmail(responseData.email);
        } else {
          setError(responseData.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resendVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      alert(response.ok ? data.message : data.message);
    } catch (error) {
      alert('Failed to resend verification email');
    }
  };

  const handleGoogleLogin = async () => {
    await simpleGoogleSignIn('/');
  };

  const handleGoogleConsentSubmit = async (consents: GoogleConsentParams) => {
    if (!pendingGoogleData) {
      setError('Google sign-in data not found. Please try signing in again.');
      return;
    }

    console.log('Submitting Google consent with data:', {
      pendingData: pendingGoogleData,
      consents
    });

    try {
      const requestBody = {
        googleId: pendingGoogleData.googleId,
        email: pendingGoogleData.email,
        name: pendingGoogleData.name,
        image: pendingGoogleData.image,
        termsOfServiceAccepted: consents.termsOfService,
        privacyPolicyAccepted: consents.privacyPolicy,
        dataSellingConsent: consents.dataSellingConsent
      };

      console.log('Request body for Google consent:', requestBody);

      const response = await fetch("/api/auth/googleConsent", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('Google consent response:', responseData);

      if (response.ok) {
        setShowGoogleConsentPopup(false);
        
        // Show success message to user
        const successMsg = responseData.isNewUser 
          ? 'Account created successfully! You are now logged in.' 
          : 'Successfully logged in with Google!';
        
        setSuccessMessage(successMsg);
        
        sessionStorage.removeItem('pendingGoogleUser');
        if (pendingGoogleData.email) {
          try {
            await fetch("/api/auth/pendingGoogleUser", {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: pendingGoogleData.email })
            });
          } catch (e) {
            console.error('Error clearing server-side pending data:', e);
          }
        }
        
        setPendingGoogleData(null);
        setUserData(responseData.user);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('storage'));
        }, 100);
        
        // Show success message for 2 seconds before redirecting
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.error('Google consent failed:', responseData);
        setError(responseData.message || 'Failed to complete Google sign-in');
      }
    } catch (error) {
      console.error('Google consent error:', error);
      setError('Failed to complete Google sign-in. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    try {
      if (userData?.loginType === 'google') {
        await signOut({ redirect: false });
      } else {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
     
      removeAuthCookie();
      setUserData(null);
     
      window.dispatchEvent(new Event('storage'));
     
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignupPopup(true);
  };

  const handleSignupSubmit = async (userData: CreateUserParams) => {
    console.log('Submitting signup with consent data:', {
      termsOfServiceAccepted: userData.termsOfServiceAccepted,
      privacyPolicyAccepted: userData.privacyPolicyAccepted,
      dataSellingConsent: userData.dataSellingConsent
    });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Signup response:', responseData);

      if (!response.ok) {
        if (response.status === 409 && responseData.existingAccount) {
          const { source } = responseData.existingAccount;
          if (source === 'google') {
            throw new Error('This email is already registered with Google. Please sign in with Google instead.');
          } else {
            throw new Error('This email is already registered. Please sign in instead.');
          }
        }
        throw new Error(responseData.message || 'Failed to create account');
      }

      if (responseData.requiresVerification) {
        alert(responseData.message);
        setShowSignupPopup(false);
      } else {
        alert('Account created successfully!');
        setShowSignupPopup(false);
       
        if (responseData.user) {
          setUserData(responseData.user);
         
          setTimeout(() => {
            window.dispatchEvent(new Event('storage'));
          }, 100);
         
          router.push('/');
        } else {
          setTimeout(() => {
            const user = getAuthCookie();
            if (user) {
              setUserData(user);
              window.dispatchEvent(new Event('storage'));
              router.push('/');
            }
          }, 200);
        }
      }
     
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleConsentPopupClose = () => {
    setShowGoogleConsentPopup(false);
    if (pendingGoogleData?.email) {
      fetch("/api/auth/pendingGoogleUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingGoogleData.email })
      }).catch(e => console.error("Error clearing server-side pending data:", e));
    }
    setPendingGoogleData(null);
    
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    url.searchParams.delete("email"); 
    url.searchParams.delete("googleConsent");
    window.history.replaceState({}, "", url.toString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
         
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-400 mb-2">Welcome Back</h1>

            <p className="text-gray-400">You are already signed in as {userData.name}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
            <div className="mb-6">
              <img
                src={userData.image || '/defaultPFP.png'}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-600"
              />
              <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
              <p className="text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Signed in via {userData.loginType === 'google' ? 'Google' : 'Email'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-red-400 hover:text-red-300 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
       
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your Bad Cigarettes account</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {successMessage && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
              {showResendButton && (
                <button
                  onClick={handleResendVerification}
                  className="mt-2 text-red-300 hover:text-red-200 underline text-sm"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
           
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
           
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setShowForgotPasswordPopup(true)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              {isLoginLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
               ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center border border-gray-300"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={handleSignupClick}
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Sign up for free
            </button>
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <TermsOfServicePopup><a href="#" className="text-red-400 hover:text-red-300">Terms of Service</a></TermsOfServicePopup>
            {' '}and{' '}
            <PrivacyPolicyPopup><a href="#" className="text-red-400 hover:text-red-300">Privacy Policy</a></PrivacyPolicyPopup>
          </p>
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

      <SignupPopup
        isOpen={showSignupPopup}
        onClose={() => setShowSignupPopup(false)}
        onSubmit={handleSignupSubmit}
      />

      <ForgotPasswordPopup
        isOpen={showForgotPasswordPopup}
        onClose={() => setShowForgotPasswordPopup(false)}
      />

      <ConsentPopup
        isOpen={showGoogleConsentPopup}
        onClose={handleConsentPopupClose}
        onConsent={handleGoogleConsentSubmit}
        userType="google"
      />
      
    </div>
  );
};

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
     
      <Suspense fallback={<LoadingFallback />}>
        <LoginPageContent />
      </Suspense>
    </div>
  );
};

export default LoginPage;