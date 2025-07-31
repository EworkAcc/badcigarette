import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          message: 'Please verify your email address before logging in',
          requiresVerification: true,
          email: email
        },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userData = {
      id: user._id.toString(),
      name: `${user.fname} ${user.lname}`,
      email: user.email,
      image: user.image,
      loginType: 'standard' as const
    };

    const response = NextResponse.json(
      { message: 'Login successful', user: userData },
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
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}