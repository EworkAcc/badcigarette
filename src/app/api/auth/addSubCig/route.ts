import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/connectDB';
import subCigarettes from '../../../../models/subCigarettes';
import generateUniqueId from '../../../../lib/uniqueID';

export async function POST(request: NextRequest) {
  try {
    const { name, id, posts, description, rating } = await request.json();

    if (!name || !id || !posts || !description || rating === undefined) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

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
      name,
      id,
      posts,
      description,
      rating
    });

    const savedSubCig = await newSubCig.save();

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