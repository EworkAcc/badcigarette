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
 * Handles Google OAuth sign-in process for NextAuth v5
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

    if (result?.ok) {
      console.log('Google sign-in successful');
      
      if (redirect) {
        router.push(result.url || callbackUrl);
      }

      return {
        success: true,
        url: result.url || callbackUrl
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
 * Alternative function for simple Google sign-in with automatic redirect
 * @param router - Next.js router instance for navigation
 * @param callbackUrl - URL to redirect to after successful sign-in (optional)
 */
export const simpleGoogleSignIn = async (
  router: AppRouterInstance,
  callbackUrl: string = '/'
): Promise<void> => {
  try {
    await signIn('google', { callbackUrl });
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Handles Google sign-in with loading state management
 * @param router - Next.js router instance
 * @param setIsLoading - State setter for loading indicator
 * @param options - Sign-in options
 */
export const handleGoogleSignInWithLoading = async (
  router: AppRouterInstance,
  setIsLoading: (loading: boolean) => void,
  options: GoogleSignInOptions = {}
): Promise<void> => {
  setIsLoading(true);
  
  try {
    const result = await handleGoogleSignIn(router, options);
    
    if (!result.success) {
      alert(`Google sign-in failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Failed to sign in with Google. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

/**
 * Simple hook-style function for use in components
 * @param router - Next.js router instance
 * @param setIsLoading - Loading state setter (optional)
 */
export const useGoogleSignIn = (
  router: AppRouterInstance,
  setIsLoading?: (loading: boolean) => void
) => {
  return async (callbackUrl: string = '/') => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };
};