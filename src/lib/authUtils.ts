import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from './connectDB';
import { GoogleUser } from '@/models/googleUsers'; 
import User from '@/models/User';

export interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  loginType: 'standard' | 'google';
}

const AUTH_COOKIE_NAME = 'auth_user';

const getAuthCookieOptions = () => ({
  httpOnly: false,
  secure: process.env.NEXT_PUBLIC_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60,
  path: '/',
});

export const setAuthCookie = (userData: UserData): void => {
  const options = getAuthCookieOptions();
  setCookie(AUTH_COOKIE_NAME, JSON.stringify(userData), options);
  console.log('Auth cookie set with options:', options, "and data:", userData);
};

export const getAuthCookie = (): UserData | null => {
  console.log('Retrieving auth cookie');
  try {
    const cookieValue = getCookie(AUTH_COOKIE_NAME);
    if (!cookieValue) return null;
   
    const userData = JSON.parse(cookieValue as string);
    console.log('Auth cookie retrieved:', userData);
    return userData as UserData;
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return null;
  }
};

export const removeAuthCookie = (): void => {
  deleteCookie(AUTH_COOKIE_NAME, { path: '/' });
};

/**
 * Validates if a user still exists in the database
 * @param userData - User data from cookie
 * @returns Promise<boolean> - true if user exists, false otherwise
 */
export const validateUserExists = async (userData: UserData): Promise<boolean> => {
  try {
    await connectDB();
   
    let dbUser = null;
   
    if (userData.loginType === 'google') {
      dbUser = await GoogleUser.findById(userData.id);
    } else {
      dbUser = await User.findById(userData.id);
    }
   
    return dbUser !== null;
  } catch (error) {
    console.error('Error validating user existence:', error);
    return false;
  }
};

/**
 * Gets auth cookie and validates user still exists in database
 * If user doesn't exist, removes the cookie and returns null
 * @returns Promise<UserData | null>
 */
export const getValidatedAuthCookie = async (): Promise<UserData | null> => {
  const userData = getAuthCookie();
 
  if (!userData) return null;
 
  const userExists = await validateUserExists(userData);
 
  if (!userExists) {
    console.log('User no longer exists in database, removing auth cookie');
    removeAuthCookie();
    return null;
  }
 
  return userData;
};

/**
 * Checks if user is logged in and account still exists
 * @returns Promise<boolean>
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const userData = await getValidatedAuthCookie();
  return userData !== null;
};

export const isLoggedInSync = (): boolean => {
  return getAuthCookie() !== null;
};

export const getUserImage = (userData: UserData | null): string => {
  if (!userData) return '/defaultPFP.png';
  if (userData.loginType === 'google' && userData.image) {
    return userData.image;
  }
  return userData.image || '/defaultPFP.png';
};

export const getUserDisplayName = (userData: UserData | null): string => {
  if (!userData) return 'Guest';
  return userData.name || 'User';
};