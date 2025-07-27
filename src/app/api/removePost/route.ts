import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/connectDB';
import subCigarettes from '../../../models/subCigarettes';
import GoogleUser from '../../../models/googleUsers';
import User from '../../../models/User';

export async function DELETE(request: NextRequest) {
  try {
    const { postId, userEmail } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { message: 'User email is required' },
        { status: 401 }
      );
    }

    await connectDB();

    let authenticatedUser = null;
    
    authenticatedUser = await GoogleUser.findOne({ email: userEmail });
    
    if (!authenticatedUser) {
      authenticatedUser = await User.findOne({ email: userEmail });
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { message: 'User not found. Please log in again.' },
        { status: 401 }
      );
    }

    const userDisplayName = authenticatedUser.name || 
      (authenticatedUser.fname && authenticatedUser.lname ? 
        `${authenticatedUser.fname} ${authenticatedUser.lname}` : 
        authenticatedUser.email);

    const subCigarette = await subCigarettes.findOne({
      'posts.id': postId
    });

    if (!subCigarette) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const postIndex = subCigarette.posts.findIndex((post: any) => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const post = subCigarette.posts[postIndex];

    if (post.userEmail !== userEmail) {
      return NextResponse.json(
        { message: 'Unauthorized: You can only delete your own posts' },
        { status: 403 }
      );
    }

    subCigarette.posts.splice(postIndex, 1);

    subCigarette.noOfReviews = subCigarette.posts.length;
    
    if (subCigarette.posts.length > 0) {
      const totalRating = subCigarette.posts.reduce((sum: number, post: any) => sum + (post.rating || 0), 0);
      subCigarette.rating = totalRating / subCigarette.posts.length;
    } else {
      subCigarette.rating = 0;
    }

    await subCigarette.save();

    return NextResponse.json(
      {
        message: 'Post deleted successfully',
        data: {
          deletedPostId: postId,
          updatedRating: subCigarette.rating,
          totalReviews: subCigarette.noOfReviews
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Remove post error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}