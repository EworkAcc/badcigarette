import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import { getAuthCookie } from '@/lib/authUtils.server';
import { calculateOverallRating } from '@/lib/ratingCalculator';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string; commentId: string }> }
) {
  try {
    const { id: cigaretteId, postId, commentId } = await params;

    const userData = await getAuthCookie(request);
    if (!userData) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const subCigarette = await subCigarettes.findOne({
      id: cigaretteId,
      'posts.id': postId
    });

    if (!subCigarette) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const postIndex = subCigarette.posts.findIndex((p: any) => p.id === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const commentIndex = subCigarette.posts[postIndex].comments.findIndex((c: any) => c.id === commentId);
    if (commentIndex === -1) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    const comment = subCigarette.posts[postIndex].comments[commentIndex];
    
    if (comment.userEmail !== userData.email) {
      return NextResponse.json(
        { message: 'Unauthorized - you can only delete your own comments' },
        { status: 403 }
      );
    }

    const commentsToRemove = [commentId];
    const allComments = subCigarette.posts[postIndex].comments;
    
    const findReplies = (parentId: string) => {
      allComments.forEach((c: any) => {
        if (c.parentId === parentId && !commentsToRemove.includes(c.id)) {
          commentsToRemove.push(c.id);
          findReplies(c.id); 
        }
      });
    };
    
    findReplies(commentId);

    subCigarette.posts[postIndex].comments = allComments.filter((c: any) => 
      !commentsToRemove.includes(c.id)
    );

    const { rating: newOverallRating, totalReviews } = calculateOverallRating(subCigarette.posts);
    subCigarette.rating = newOverallRating;
    subCigarette.noOfReviews = totalReviews;

    await subCigarette.save();

    return NextResponse.json({
      message: 'Comment deleted successfully',
      deletedCount: commentsToRemove.length,
      updatedRating: subCigarette.rating,
      totalReviews: subCigarette.noOfReviews
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}