import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateUserExists } from '../../../../lib/authUtils.server';
import { UserData } from '../../../../lib/authUtils.client';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_user');
    
    if (!authCookie) {
      return NextResponse.json({ valid: false, message: 'No auth cookie' }, { status: 401 });
    }

    let userData: UserData;
    try {
      userData = JSON.parse(authCookie.value);
    } catch (error) {
      return NextResponse.json({ valid: false, message: 'Invalid cookie format' }, { status: 400 });
    }

    const userExists = await validateUserExists(userData);

    if (!userExists) {
      const response = NextResponse.json({ valid: false, message: 'User not found' }, { status: 404 });
      response.cookies.delete('auth_user');
      return response;
    }

    return NextResponse.json({ valid: true, message: 'User exists' }, { status: 200 });

  } catch (error) {
    console.error('Auth validation error:', error);
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
  }
}