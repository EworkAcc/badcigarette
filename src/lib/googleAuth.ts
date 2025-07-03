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
 * Handles Google OAuth sign-in process for NextAuth
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
    
    // Use redirect: true to let NextAuth handle the redirect
    // This helps avoid the state cookie issues
    if (redirect) {
      await signIn('google', {
        callbackUrl,
        redirect: true,
      });
      // If redirect is true, this line won't be reached
      return { success: true };
    }

    // For cases where you want to handle redirect manually
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
 * Simplified function for Google sign-in with automatic redirect
 * This is the recommended approach for most use cases
 * @param callbackUrl - URL to redirect to after successful sign-in (optional)
 */
export const simpleGoogleSignIn = async (
  callbackUrl: string = '/'
): Promise<void> => {
  try {
    await signIn('google', { 
      callbackUrl,
      redirect: true
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Handles Google sign-in with loading state management
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
 * React hook-style function for use in components
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