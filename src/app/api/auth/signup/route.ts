import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';
import GoogleUser from '@/models/googleUsers';
import { sendEmail, generateVerificationEmailHTML } from '@/lib/emailService';
import { generateVerificationToken, getVerificationExpiry } from '@/lib/verificationToken';

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called'); 

    const body = await request.json();
    console.log('Signup request body received:', {
      ...body,
      password: '[REDACTED]' 
    }); 

    const { 
      fname, 
      lname, 
      email, 
      password, 
      phone, 
      country,
      termsOfServiceAccepted,
      privacyPolicyAccepted,
      dataSellingConsent
    } = body;

    if (!fname || !lname || !email || !password || !phone || !country) {
      console.error('Missing required fields');
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!termsOfServiceAccepted || !privacyPolicyAccepted) {
      console.error('Missing required consents:', { termsOfServiceAccepted, privacyPolicyAccepted });
      return NextResponse.json(
        { message: 'You must accept both Terms of Service and Privacy Policy to create an account' },
        { status: 400 }
      );
    }

    if (typeof dataSellingConsent !== 'boolean') {
      console.error('Invalid dataSellingConsent value:', dataSellingConsent);
      return NextResponse.json(
        { message: 'Data sharing preference must be explicitly set' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Connected to database');

    const existingUser = await User.findOne({ email });
    const existingGoogleUser = await GoogleUser.findOne({ email });

    if (existingGoogleUser) {
      console.log('Email exists with Google account:', email);
      return NextResponse.json(
        { 
          message: 'Email is already registered via Google. Please sign in with Google.',
          existingAccount: { source: 'google' }
        },
        { status: 409 }
      );
    }

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        console.log('Email exists with verified account:', email);
        return NextResponse.json(
          { 
            message: 'User already exists with this email',
            existingAccount: { source: 'email' }
          },
          { status: 409 }
        );
      } else {
        console.log('Updating existing unverified user:', existingUser._id);
        
        const verificationToken = generateVerificationToken();
        const verificationExpiry = getVerificationExpiry();
        
        existingUser.fname = fname;
        existingUser.lname = lname;
        existingUser.password = await bcrypt.hash(password, 12);
        existingUser.phone = phone;
        existingUser.country = country;
        existingUser.emailVerificationToken = verificationToken;
        existingUser.emailVerificationExpires = verificationExpiry;
        existingUser.termsOfServiceAccepted = termsOfServiceAccepted;
        existingUser.privacyPolicyAccepted = privacyPolicyAccepted;
        existingUser.dataSellingConsent = dataSellingConsent;
        existingUser.consentDate = new Date();
        
        await existingUser.save();

        console.log('Updated user consent data:', {
          id: existingUser._id,
          termsOfService: existingUser.termsOfServiceAccepted,
          privacyPolicy: existingUser.privacyPolicyAccepted,
          dataSellingConsent: existingUser.dataSellingConsent,
          consentDate: existingUser.consentDate
        });

        const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verifyEmail?token=${verificationToken}`;
        const emailHTML = generateVerificationEmailHTML(`${fname} ${lname}`, verificationUrl);
        
        const emailSent = await sendEmail({
          to: email,
          subject: 'Verify Your Email - Bad Cigarettes',
          html: emailHTML,
        });

        if (!emailSent) {
          console.error('Failed to send verification email');
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

    console.log('Creating new user');
    
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
      termsOfServiceAccepted,
      privacyPolicyAccepted,
      dataSellingConsent,
      consentDate: new Date()
    });

    console.log('Created new user with consent data:', {
      id: newUser._id,
      termsOfService: newUser.termsOfServiceAccepted,
      privacyPolicy: newUser.privacyPolicyAccepted,
      dataSellingConsent: newUser.dataSellingConsent,
      consentDate: newUser.consentDate
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verifyEmail?token=${verificationToken}`;
    const emailHTML = generateVerificationEmailHTML(`${fname} ${lname}`, verificationUrl);

    const emailSent = await sendEmail({
      to: email,
      subject: 'Verify Your Email - Bad Cigarettes',
      html: emailHTML,
    });

    if (!emailSent) {
      console.error('Failed to send verification email, deleting user');
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Verification email sent successfully');

    return NextResponse.json({
      message: 'Registration successful! Please check your email for verification link.',
      requiresVerification: true
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error || 'Unknown error'}`, error: error },
      { status: 500 }
    );
  }
}