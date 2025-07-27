import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { fname, lname, email, password, phone, country } = await request.json();

    if (!fname || !lname || !email || !password || !phone || !country) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      phone,
      country,
      pfp: '/defaultPFP.png'
    });

    const userData = {
      id: newUser._id.toString(),
      name: `${newUser.fname} ${newUser.lname}`,
      email: newUser.email,
      image: newUser.pfp,
      loginType: 'standard' as const
    };

    const response = NextResponse.json(
      { message: 'User created successfully', user: userData },
      { status: 201 }
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
