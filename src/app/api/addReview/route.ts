import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/connectDB';
import subCigarettes from '../../../models/subCigarettes';

const generateNumericId = () => Math.floor(Math.random() * 1000000000);

export async function POST(request: NextRequest) {
  try {
    const { subCigaretteId, rating, reviewText, user, userImage } = await request.json();

    if (!subCigaretteId || !reviewText || !user) {
      return NextResponse.json(
        { message: 'SubCigarette ID, review text, and user are required' },
        { status: 400 }
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
      id: generateNumericId(), 
      title: `Review by ${user}`,
      body: reviewText,
      subCigaretteId: subCigaretteId,
      comments: [],
      user: user,
      userImage: userImage || null,
      votes: {
        isUpvote: false, 
        user: user,
        upvotes: 0,
        downvotes: 0
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