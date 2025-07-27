import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';

interface CigaretteDocument {
  id: string; 
  name: string;
  description: string;
  rating?: number;
  noOfReviews?: number;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const count = await subCigarettes.countDocuments();
    if (count === 0) {
      return NextResponse.json(
        { message: 'No cigarettes available' },
        { status: 404 }
      );
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomCigarette = await subCigarettes
      .findOne()
      .skip(randomIndex)
      .select('id name description rating noOfReviews') 
      .lean() as CigaretteDocument | null;

    if (!randomCigarette) {
      return NextResponse.json(
        { message: 'Failed to find random cigarette' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Random cigarette found',
        cigarette: {
          id: randomCigarette.id, 
          name: randomCigarette.name,
          description: randomCigarette.description,
          rating: randomCigarette.rating || 0,
          noOfReviews: randomCigarette.noOfReviews || 0
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Random cigarette error:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}