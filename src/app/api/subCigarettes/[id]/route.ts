import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: 'SubCigarette ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const cigarette = await subCigarettes
      .findOne({ id })
      .select('id name description rating noOfReviews posts')
      .lean() as any;

    if (!cigarette) {
      return NextResponse.json(
        { message: 'SubCigarette not found' },
        { status: 404 }
      );
    }

    const transformedCigarette = {
      id: cigarette.id || cigarette._id?.toString(),
      name: cigarette.name,
      description: cigarette.description,
      rating: cigarette.rating || 0,
      noOfReviews: cigarette.noOfReviews || 0,
      posts: cigarette.posts || []
    };

    return NextResponse.json(
      {
        message: 'SubCigarette found',
        cigarette: transformedCigarette
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get subCigarette error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}