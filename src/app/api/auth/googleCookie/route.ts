import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/connectDB';
import { GoogleUser } from '@/models/googleUsers';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Google Cookie API Debug ===');
    
    const session = await getServerSession(authConfig);
    console.log('Session exists:', !!session);
    console.log('Session user email:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('❌ No active session or email');
      return NextResponse.json(
        { message: 'No active session' },
        { status: 401 }
      );
    }

    console.log('✅ Session valid, connecting to DB...');
    await connectDB();
    console.log('✅ DB connected, searching for user...');
    
    const dbUser = await GoogleUser.findOne({ 
      email: session.user.email 
    });
    
    console.log('User found in DB:', !!dbUser);
    console.log('DB User data:', dbUser ? { id: dbUser._id, email: dbUser.email, name: dbUser.name } : 'null');
    
    if (!dbUser) {
      console.log('❌ User not found in GoogleUser collection');
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = {
      id: dbUser._id.toString(),
      name: session.user.name || 'Google User',
      email: session.user.email,
      image: dbUser.image || session.user.image || undefined,
      loginType: 'google' as const
    };

    console.log('✅ User data prepared:', userData);

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

    console.log('✅ Setting cookie with options:', cookieOptions);
    response.cookies.set('auth_user', JSON.stringify(userData), cookieOptions);

    console.log('✅ Cookie set successfully');
    return response;

  } catch (error) {
    console.error('❌ Google cookie handler error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}