import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../../../lib/auth';
import connectDB from '../../../../lib/connectDB';
import { GoogleUser } from '../../../../models/googleUsers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'No active session' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const dbUser = await GoogleUser.findOne({ 
      email: session.user.email 
    });
    
    if (!dbUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = {
      id: dbUser._id.toString(),
      name: session.user.name || 'Google User',
      email: session.user.email,
      image: session.user.image || undefined,
      loginType: 'google' as const
    };

    const response = NextResponse.json(
      { message: 'Cookie set successfully', user: userData },
      { status: 200 }
    );

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NEXT_PUBLIC_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    };

    response.cookies.set('auth_user', JSON.stringify(userData), cookieOptions);

    return response;

  } catch (error) {
    console.error('Google cookie handler error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}