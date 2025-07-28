import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateUserExists } from '@/lib/authUtils.server';
import { UserData } from '@/lib/authUtils.client';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_user');
   
    if (!authCookie) {
      return NextResponse.json(
        { valid: false, message: 'No auth cookie found' },
        { status: 401 }
      );
    }

    let userData: UserData;
    try {
      userData = JSON.parse(authCookie.value);
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      return NextResponse.json(
        { valid: false, message: 'Invalid cookie format' },
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