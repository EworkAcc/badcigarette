import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/connectDB';
import User from '../../../../models/User';

interface CreateUserParams {
  fname: string;
  lname: string;
  email: string;
  password: string;
  phone: string;
  city: string;
}

interface UserResponse {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  city: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserParams = await request.json();
    const { fname, lname, email, password, phone, city } = body;

    // Validate required fields
    if (!fname || !lname || !email || !password || !phone || !city) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      phone,
      city
    });

    await newUser.save();

    // Return success response (don't include password)
    const userResponse: UserResponse = {
      id: newUser._id.toString(),
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
      phone: newUser.phone,
      city: newUser.city
    };

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}