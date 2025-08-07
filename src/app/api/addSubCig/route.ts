import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import generateUniqueId from '@/lib/uniqueID';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, id, posts, description, rating, type } = await request.json();

    if (!name || !id || !description || rating === undefined) {
      return NextResponse.json(
        { message: 'Name, id, description, and rating are required' },
        { status: 400 }
      );
    }

    const validTypes = ['r', 'l', 'ul', 'm'];
    const cigaretteType = type && validTypes.includes(type) ? type : 'r';

    await connectDB();

    const existingSubCigById = await subCigarettes.findOne({ id });
    if (existingSubCigById) {
      return NextResponse.json(
        { message: 'subCigarette already exists with this id' },
        { status: 400 }
      );
    }

    const existingSubCigByName = await subCigarettes.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    if (existingSubCigByName) {
      return NextResponse.json(
        { message: 'A cigarette with this name already exists' },
        { status: 400 }
      );
    }

    const newSubCig = new subCigarettes({
      name: name.trim(),
      id,
      posts: posts || [], 
      description: description.trim(),
      rating,
      noOfReviews: 0,
      type: cigaretteType
    });

    const savedSubCig = await newSubCig.save();

    revalidatePath('/subCigarettes');

    const response = NextResponse.json(
      { 
        message: 'subCigarette created with id: ' + id + ' and name ' + name,
        data: savedSubCig 
      },
      { status: 201 }
    );

    return response;

  } catch (error) {
    console.error('Create subCigarette error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}