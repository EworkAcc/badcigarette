import { signIn, SignInResponse } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface GoogleSignInOptions {
  callbackUrl?: string;
  redirect?: boolean;
}

interface GoogleSignInResult {
  success: boolean;
  error?: string;
  url?: string;
}

export const handleGoogleSignIn = async (
  router: AppRouterInstance,
  options: GoogleSignInOptions = {}
): Promise<GoogleSignInResult> => {
  try {
    const { callbackUrl = '/', redirect = true } = options;
    
    if (redirect) {
      await signIn('google', {
        callbackUrl,
        redirect: true,
      });
      return { success: true };
    }

    const result: SignInResponse | undefined = await signIn('google', {
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      console.error('Google sign-in error:', result.error);
      return {
        success: false,
        error: result.error
      };
    }

    if (result?.ok && result?.url) {
      console.log('Google sign-in successful');
      router.push(result.url);
      return {
        success: true,
        url: result.url
      };
    }

    return {
      success: false,
      error: 'Unknown error occurred during sign-in'
    };

  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign in with Google'
    };
  }
};

export const simpleGoogleSignIn = async (
  callbackUrl: string = '/'
): Promise<void> => {
  try {
    console.log('Starting Google sign-in flow...');
    
    const result = await signIn('google', { 
      redirect: false,
      callbackUrl 
    });
    
    console.log('Google sign-in result:', result);
    
    if (result?.ok) {
      console.log('Google sign-in successful, waiting before setting cookie...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch('/api/auth/googleCookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Google cookie response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Google cookie data:', data);
        
        window.dispatchEvent(new Event('storage'));
        
        window.location.href = callbackUrl;
      } else {
        console.error('Failed to set custom auth cookie');
        
        if (response.status === 401) {
          console.log('Consent required, redirecting to sign-on page');
          window.location.href = '/signon?error=GoogleConsentRequired';
          return;
        }
        
        window.location.href = callbackUrl;
      }
    } else if (result?.url) {
      console.log('NextAuth redirecting to:', result.url);
      
      if (result.url.includes('error=GoogleConsentRequired')) {
        console.log('Consent required redirect detected');
        window.location.href = result.url;
      } else {
        window.location.href = result.url;
      }
    } else {
      console.error('Google sign-in failed:', result?.error);
      alert('Google sign-in failed. Please try again.');
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Google sign-in failed. Please try again.');
  }
};

export const handleGoogleSignInWithLoading = async (
  setIsLoading: (loading: boolean) => void,
  callbackUrl: string = '/'
): Promise<void> => {
  setIsLoading(true);
  
  try {
    await simpleGoogleSignIn(callbackUrl);
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Failed to sign in with Google. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

export const useGoogleSignIn = (
  setIsLoading?: (loading: boolean) => void
) => {
  return async (callbackUrl: string = '/') => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      await simpleGoogleSignIn(callbackUrl);
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };
};