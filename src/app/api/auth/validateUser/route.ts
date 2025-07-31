import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateUserExists } from '@/lib/authUtils.server';
import { UserData } from '@/lib/authUtils.client';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('=== ValidateUser API Debug ===');
    
    let authCookie = null;
    let userData: UserData;
    
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      console.log('All cookies from cookieStore:', allCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 50) + '...' })));
      
      authCookie = cookieStore.get('auth_user');
      console.log('Auth cookie from cookieStore:', authCookie ? { name: authCookie.name, hasValue: !!authCookie.value } : 'null');
    } catch (cookieStoreError) {
      console.error('Error with cookieStore:', cookieStoreError);
    }
    
    if (!authCookie) {
      console.log('Trying request headers method...');
      const cookieHeader = request.headers.get('cookie');
      console.log('Cookie header:', cookieHeader?.substring(0, 200) + '...');
      
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            acc[name] = decodeURIComponent(value);
          }
          return acc;
        }, {} as Record<string, string>);
        
        console.log('Parsed cookies from header:', Object.keys(cookies));
        
        if (cookies['auth_user']) {
          authCookie = { name: 'auth_user', value: cookies['auth_user'] };
          console.log('Found auth_user in parsed cookies');
        }
      }
    }
    
    if (!authCookie) {
      console.log('Trying NextRequest.cookies method...');
      try {
        const requestAuthCookie = request.cookies.get('auth_user');
        if (requestAuthCookie) {
          authCookie = requestAuthCookie;
          console.log('Found auth_user in request.cookies');
        }
      } catch (requestCookieError) {
        console.error('Error with request.cookies:', requestCookieError);
      }
    }
   
    if (!authCookie || !authCookie.value) {
      console.log('❌ No auth cookie found with any method');
      return NextResponse.json(
        { valid: false, message: 'No auth cookie found' },
        { status: 401 }
      );
    }

    console.log('✅ Auth cookie found, attempting to parse...');
    
    try {
      userData = JSON.parse(authCookie.value);
      console.log('✅ Parsed user data:', { 
        id: userData?.id, 
        email: userData?.email, 
        loginType: userData?.loginType 
      });
    } catch (parseError) {
      console.error('❌ Error parsing auth cookie:', parseError);
      console.log('Cookie value that failed to parse:', authCookie.value?.substring(0, 100));
      return NextResponse.json(
        { valid: false, message: 'Invalid cookie format' },
        { status: 400 }
      );
    }

    if (!userData || !userData.id || !userData.email || !userData.loginType) {
      console.error('❌ Parsed user data is incomplete:', userData);
      return NextResponse.json(
        { valid: false, message: 'Incomplete user data in cookie' },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      if (userData.loginType === 'standard') {
        try {
          await connectDB();
          const user = await User.findById(userData.id);
          
          if (user && !user.isEmailVerified) {
            console.log('❌ User email not verified');
            return NextResponse.json(
              { valid: false, message: 'Email not verified', requiresVerification: true },
              { status: 403 }
            );
          }
        } catch (dbError) {
          console.error('Database check error in development:', dbError);
        }
      }
      
      console.log('🚧 Skipping full database validation in development');
      return NextResponse.json(
        { valid: true, user: userData },
        { status: 200 }
      );
    }

    console.log('🔍 Validating user in database...');
    
    try {
      const userExists = await validateUserExists(userData);
      console.log('Database validation result:', userExists);

      if (!userExists) {
        console.log('❌ User no longer exists in database');
        const response = NextResponse.json(
          { valid: false, message: 'User no longer exists in database' },
          { status: 404 }
        );
        
        response.cookies.delete('auth_user');
        response.cookies.set('auth_user', '', { 
          maxAge: 0, 
          path: '/',
          httpOnly: false,
          secure: process.env.NEXT_PUBLIC_ENV === 'production',
          sameSite: 'lax'
        });
        
        return response;
      }

      if (userData.loginType === 'standard') {
        await connectDB();
        const user = await User.findById(userData.id);
        
        if (user && !user.isEmailVerified) {
          console.log('❌ User email not verified');
          return NextResponse.json(
            { valid: false, message: 'Email not verified', requiresVerification: true },
            { status: 403 }
          );
        }
      }

      console.log('✅ User validation successful');
      return NextResponse.json(
        { valid: true, user: userData },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError);
     
      return NextResponse.json(
        { valid: false, message: 'Database temporarily unavailable' },
        { status: 503 }
      );
    }
   
  } catch (error) {
    console.error('❌ User validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Validation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('POST method called, delegating to GET');
  return GET(request);
}