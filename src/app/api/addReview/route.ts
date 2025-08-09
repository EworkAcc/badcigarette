import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import generateUniqueId from '@/lib/uniqueID';
import { getAuthCookie } from '@/lib/authUtils.server';
import { RateLimitService } from '@/lib/rateLimitService';

export async function POST(request: NextRequest) {
  try {
    const { subCigaretteId, rating, reviewText, title } = await request.json();

    if (!subCigaretteId || !reviewText || !title) {
      return NextResponse.json(
        { message: 'SubCigarette ID, review text, and title are required' },
        { status: 400 }
      );
    }
    
    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const rateLimitCheck = await RateLimitService.checkPostLimit(
      userData.id, 
      userData.email, 
      subCigaretteId
    );

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          message: rateLimitCheck.message,
          remainingTime: rateLimitCheck.remainingTime 
        },
        { status: 429 }
      );
    }

    await connectDB();

    const subCigarette = await subCigarettes.findOne({ id: subCigaretteId });
    if (!subCigarette) {
      return NextResponse.json(
        { message: 'SubCigarette not found' },
        { status: 404 }
      );
    }

    const newPost = {
      id: generateUniqueId(),
      title: title,
      body: reviewText,
      subCigaretteId: subCigaretteId,
      comments: [],
      user: userData.name,
      userEmail: userData.email,
      userImage: userData.image || '/defaultPFP.png',
      votes: {
        id: generateUniqueId(),
        noOfUpvotes: 0,
        noOfDownvotes: 0,
        userUp: [],
        userDown: []
      },
      rating: rating || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    subCigarette.posts.push(newPost);
   
    subCigarette.noOfReviews = subCigarette.posts.length;
   
    const totalRating = subCigarette.posts.reduce((sum: number, post: any) => sum + (post.rating || 0), 0);
    subCigarette.rating = subCigarette.posts.length > 0 ? totalRating / subCigarette.posts.length : 0;

    const savedSubCigarette = await subCigarette.save();

    await RateLimitService.recordPost(userData.id, userData.email, subCigaretteId);

    return NextResponse.json(
      {
        message: 'Review added successfully',
        data: {
          post: newPost,
          updatedRating: subCigarette.rating,
          totalReviews: subCigarette.noOfReviews
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}