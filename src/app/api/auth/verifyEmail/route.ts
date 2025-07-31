import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.json({
      message: 'Email verified successfully!',
      success: true
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}