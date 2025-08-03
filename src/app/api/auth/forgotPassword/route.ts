import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmailHTML } from '@/lib/emailService';
import { generatePasswordResetToken, getPasswordResetExpiry } from '@/lib/verificationToken';

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

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isEmailVerified: true 
    });

    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, we\'ve sent a password reset link.'
      });
    }

    const resetToken = generatePasswordResetToken();
    const resetExpiry = getPasswordResetExpiry();

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/resetPassword?token=${resetToken}`;
    const emailHTML = generatePasswordResetEmailHTML(`${user.fname} ${user.lname}`, resetUrl);
    
    const emailSent = await sendEmail({
      to: email,
      subject: 'Reset Your Password - Bad Cigarettes',
      html: emailHTML,
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we\'ve sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
