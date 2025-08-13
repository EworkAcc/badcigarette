import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import GoogleUser from '@/models/googleUsers';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('Google consent API called'); 

    const body = await request.json();
    console.log('Request body received:', body); 

    const {
      googleId,
      email,
      name,
      image,
      termsOfServiceAccepted,
      privacyPolicyAccepted,
      dataSellingConsent
    } = body;

    if (!googleId || !email || !name) {
      console.error('Missing required fields:', { googleId, email, name });
      return NextResponse.json(
        { message: 'Missing required Google user data' },
        { status: 400 }
      );
    }

    if (!termsOfServiceAccepted || !privacyPolicyAccepted) {
      console.error('Missing required consents:', { termsOfServiceAccepted, privacyPolicyAccepted });
      return NextResponse.json(
        { message: 'You must accept both Terms of Service and Privacy Policy to continue' },
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
    if (existingUser) {
      console.error('Email exists with regular account:', email);
      return NextResponse.json(
        { message: 'This email is already registered with a password. Please sign in with your email and password instead.' },
        { status: 409 }
      );
    }

    let user = await GoogleUser.findOne({ 
      $or: [
        { googleId },
        { email }
      ]
    });

    if (user) {
      console.log('Updating existing Google user:', user._id);
      
      user.termsOfServiceAccepted = termsOfServiceAccepted;
      user.privacyPolicyAccepted = privacyPolicyAccepted;
      user.dataSellingConsent = dataSellingConsent;
      user.consentDate = new Date();
      
      user.name = name;
      user.image = image || user.image;
      
      await user.save();
      console.log('Updated user consent data:', {
        termsOfService: user.termsOfServiceAccepted,
        privacyPolicy: user.privacyPolicyAccepted,
        dataSellingConsent: user.dataSellingConsent,
        consentDate: user.consentDate
      });
    } else {
      console.log('Creating new Google user');
      
      user = await GoogleUser.create({
        googleId,
        email,
        name,
        image: image || null,
        termsOfServiceAccepted,
        privacyPolicyAccepted,
        dataSellingConsent,
        consentDate: new Date()
      });

      console.log('Created new user with consent data:', {
        id: user._id,
        termsOfService: user.termsOfServiceAccepted,
        privacyPolicy: user.privacyPolicyAccepted,
        dataSellingConsent: user.dataSellingConsent,
        consentDate: user.consentDate
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        loginType: 'google'
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('Generated JWT token for user:', user._id);

    const responseData = {
      message: 'Google sign-in completed successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        loginType: 'google',
        termsOfServiceAccepted: user.termsOfServiceAccepted,
        privacyPolicyAccepted: user.privacyPolicyAccepted,
        dataSellingConsent: user.dataSellingConsent
      }
    };

    console.log('Sending response with user data:', responseData);

    const response = NextResponse.json(responseData);

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    console.log('Set auth cookie');

    return response;

  } catch (error) {
    console.error('Google consent error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error },
      { status: 500 }
    );
  }
}