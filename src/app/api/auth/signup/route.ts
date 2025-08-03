import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import GoogleUser from '@/models/googleUsers';
import { sendEmail, generateVerificationEmailHTML } from '@/lib/emailService';
import { generateVerificationToken, getVerificationExpiry } from '@/lib/verificationToken';

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
    const existingGoogleUser = await GoogleUser.findOne({ email });
    if (existingGoogleUser) {
      return NextResponse.json(
        { message: 'Email is already registered via Google. Please sign in with Google.' },
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          { message: 'User already exists with this email' },
          { status: 400 }
        );
      } else {
        const verificationToken = generateVerificationToken();
        const verificationExpiry = getVerificationExpiry();
        
        existingUser.fname = fname;
        existingUser.lname = lname;
        existingUser.password = await bcrypt.hash(password, 12);
        existingUser.phone = phone;
        existingUser.country = country;
        existingUser.emailVerificationToken = verificationToken;
        existingUser.emailVerificationExpires = verificationExpiry;
        
        await existingUser.save();

        const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verifyEmail?token=${verificationToken}`;
        const emailHTML = generateVerificationEmailHTML(`${fname} ${lname}`, verificationUrl);
        
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
          message: 'Registration updated. Please check your email for verification link.',
          requiresVerification: true
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    const newUser = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
      phone,
      country,
      image: '/defaultPFP.png',
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verifyEmail?token=${verificationToken}`;
    const emailHTML = generateVerificationEmailHTML(`${fname} ${lname}`, verificationUrl);
    
    const emailSent = await sendEmail({
      to: email,
      subject: 'Verify Your Email - Bad Cigarettes',
      html: emailHTML,
    });

    if (!emailSent) {
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Registration successful! Please check your email for verification link.',
      requiresVerification: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}