import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { sendEmail, generateVerificationEmailHTML } from '@/lib/emailService';
import { generateVerificationToken, getVerificationExpiry } from '@/lib/verificationToken';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email, isEmailVerified: false });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found or already verified' },
        { status: 400 }
      );
    }

    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpiry;
    await user.save();

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verifyEmail?token=${verificationToken}`;
    const emailHTML = generateVerificationEmailHTML(`${user.fname} ${user.lname}`, verificationUrl);
    
    const emailSent = await sendEmail({
      to: email,
      subject: 'Verify Your Email - Bad Cigarettes',
      html: emailHTML,
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification email sent successfully!'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}