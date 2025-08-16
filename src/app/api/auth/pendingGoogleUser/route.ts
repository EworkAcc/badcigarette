import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PendingGoogleUser from '@/models/pendingGoogleUser';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();

    const pendingUser = await PendingGoogleUser.findOne({ email });

    if (!pendingUser) {
      return NextResponse.json({ message: 'Pending user data not found' }, { status: 404 });
    }

    return NextResponse.json({ userData: pendingUser.userData });
  } catch (error) {
    console.error('Error fetching pending Google user data:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email parameter is required' }, { status: 400 });
    }

    await connectDB();

    await PendingGoogleUser.deleteOne({ email });

    return NextResponse.json({ message: 'Pending user data deleted successfully' });
  } catch (error) {
    console.error('Error deleting pending Google user data:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
