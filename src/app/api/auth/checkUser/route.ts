import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const existingUser = await User.findOne({ email });
    
    return NextResponse.json({ exists: !!existingUser }, { status: 200 });
    
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { message: 'Internal server server error' },
      { status: 500 }
    );
  }
}

