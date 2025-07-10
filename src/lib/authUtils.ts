import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';

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
  secure: process.env.NODE_ENV === 'production',
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

export const isLoggedIn = (): boolean => {
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