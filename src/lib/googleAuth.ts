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

/**
 * @param router - Next.js router instance for navigation
 * @param options - Sign-in options (optional)
 * @returns Promise with sign-in result
 */
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

/**
 * This integrates with your custom auth cookie system
 * @param callbackUrl - URL to redirect to after successful sign-in (optional)
 */
export const simpleGoogleSignIn = async (
  callbackUrl: string = '/'
): Promise<void> => {
  try {
    const result = await signIn('google', { 
      redirect: false,
      callbackUrl 
    });
    
    if (result?.ok) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch('/api/auth/googleCookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        window.dispatchEvent(new Event('storage'));
        
        window.location.href = callbackUrl;
      } else {
        console.error('Failed to set custom auth cookie');
        window.location.href = callbackUrl;
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

/**
 * @param setIsLoading - State setter for loading indicator
 * @param callbackUrl - Callback URL after sign-in
 */
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

/** 
 * @param setIsLoading - Loading state setter (optional)
 */
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