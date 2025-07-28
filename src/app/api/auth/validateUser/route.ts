import { NextRequest, NextResponse } from 'next/server';
import { validateUserExists } from '@/lib/authUtils.server';
import { UserData, getUserEmail, getAuthCookie } from '@/lib/authUtils.client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
export async function GET(request: NextRequest) {

  const [userData, setUserData] = useState<UserData | null>(null);
  const { data: session, status } = useSession();
  try {  
    useEffect(() => {
      const checkAuth = async () => {
        if (session?.user) {
          const cookieUser = getAuthCookie();
          
          if (cookieUser && cookieUser.loginType === 'google') {
            setUserData(cookieUser);
            return;
          }
  
          if (!cookieUser) {
            try {
              const response = await fetch('/api/auth/googleCookie', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
  
              if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
                return;
              } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('Failed to set Google cookie:', response.status, errorData);
                
                console.log('Falling back to session data');
              }
            } catch (error) {
              console.error('Error setting Google cookie:', error);
              console.log('Falling back to session data');
            }
          }
  
          const googleUserData: UserData = {
            id: (session.user as any).id || 'google-user',
            name: session.user.name || 'Google User',
            email: session.user.email || '',
            image: session.user.image || undefined,
            loginType: 'google'
          };
          
          setUserData(googleUserData);
          return;
        }
        
        const cookieUser = getAuthCookie();
        if (cookieUser) {
          setUserData(cookieUser);
        }
        
      };
      checkAuth();
    }, [session, status]);

    if (!userData) {
      return NextResponse.json(
        { valid: false, message: 'No auth cookie found' },
        { status: 401 }
      );
    }

    try {
      userData.email = getUserEmail(userData);
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      return NextResponse.json(
        { valid: false, message: 'Missing Email' },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log('Skipping database validation in development');
      return NextResponse.json(
        { valid: true, user: userData },
        { status: 200 }
      );
    }

    try {
      const userExists = await validateUserExists(userData);

      if (!userExists) {
        const response = NextResponse.json(
          { valid: false, message: 'User no longer exists in database' },
          { status: 404 }
        );
        response.cookies.delete('auth_user');
        return response;
      }

      return NextResponse.json(
        { valid: true, user: userData },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database connection error:', dbError);
     
      return NextResponse.json(
        { valid: false, message: 'Database temporarily unavailable' },
        { status: 503 }
      );
    }
   
  } catch (error) {
    console.error('User validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Validation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}