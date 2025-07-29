import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import subCigarettes from '@/models/subCigarettes';
import { getAuthCookie } from '@/lib/authUtils.server';
import generateUniqueId from '@/lib/uniqueID';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string; commentId: string }> }
) {
  try {
    const { id: cigaretteId, postId, commentId } = await params;
    const { voteType } = await request.json();

    if (!voteType) {
      return NextResponse.json(
        { message: 'Missing vote type' },
        { status: 400 }
      );
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { message: 'Invalid vote type' },
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

    const userId = userData.id;

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
    
    if (!comment.votes || !Array.isArray(comment.votes.userUp) || !Array.isArray(comment.votes.userDown)) {
      comment.votes = {
        id: generateUniqueId(),
        noOfUpvotes: 0,
        noOfDownvotes: 0,
        userUp: [],
        userDown: []
      };
    }

    const userUpIndex = comment.votes.userUp.indexOf(userId);
    const userDownIndex = comment.votes.userDown.indexOf(userId);

    if (voteType === 'upvote') {
      if (userUpIndex > -1) {
        comment.votes.userUp.splice(userUpIndex, 1);
        comment.votes.noOfUpvotes = Math.max(0, comment.votes.noOfUpvotes - 1);
      } else {
        comment.votes.userUp.push(userId);
        comment.votes.noOfUpvotes += 1;
        if (userDownIndex > -1) {
          comment.votes.userDown.splice(userDownIndex, 1);
          comment.votes.noOfDownvotes = Math.max(0, comment.votes.noOfDownvotes - 1);
        }
      }
    } else if (voteType === 'downvote') {
      if (userDownIndex > -1) {
        comment.votes.userDown.splice(userDownIndex, 1);
        comment.votes.noOfDownvotes = Math.max(0, comment.votes.noOfDownvotes - 1);
      } else {
        comment.votes.userDown.push(userId);
        comment.votes.noOfDownvotes += 1;
        if (userUpIndex > -1) {
          comment.votes.userUp.splice(userUpIndex, 1);
          comment.votes.noOfUpvotes = Math.max(0, comment.votes.noOfUpvotes - 1);
        }
      }
    }

    subCigarette.posts[postIndex].comments[commentIndex] = comment;

    await subCigarette.save();

    return NextResponse.json({
      message: 'Vote updated successfully',
      votes: comment.votes
    });

  } catch (error) {
    console.error('Error updating comment vote:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}