import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../utils/dbConnect/dbConnect';
import subCigarettes from '@/models/subCigarettes';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let sort: any = {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'name':
        sort.name = sortDirection;
        break;
      case 'numRatings':
        sort.noOfReviews = sortDirection;
        break;
      case 'rating':
      default:
        sort.rating = sortDirection;
        break;
    }

    const cigarettes = await subCigarettes
      .find(query)
      .select('name id description rating noOfReviews type')
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();

    const totalCount = await subCigarettes.countDocuments(query);

    return NextResponse.json({
      cigarettes,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + cigarettes.length < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching cigarettes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cigarettes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, description, type = 'r' } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const existingCigarette = await subCigarettes.findOne({ name });
    if (existingCigarette) {
      return NextResponse.json(
        { error: 'Cigarette with this name already exists' },
        { status: 409 }
      );
    }

    const newCigarette = new subCigarettes({
      name,
      description,
      type,
      posts: [],
      rating: 0,
      noOfReviews: 0
    });

    const savedCigarette = await newCigarette.save();

    return NextResponse.json(savedCigarette, { status: 201 });

  } catch (error) {
    console.error('Error creating cigarette:', error);
    return NextResponse.json(
      { error: 'Failed to create cigarette' },
      { status: 500 }
    );
  }
}

